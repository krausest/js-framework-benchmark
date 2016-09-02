import * as chrome from 'selenium-webdriver/chrome'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import {BenchmarkType, Benchmark, benchmarks} from './benchmarks'
import {forProm} from './webdriverAccess'

import * as fs from 'fs';
import * as yargs from 'yargs'; 
import {JSONResult, config} from './common'
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
        let lastPaint : Timingresult = null;
        let mem : Timingresult = null;
        let results = entries.forEach(x => 
        {
            let e = JSON.parse(x.message).message;
            if (config.LOG_DEBUG) console.log(e);
            if (e.params.name==='EventDispatch') {
                if (e.params.args.data.type==="click") {
                    let end = +e.params.ts+e.params.dur;
                    click = {type:'click', ts: +e.params.ts, dur: +e.params.dur, end: end};
                }
            } else if (e.params.name==='Paint') {
                if (click && e.params.ts > click.end) {
                    lastPaint = {type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur};
                }
            } else if (e.params.name==='MajorGC' && e.params.args.usedHeapSizeAfter) {
                mem = {type:'gc', ts: +e.params.ts, mem: Number(e.params.args.usedHeapSizeAfter)/1024/1024};
            }
        });
        return [click, lastPaint, mem];
    });
}

interface FrameworkData {
    name: string;
    uri: string;
}

function f(name: string, uri: string = null): FrameworkData 
{
    return {name, uri: uri? uri : name};
}

let frameworks = [
    f("angular-v1.5.8"),
    f("angular-v2.0.0-rc5"),
    f("aurelia-v1.0.0", "aurelia-v1.0.0/dist"),
    f("bobril-v4.44.1"),
    f("cyclejs-v7.0.0"),
    f("domvm-v1.2.10"),
    f("inferno-v0.7.26"),
    f("kivi-v1.0.0-rc0"),
    f("mithril-v0.2.5"),
    f("mithril-v1.0.0-alpha"),
    f("plastiq-v1.33.0"),
    f("preact-v5.7.0"),
    f("ractive-v0.7.3"),
    f("ractive-edge"),
    f("react-lite-v0.15.17"),
    f("react-v15.3.1"),
    f("react-v15.3.1-mobX-v2.5.0"),
    f("riot-v2.6.1"),
    f("tsers-v1.0.0"),
    f("vanillajs"),
    f("vidom-v0.3.18"),
    f("vue-v1.0.26"),
    f("vue-v2.0.0-beta1")        
];

function buildDriver() {
    let logPref = new logging.Preferences();
    logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    // logPref.setLevel(logging.Type.BROWSER, logging.Level.ALL);

    let options = new chrome.Options();
    // options = options.setChromeBinaryPath("/Applications/Chromium.app/Contents/MacOS/Chromium");
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.setLoggingPrefs(logPref);
    options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, enableTimeline: false, traceCategories: "browser,devtools.timeline,devtools", bufferUsageReportingInterval: 1000});

    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)    
        .build();
}

function reduceBenchmarkResults(benchmark: Benchmark, results: Timingresult[][]): number[] {
    if (config.LOG_DEBUG) console.log("data for reduceBenchmarkResults", results);
        if (benchmark.type === BenchmarkType.CPU) {
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat((val[1].end - val[0].ts)/1000.0), []);
        } else {
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat([val[2].mem]), []);
        }
}

function runBenchmark(driver: WebDriver, benchmark: Benchmark, framework: string) : promise.Promise<any> {
    return benchmark.run(driver)
        .then(() => {
            if (config.LOG_PROGRESS) console.log("after run ",benchmark.id, benchmark.type, framework);
            if (benchmark.type === BenchmarkType.MEM) {
                return driver.executeScript("window.gc();");
            }            
        })
        .then(() => readLogs(driver))
        .then((results) => {if (config.LOG_PROGRESS) console.log(`result ${framework}_${benchmark.id}`, results); return results});
}

function initBenchmark(driver: WebDriver, benchmark: Benchmark, framework: string) : promise.Promise<any> {
    return benchmark.init(driver)
    .then(() => {
        if (config.LOG_PROGRESS) console.log("after initialized ",benchmark.id, benchmark.type, framework);                                 
        if (benchmark.type === BenchmarkType.MEM) {
            return driver.executeScript("window.gc();");
        }
    })
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

function writeResult(res: Result) {
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
        fs.writeFileSync(`results/${framework}_${benchmark.id}.json`, JSON.stringify(result), {encoding: "utf8"});
}

function runBench(frameworkNames: string[], benchmarkNames: string[]): promise.Promise<any> {
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
        console.log("benchmarking ", framework, benchmark.id);
        let driver = buildDriver();
        return forProm(0, config.REPEAT_RUN, () => {
            return driver.get(`http://localhost:8080/${framework.uri}/`)
            .then(() => initBenchmark(driver, benchmark, framework.name))
            .then(() => clearLogs(driver))
            .then(() => runBenchmark(driver, benchmark, framework.name))
        })
        .then(results => reduceBenchmarkResults(benchmark, results))
        .then(results => {  
            writeResult({framework: framework, results: results, benchmark: benchmark});
        })
        .thenFinally(() => {console.log("QUIT"); driver.quit();})
    });
}

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...] [--benchmark Benchmark1,Benchmark2,...]")
.help('help')
.array("framework").array("benchmark").argv;

let runBenchmarks = args.benchmark && args.benchmark.length>0 ? args.benchmark : [""];
let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];

if (!fs.existsSync("results"))
    fs.mkdirSync("results");

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks, runBenchmarks);
}

