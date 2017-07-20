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
        if (config.LOG_DEBUG) entries.forEach(x => console.log("DISCARDED", x));
    });
}

function readLogs(driver: WebDriver): promise.Promise<Timingresult[]> {
    return driver.manage().logs().get(logging.Type.BROWSER).then(entries => {
        let results = entries.forEach(x => console.log(x));
    }).then(() => driver.manage().logs().get(logging.Type.PERFORMANCE).then(entries => {
        let click : Timingresult = null;
        let lastPaint : Timingresult = {type:'paint', ts: 0, dur: 0, end: 0};;
        let mem : Timingresult = null;
        let navigationStart : Timingresult = null;
        let results = entries.forEach(x => 
        {
            if (config.LOG_DEBUG) console.log(x.message);
            let e = JSON.parse(x.message).message;
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
            } else if (e.params.name==='MinorGC' && mem===null && e.params.args.usedHeapSizeAfter) {
                mem = {type:'gc', ts: +e.params.ts, mem: Number(e.params.args.usedHeapSizeAfter)/1024/1024};
            }
        });
        return [click, lastPaint, mem, navigationStart];
    }));
}

function buildDriver() {
    let logPref = new logging.Preferences();
    logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    logPref.setLevel(logging.Type.BROWSER, logging.Level.ALL);

    let options = new chrome.Options();
    // options = options.setChromeBinaryPath("/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome");
    // options = options.setChromeBinaryPath("/Applications/Chromium.app/Contents/MacOS/Chromium");
    // options = options.setChromeBinaryPath("/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary");
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.addArguments("--disable-infobars");
    options = options.addArguments("--disable-background-networking");
    options = options.setLoggingPrefs(logPref);
    options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, enableTimeline: false, traceCategories: "devtools.timeline,blink.user_timing", bufferUsageReportingInterval: 20000});
    // options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, enableTimeline: false, traceCategories: "v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline,blink.user_timing", bufferUsageReportingInterval: 20000});
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)    
        .build();
}

function reduceBenchmarkResults(benchmark: Benchmark, results: number[][]|Timingresult[][]): number[] {
        if (benchmark.type === BenchmarkType.CPU) {
            if ((results as Timingresult[][]).some(val => val[0]==null || val[1]==null)) {
                console.log("data for CPU reduceBenchmarkResults", results);
                throw `Data wasn't extracted from timeline as expected for ${benchmark.id}. Make sure that your browser window was visible all the time the benchmark was running!`;
            }
            return (results as Timingresult[][]).reduce((acc: number[], val: Timingresult[]): number[] => acc.concat((val[1].end - val[0].ts)/1000.0), []);
        } else if (benchmark.type === BenchmarkType.MEM) {
            if ((results as Timingresult[][]).some(val => val[2]==null)) {
                console.log("data for MEM reduceBenchmarkResults", results);
                throw `Data wasn't extracted from timeline as expected for ${benchmark.id}. Make sure that your browser window was visible all the time the benchmark was running!`;
            }
            return (results as Timingresult[][]).reduce((acc: number[], val: Timingresult[]): number[] => acc.concat([val[2].mem]), []);
        } else if (benchmark.type === BenchmarkType.STARTUP) {
            if ((results as number[][]).some(val => val[1]==null || val[3]==null)) {
                console.log("data for STARTUP reduceBenchmarkResults", results);
                throw `Data wasn't extracted from timeline as expected for ${benchmark.id}. Make sure that your browser window was visible all the time the benchmark was running!`;
            }
            return (results as number[][]).reduce((acc: number[], val: number[]): number[] => acc.concat(val[1] - val[3]), []);
        }
}

function snapMemorySize(driver: WebDriver) {
		driver.executeScript(":takeHeapSnapshot").then((heapSnapshot: any) => {
            let node_fields: any = heapSnapshot.snapshot.meta.node_fields;
            let nodes: any = heapSnapshot.nodes;
            
            let k = node_fields.indexOf("self_size");

            let self_size = 0;
            for(let l = nodes.length, d = node_fields.length; k < l; k += d) {
                self_size += nodes[k];
            }
            
            let memory = self_size / 1024.0 / 1024.0;
        });
}

function runBenchmark(driver: WebDriver, benchmark: Benchmark, framework: FrameworkData) : promise.Promise<any> {
    return benchmark.run(driver, framework)
        .then(() => {
            if (config.LOG_PROGRESS) console.log("after run ",benchmark.id, benchmark.type, framework.name);
            if (benchmark.type === BenchmarkType.MEM) {
                return driver.executeScript("window.gc();");
            }            
        })
        .then(() => {
            if (benchmark.type === BenchmarkType.MEM) {
                // Without it angular v4.2.1 reports no MajorGC
                return snapMemorySize(driver);
            } else if (benchmark.type === BenchmarkType.STARTUP) {
                // Without it angular v4.2.1 reports no MajorGC
                return driver.sleep(2000);
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
    .catch((err:any) => {
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
        data = data.slice(0).sort((a:number,b:number) => a-b);
        // data = data.slice(0, config.REPEAT_RUN - config.DROP_WORST_RUN);
        let s = jStat(data);
        console.log(`result ${fileName(res.framework, benchmark)}`, s.min(), s.max(), s.mean(), s.stdev());
        let result: JSONResult = {
            "framework": framework,
            "benchmark": benchmark.id,
            "type": benchmark.type === BenchmarkType.CPU ? "cpu" : "memory",
            "min": s.min(),
            "max": s.max(),
            "mean": s.mean(),
            "median": s.median(),
            "geometricMean": s.geomean(),
            "standardDeviation": s.stdev(),
            "values": res.results
        }
        fs.writeFileSync(`${dir}/${fileName(res.framework, benchmark)}`, JSON.stringify(result), {encoding: "utf8"});
}

function takeScreenshotOnError(driver: WebDriver, fileName: string, error: string): promise.Promise<any> {
    console.error("Benchmark failed");
    return driver.takeScreenshot().then(
        function(image) {
            console.error(`Writing screenshot ${fileName}`);
            fs.writeFileSync(fileName, image, {encoding: 'base64'});
        }
    );                
}

function runMemOrCPUBenchmark(framework: FrameworkData, benchmark: Benchmark) : promise.Promise<any> {
        console.log("benchmarking ", framework, benchmark.id);
        let driver = buildDriver();
        return forProm(0, config.REPEAT_RUN, () => {
            setUseShadowRoot(framework.useShadowRoot);
            return driver.get(`http://localhost:8080/${framework.uri}/`)
            .then(() => initBenchmark(driver, benchmark, framework))
            .then(() => runBenchmark(driver, benchmark, framework))
            .catch((e) => takeScreenshotOnError(driver, 'error-'+framework.name+'-'+benchmark.id+'.png', e).then(
                    () => {throw e})
            );
        })
        .then(results => reduceBenchmarkResults(benchmark, results))
        .then(results => writeResult({framework: framework, results: results, benchmark: benchmark}, dir))
        .then(() => {console.log("QUIT"); driver.quit();}, 
            () => {
                console.log("QUIT after error"); 
                return driver.quit().then(() => {if (config.EXIT_ON_ERROR) { throw "Benchmarking failed"}
            });
    })
}

function runStartupBenchmark(framework: FrameworkData, benchmark: Benchmark) : promise.Promise<any> {
        console.log("benchmarking ", framework, benchmark.id);
        let results : number[][] = [];
        let chromeDuration = 0;
        return forProm(0, config.REPEAT_RUN, () => {
            let driver = buildDriver();
            setUseShadowRoot(framework.useShadowRoot);
            return initBenchmark(driver, benchmark, framework)
            .then(() => runBenchmark(driver, benchmark, framework))
            .then(results => { chromeDuration = (results[1].end - results[3].ts)/1000.0; console.log("startup duration chrome log: ",chromeDuration) })
            .then(() => driver.executeScript("return [null, window.performance.timing.loadEventEnd, null, window.performance.timing.navigationStart]"))
            .then((res: number[]) => {
                let navtime = res[1] - res[3];
                if (Math.abs(navtime - chromeDuration) > 5) {
                    console.log("*********** Large difference between navigation and chrome log", navtime, chromeDuration);
                }
                if (chromeDuration<0) {
                    console.log("*********** chromeDuration is negative", navtime, chromeDuration);                    
                }
                console.log("startup duration navigation timing", res[1] - res[3]); 
                results.push(res); 
            })
            // Check what we measured. Results are pretty similar, though we are measuring a bit longer until the final repaint happened.
            .then(() => {console.log("QUIT"); driver.quit()},
                (e) => takeScreenshotOnError(driver, 'error-'+framework.name+'-'+benchmark.id+'.png', e).then(
                        () => {
                            return driver.quit().then(() => {throw e});
                        }
                    )
            )
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
.usage("$0 [--framework Framework1,Framework2,...] [--benchmark Benchmark1,Benchmark2,...] [--count n] [--exitOnError]")
.help('help')
.default('check','false')
.default('exitOnError','false')
.default('count', config.REPEAT_RUN)
.array("framework").array("benchmark").argv;

console.log(args);

let runBenchmarks = args.benchmark && args.benchmark.length>0 ? args.benchmark : [""];
let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];
let count = Number(args.count);

config.REPEAT_RUN = count;

let dir = args.check === 'true' ? "results_check" : "results"
let exitOnError = args.exitOnError === 'true'

config.EXIT_ON_ERROR = exitOnError;

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks, runBenchmarks, dir);
}

