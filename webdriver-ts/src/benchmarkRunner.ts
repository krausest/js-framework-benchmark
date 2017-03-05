import * as chrome from 'selenium-webdriver/chrome'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import {BenchmarkType, Benchmark, benchmarks, fileName} from './benchmarks'
import {forProm, setUseShadowRoot} from './webdriverAccess'

import * as fs from 'fs';
import * as yargs from 'yargs'; 
import {JSONResult, config, FrameworkData, frameworks} from './common'
var chromedriver:any = require('chromedriver');
var jStat:any = require('jstat').jStat;

interface Timingresult {
    type: string;
    ts: number;
    dur?: number;
    end?: number;
    mem?: number;
}

function clearLogs(driver: WebDriver): promise.Promise<void> {
    return driver.manage().logs().get(logging.Type.PERFORMANCE).then(entries => {
        if (config.LOG_DEBUG) {
            let results = entries.forEach(x => 
            {                
                let e = JSON.parse(x.message).message;
                console.log(e);
            });
        }
    });
}

function readLogs(driver: WebDriver): promise.Promise<Timingresult[]> {
    return driver.manage().logs().get(logging.Type.PERFORMANCE).then(entries => {
        let click : Timingresult = null;
        let lastPaint : Timingresult = {type:'paint', ts: 0, dur: 0, end: 0};;
        let mem : Timingresult = null;
        let navigationStart : Timingresult = null;
        let results = entries.forEach(x => 
        {
            let e = JSON.parse(x.message).message;
            if (config.LOG_DEBUG) console.log(e);
            if (e.params.name==='EventDispatch') {
                if (e.params.args.data.type==="click") {
                    let end = +e.params.ts+e.params.dur;
                    click = {type:'click', ts: +e.params.ts, dur: +e.params.dur, end: end};
                }
            } else if (e.params.name==='navigationStart') {
                    navigationStart = {type:'navigationStart', ts: +e.params.ts, dur: 0, end: +e.params.ts};
                    console.log("navigationStart found");
            } else if (e.params.name==='Paint') {
                if (e.params.ts > lastPaint.ts) {
                    lastPaint = {type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur};
                }
            } else if (e.params.name==='MajorGC' && e.params.args.usedHeapSizeAfter) {
                mem = {type:'gc', ts: +e.params.ts, mem: Number(e.params.args.usedHeapSizeAfter)/1024/1024};
            }
        });
        return [click, lastPaint, mem, navigationStart];
    });
}

function buildDriver() {
    let logPref = new logging.Preferences();
    logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    // logPref.setLevel(logging.Type.BROWSER, logging.Level.ALL);

    let options = new chrome.Options();
    // options = options.setChromeBinaryPath("/Applications/Chromium.app/Contents/MacOS/Chromium");
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.setLoggingPrefs(logPref);
    options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, enableTimeline: false, traceCategories: "v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline,blink.user_timing", bufferUsageReportingInterval: 10000});

    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)    
        .build();
}

function reduceBenchmarkResults(benchmark: Benchmark, results: Timingresult[][]): number[] {
        if (benchmark.type === BenchmarkType.CPU) {
            if (results.some(val => val[0]==null || val[1]==null)) {
                console.log("data for CPU reduceBenchmarkResults", results);
                throw `Data wasn't extracted from timeline as expected for ${benchmark.id}. Make sure that your browser window was visible all the time the benchmark was running!`;
            }
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat((val[1].end - val[0].ts)/1000.0), []);
        } else if (benchmark.type === BenchmarkType.MEM) {
            if (results.some(val => val[2]==null)) {
                console.log("data for MEM reduceBenchmarkResults", results);
                throw `Data wasn't extracted from timeline as expected for ${benchmark.id}. Make sure that your browser window was visible all the time the benchmark was running!`;
            }
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat([val[2].mem]), []);
        } else if (benchmark.type === BenchmarkType.STARTUP) {
            if (results.some(val => val[1]==null || val[3]==null)) {
                console.log("data for STARTUP reduceBenchmarkResults", results);
                throw `Data wasn't extracted from timeline as expected for ${benchmark.id}. Make sure that your browser window was visible all the time the benchmark was running!`;
            }
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat((val[1].end - val[3].ts)/1000.0), []);
        }
}

function runBenchmark(driver: WebDriver, benchmark: Benchmark, framework: FrameworkData) : promise.Promise<any> {
    return benchmark.run(driver, framework)
        .then(() => {
            if (config.LOG_PROGRESS) console.log("after run ",benchmark.id, benchmark.type, framework.name);
            if (benchmark.type === BenchmarkType.MEM) {
                return driver.executeScript("window.gc();");
            }            
        })
        .then(() => readLogs(driver))
        .then((results) => {if (config.LOG_PROGRESS) console.log(`result ${framework}_${benchmark.id}`, results); return results});
}

function initBenchmark(driver: WebDriver, benchmark: Benchmark, framework: FrameworkData) : promise.Promise<any> {
    return benchmark.init(driver, framework)
    .then(() => {
        if (config.LOG_PROGRESS) console.log("after initialized ",benchmark.id, benchmark.type, framework.name);                                 
        if (benchmark.type === BenchmarkType.MEM) {
            return driver.executeScript("window.gc();");
        }
    })
    .then(() => clearLogs(driver))
    .thenCatch( (err) => {
        console.log(`error in initBenchmark ${framework} ${benchmark.id}`);
        throw err;
    });
}

interface Result {
    framework: FrameworkData;
    results: number[];
    benchmark: Benchmark    
}

function writeResult(res: Result, dir: string) {
    let benchmark = res.benchmark;
        let framework = res.framework.name;
        let data = res.results;
        data = data.splice(0).sort((a:number,b:number) => a-b);
        data = data.slice(0, config.REPEAT_RUN - config.DROP_WORST_RUN);
        let s = jStat(data);
        console.log(`result ${framework}_${benchmark.id}`, s.min(), s.max(), s.mean(), s.stdev());
        let result: JSONResult = {
            "framework": framework,
            "benchmark": benchmark.id,
            "type": benchmark.type === BenchmarkType.CPU ? "cpu" : "memory",
            "min": s.min(),
            "max": s.max(),
            "mean": s.mean(),
            "geometricMean": s.geomean(),
            "standardDeviation": s.stdev()
        }
        fs.writeFileSync(`${dir}/${fileName(framework, benchmark)}`, JSON.stringify(result), {encoding: "utf8"});
}

function runMemOrCPUBenchmark(framework: FrameworkData, benchmark: Benchmark) : promise.Promise<any> {
        console.log("benchmarking ", framework, benchmark.id);
        let driver = buildDriver();
        return forProm(0, config.REPEAT_RUN, () => {
            setUseShadowRoot(framework.useShadowRoot);
            return driver.get(`http://localhost:8080/${framework.uri}/`)
            .then(() => initBenchmark(driver, benchmark, framework))
            .then(() => runBenchmark(driver, benchmark, framework))
            .thenCatch((e) => {
                console.error("Benchmark failed",e);
                driver.takeScreenshot().then(
                    function(image) {
                        require('fs').writeFileSync('error-'+framework+'-'+benchmark.id+'.png', image, 'base64', function(err:any) {
                            console.log(err);
                        });
                        throw e;
                    }
                );                
            });
        })
        .then(results => reduceBenchmarkResults(benchmark, results))
        .then(results => writeResult({framework: framework, results: results, benchmark: benchmark}, dir))
        .thenFinally(() => {console.log("QUIT"); driver.quit();})
}

function runStartupBenchmark(framework: FrameworkData, benchmark: Benchmark) : promise.Promise<any> {
        console.log("benchmarking ", framework, benchmark.id);
        let results : Timingresult[][] = [];
        return forProm(0, config.REPEAT_RUN, () => {
            let driver = buildDriver();
            setUseShadowRoot(framework.useShadowRoot);
            return initBenchmark(driver, benchmark, framework)
            .then(() => runBenchmark(driver, benchmark, framework))
            .then((res) => results.push(res))
            // Check what we measured. Results are pretty similar, though we are measuring a bit longer until the final repaint happened.
            // .then(() => driver.executeScript("return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart"))
            // .then((duration) => console.log(duration, typeof duration))            
            .thenCatch((e) => {
                console.error("Benchmark failed",e);
                driver.takeScreenshot().then(
                    function(image) {
                        (<any>fs).writeFileSync('error-'+framework+'_startup.png', image, 'base64', function(err:any) {
                            console.log(err);
                        });
                        throw e;
                    }
                );                
            })
            .thenFinally(() => {console.log("QUIT"); driver.quit();})
        })
        .then(() => reduceBenchmarkResults(benchmark, results))
        .then(results => writeResult({framework: framework, results: results, benchmark: benchmark}, dir))
}

function runBench(frameworkNames: string[], benchmarkNames: string[], dir: string): promise.Promise<any> {
    let runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.name.indexOf(name)>-1));
    let runBenchmarks = benchmarks.filter(b => benchmarkNames.some(name => b.id.toLowerCase().indexOf(name)>-1));
    console.log("Frameworks that will be benchmarked", runFrameworks);
    console.log("Benchmarks that will be run", runBenchmarks.map(b => b.id));

    let data : [[FrameworkData, Benchmark]] = <any>[];
    for (let i=0;i<runFrameworks.length;i++) {
       for (let j=0;j<runBenchmarks.length;j++) {
           data.push( [runFrameworks[i], runBenchmarks[j]] );
       }
    }

    return forProm(0, data.length, (i) => {
        let framework = data[i][0];
        let benchmark = data[i][1];
        if (benchmark.type == BenchmarkType.STARTUP) {
            return runStartupBenchmark(framework, benchmark);
        } else {
            return runMemOrCPUBenchmark(framework, benchmark);
        }
    });
}

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...] [--benchmark Benchmark1,Benchmark2,...]")
.help('help')
.default('check','false')
.array("framework").array("benchmark").argv;

console.log(args);

let runBenchmarks = args.benchmark && args.benchmark.length>0 ? args.benchmark : [""];
let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];

let dir = args.check === 'true' ? "results_check" : "results"

console.log("target directory", dir);

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks, runBenchmarks, dir);
}

