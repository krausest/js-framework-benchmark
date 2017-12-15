import * as chrome from 'selenium-webdriver/chrome'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import {BenchmarkType, Benchmark, benchmarks, fileName, LighthouseData} from './benchmarks'
import {setUseShadowRoot} from './webdriverAccess'

const lighthouse = require('lighthouse');

import {lhConfig} from './lighthouseConfig';
import * as fs from 'fs';
import * as yargs from 'yargs';
import {JSONResult, config, FrameworkData, frameworks} from './common'
import * as R from 'ramda';
var chromedriver:any = require('chromedriver');
var jStat:any = require('jstat').jStat;

promise.USE_PROMISE_MANAGER = false;

interface Timingresult {
    type: string;
    ts: number;
    dur?: number;
    end?: number;
    mem?: number;
    evt?: any;
}

function extractRelevantEvents(entries: logging.Entry[]) {
    let filteredEvents: Timingresult[] = [];
    let protocolEvents: any[] = [];
    entries.forEach(x => {
        let e = JSON.parse(x.message).message;
        if (config.LOG_DETAILS) console.log(JSON.stringify(e));
        if (e.method === 'Tracing.dataCollected') {
            protocolEvents.push(e)
        }
        if (e.method && (e.method.startsWith('Page') || e.method.startsWith('Network'))) {
            protocolEvents.push(e)
        } else if (e.params.name==='EventDispatch') {
            if (e.params.args.data.type==="click") {
                filteredEvents.push({type:'click', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur});
            }
        } else if (e.params.name==='TimeStamp' &&
            (e.params.args.data.message==='afterBenchmark' || e.params.args.data.message==='finishedBenchmark' || e.params.args.data.message==='runBenchmark' || e.params.args.data.message==='initBenchmark')) {
            filteredEvents.push({type: e.params.args.data.message, ts: +e.params.ts, dur: 0, end: +e.params.ts});
        } else if (e.params.name==='navigationStart') {
            filteredEvents.push({type:'navigationStart', ts: +e.params.ts, dur: 0, end: +e.params.ts});
        } else if (e.params.name==='Paint') {
            filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur, evt: JSON.stringify(e)});
        // } else if (e.params.name==='Rasterize') {
        //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur, evt: JSON.stringify(e)});
        // } else if (e.params.name==='CompositeLayers') {
        //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts, evt: JSON.stringify(e)});
        // } else if (e.params.name==='Layout') {
        //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: e.params.ts, evt: JSON.stringify(e)});
        // } else if (e.params.name==='UpdateLayerTree') {
        //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur, evt: JSON.stringify(e)});
        } else if (e.params.name==='MajorGC' && e.params.args.usedHeapSizeAfter) {
            filteredEvents.push({type:'gc', ts: +e.params.ts, end:+e.params.ts, mem: Number(e.params.args.usedHeapSizeAfter)/1024/1024});
        }
    });
    return {filteredEvents, protocolEvents};
}

async function fetchEventsFromPerformanceLog(driver: WebDriver): Promise<{timingResults: Timingresult[], protocolResults: any[]}> {
    let timingResults : Timingresult[] = [];
    let protocolResults : any[] = [];
    let entries = [];
    do {
        entries = await driver.manage().logs().get(logging.Type.PERFORMANCE);
        const {filteredEvents, protocolEvents} = extractRelevantEvents(entries);
        timingResults = timingResults.concat(filteredEvents);
        protocolResults = protocolResults.concat(protocolEvents);
    } while (entries.length > 0);
    return {timingResults, protocolResults};
}

function type_eq(requiredType: string) {
    return (e: Timingresult) => e.type=== requiredType;
}
function type_neq(requiredType: string) {
    return (e: Timingresult) => e.type !== requiredType;
}

function asString(res: Timingresult[]): string {
    return res.reduce((old, cur) => old + "\n" + JSON.stringify(cur), "");
}

async function runLighthouse(protocolResults: any[]): Promise<LighthouseData> {
    const traceEvents = protocolResults.filter(e => e.method === 'Tracing.dataCollected').map(e => e.params);
    const devtoolsLogs = protocolResults.filter(e => e.method.startsWith('Page') || e.method.startsWith('Network'));

    const filenamePrefix = `${process.cwd()}/${Date.now()}`;
    const traceFilename = `${filenamePrefix}.trace.json`;
    const devtoolslogsFilename = `${filenamePrefix}.devtoolslogs.json`;

    fs.writeFileSync(traceFilename, JSON.stringify({traceEvents}));
    fs.writeFileSync(devtoolslogsFilename, JSON.stringify(devtoolsLogs));
    lhConfig.artifacts.traces = {defaultPass: traceFilename};
    lhConfig.artifacts.devtoolsLogs = {defaultPass: devtoolslogsFilename};

    const lhResults = await lighthouse('http://example.com/thispage', {}, lhConfig);
    fs.unlinkSync(traceFilename);
    fs.unlinkSync(devtoolslogsFilename);

    const audits = lhResults.audits;
    let LighthouseData: LighthouseData = {
        TimeToConsistentlyInteractive: audits['consistently-interactive'].extendedInfo.value.timeInMs,
        ScriptBootUpTtime: audits['bootup-time'].rawValue,
        MainThreadWorkCost: audits['mainthread-work-breakdown'].rawValue,
        TotalByteWeight: audits['total-byte-weight'].rawValue,
    };

    return LighthouseData;
}

async function computeResultsCPU(driver: WebDriver): Promise<number[]> {
    let entriesBrowser = await driver.manage().logs().get(logging.Type.BROWSER);
    if (config.LOG_DEBUG) console.log("browser entries", entriesBrowser);
    const perfLogEvents = (await fetchEventsFromPerformanceLog(driver));
    let filteredEvents = perfLogEvents.timingResults;

    if (config.LOG_DEBUG) console.log("filteredEvents ", asString(filteredEvents));

    let remaining  = R.dropWhile(type_eq('initBenchmark'))(filteredEvents);
    let results = [];

    while (remaining.length >0) {
        let evts = R.splitWhen(type_eq('finishedBenchmark'))(remaining);
        if (R.find(type_neq('runBenchmark'))(evts[0]) && evts[1].length>0) {
            let eventsDuringBenchmark = R.dropWhile(type_neq('runBenchmark'))(evts[0]);

            if (config.LOG_DEBUG) console.log("eventsDuringBenchmark ", eventsDuringBenchmark);

            let clicks = R.filter(type_eq('click'))(eventsDuringBenchmark)
            if (clicks.length !== 1) {
                console.log("exactly one click event is expected", eventsDuringBenchmark);
                throw "exactly one click event is expected";
            }

            let eventsAfterClick = (R.dropWhile(type_neq('click'))(eventsDuringBenchmark));

            if (config.LOG_DEBUG) console.log("eventsAfterClick", eventsAfterClick);

            let paints = R.filter(type_eq('paint'))(eventsAfterClick);
            if (paints.length == 0) {
                console.log("at least one paint event is expected after the click event", eventsAfterClick);
                throw "at least one paint event is expected after the click event";
            }

            let lastPaint = R.reduce((max, elem) => max.end > elem.end ? max : elem, {end: 0}, paints);

            let upperBoundForSoundnessCheck = (R.last(eventsDuringBenchmark).end - eventsDuringBenchmark[0].ts)/1000.0;
            let duration = (lastPaint.end - clicks[0].ts)/1000.0;

            console.log("*** duration", duration, "upper bound ", upperBoundForSoundnessCheck);
            if (duration<0) {
                console.log("soundness check failed. reported duration is less 0", asString(eventsDuringBenchmark));
                throw "soundness check failed. reported duration is less 0";
            }

            if (duration > upperBoundForSoundnessCheck) {
                console.log("soundness check failed. reported duration is bigger than whole benchmark duration", asString(eventsDuringBenchmark));
                throw "soundness check failed. reported duration is bigger than whole benchmark duration";
            }
            results.push(duration);
        }
        remaining = R.drop(1, evts[1]);
    }
    if (results.length !== config.REPEAT_RUN) {
        console.log(`soundness check failed. number or results isn't ${config.REPEAT_RUN}`, results, asString(filteredEvents));
        throw `soundness check failed. number or results isn't ${config.REPEAT_RUN}`;
    }
    return results;
}

async function computeResultsMEM(driver: WebDriver): Promise<number[]> {
    let entriesBrowser = await driver.manage().logs().get(logging.Type.BROWSER);
    if (config.LOG_DEBUG) console.log("browser entries", entriesBrowser);
    let filteredEvents = (await fetchEventsFromPerformanceLog(driver)).timingResults;

    if (config.LOG_DEBUG) console.log("filteredEvents ", filteredEvents);

    let remaining  = R.dropWhile(type_eq('initBenchmark'))(filteredEvents);
    let results = [];

    while (remaining.length >0) {
        let evts = R.splitWhen(type_eq('finishedBenchmark'))(remaining);
        if (R.find(type_neq('runBenchmark'))(evts[0]) && evts[1].length>0) {
            let eventsDuringBenchmark = R.dropWhile(type_neq('runBenchmark'))(evts[0]);

            if (config.LOG_DEBUG) console.log("eventsDuringBenchmark ", eventsDuringBenchmark);

            let gcs = R.filter(type_eq('gc'))(eventsDuringBenchmark);

            let mem = R.last(gcs).mem;
            console.log("*** memory", mem);
            results.push(mem);
        }
        remaining = R.drop(1, evts[1]);
    }
    if (results.length !== config.REPEAT_RUN) {
        console.log(`soundness check failed. number or results isn't ${config.REPEAT_RUN}`, results, asString(filteredEvents));
        throw `soundness check failed. number or results isn't ${config.REPEAT_RUN}`;
    }
    return results;
}

async function computeResultsStartup(driver: WebDriver): Promise<LighthouseData> {
    let durationJSArr : number[] = await driver.executeScript("return [window.performance.timing.loadEventEnd, window.performance.timing.navigationStart]") as number[];
    let durationJS = (durationJSArr[0] as number) - (durationJSArr[1] as number);
    let reportedDuration = durationJS;

    let entriesBrowser = await driver.manage().logs().get(logging.Type.BROWSER);
    if (config.LOG_DEBUG) console.log("browser entries", entriesBrowser);

    const perfLogEvents = (await fetchEventsFromPerformanceLog(driver));
    let filteredEvents = perfLogEvents.timingResults;
    let protocolResults = perfLogEvents.protocolResults;
    return runLighthouse(protocolResults);
}

function buildDriver() {
    let logPref = new logging.Preferences();
    logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    logPref.setLevel(logging.Type.BROWSER, logging.Level.ALL);

    let options = new chrome.Options();
    if(args.headless) {
	options = options.addArguments("--headless");
	options = options.addArguments("--disable-gpu");
    }
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.addArguments("--no-sandbox");
    options = options.addArguments("--no-first-run");
    options = options.addArguments("--enable-automation");
    options = options.addArguments("--disable-infobars");
    options = options.addArguments("--disable-background-networking");
    options = options.addArguments("--disable-background-timer-throttling");
    options = options.addArguments("--disable-cache");
    options = options.addArguments("--disable-translate");
    options = options.addArguments("--disable-sync");
    options = options.addArguments("--disable-extensions");
    options = options.addArguments("--disable-default-apps");
    options = options.addArguments("--window-size=1200,800")
    if (args.chromeBinary) options = options.setChromeBinaryPath(args.chromeBinary);
    options = options.setLoggingPrefs(logPref);

    options = options.setPerfLoggingPrefs(<any>{
        enableNetwork: true, enablePage: true, enableTimeline: false,
        traceCategories: lighthouse.traceCategories.join(", ")
    });

    // Do the following lines really cause https://github.com/krausest/js-framework-benchmark/issues/303 ?
    // let service = new chrome.ServiceBuilder(args.chromeDriver).build();
    // return chrome.Driver.createSession(options, service);
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

async function forceGC(framework: FrameworkData, driver: WebDriver): Promise<any> {
    if (framework.name.startsWith("angular-v4")) {
        // workaround for window.gc for angular 4 - closure rewrites windows.gc");
        await driver.executeScript("window.Angular4PreservedGC();");
    } else {
        for (let i=0;i<5;i++) {
            await driver.executeScript("window.gc();");
        }
    }
}

async function snapMemorySize(driver: WebDriver): Promise<number> {
	let heapSnapshot: any = await driver.executeScript(":takeHeapSnapshot");
    let node_fields: any = heapSnapshot.snapshot.meta.node_fields;
    let nodes: any = heapSnapshot.nodes;

    let k = node_fields.indexOf("self_size");

    let self_size = 0;
    for(let l = nodes.length, d = node_fields.length; k < l; k += d) {
        self_size += nodes[k];
    }

    let memory = self_size / 1024.0 / 1024.0;
    return memory;
}

async function runBenchmark(driver: WebDriver, benchmark: Benchmark, framework: FrameworkData) : Promise<any> {
    await benchmark.run(driver, framework, port);
    if (config.LOG_PROGRESS) console.log("after run ",benchmark.id, benchmark.type, framework.name);
    if (benchmark.type === BenchmarkType.MEM) {
        await forceGC(framework, driver);
    }
}

async function afterBenchmark(driver: WebDriver, benchmark: Benchmark, framework: FrameworkData) : Promise<any> {
    if (benchmark.after) {
        await benchmark.after(driver, framework);
        if (config.LOG_PROGRESS) console.log("after benchmark ",benchmark.id, benchmark.type, framework.name);
    }
}

async function initBenchmark(driver: WebDriver, benchmark: Benchmark, framework: FrameworkData): Promise<any> {
    await benchmark.init(driver, framework, port)
    if (config.LOG_PROGRESS) console.log("after initialized ",benchmark.id, benchmark.type, framework.name);
    if (benchmark.type === BenchmarkType.MEM) {
        await forceGC(framework, driver);
    }
}

interface Result<T> {
    framework: FrameworkData;
    results: T[];
    benchmark: Benchmark
}

function writeResult<T>(res: Result<T>, dir: string) {
    let benchmark = res.benchmark;
    let framework = res.framework.name;

    for (let resultKind of benchmark.resultKinds()) {
        let data = benchmark.extractResult(res.results, resultKind);
        data = data.slice(0).sort((a:number,b:number) => a-b);
        // data = data.slice(0, config.REPEAT_RUN - config.DROP_WORST_RUN);
        let s = jStat(data);
        console.log(`result ${fileName(res.framework, resultKind)} min ${s.min()} max ${s.max()} mean ${s.mean()} median ${s.median()} stddev ${s.stdev()}`);
        let result: JSONResult = {
            "framework": framework,
            "benchmark": resultKind.id,
            "type": benchmark.type === BenchmarkType.CPU ? "cpu" : "memory",
            "min": s.min(),
            "max": s.max(),
            "mean": s.mean(),
            "median": s.median(),
            "geometricMean": s.geomean(),
            "standardDeviation": s.stdev(),
            "values": data
        }
        fs.writeFileSync(`${dir}/${fileName(res.framework, resultKind)}`, JSON.stringify(result), {encoding: "utf8"});
    }
}

async function takeScreenshotOnError(driver: WebDriver, fileName: string, error: string) {
    console.error("Benchmark failed",error);
    let image = await driver.takeScreenshot();
    console.error(`Writing screenshot ${fileName}`);
    fs.writeFileSync(fileName, image, {encoding: 'base64'});
}

const wait = (delay = 1000) => new Promise(res => setTimeout(res, delay));

async function runMemOrCPUBenchmark(framework: FrameworkData, benchmark: Benchmark, dir: string) {
        console.log("benchmarking ", framework, benchmark.id);
        let driver = buildDriver();
        try {
            for (let i = 0; i<config.REPEAT_RUN; i++) {
            try {
                setUseShadowRoot(framework.useShadowRoot);
                await driver.get(`http://localhost:` + args.port + `/${framework.uri}/`);
                await driver.executeScript("console.timeStamp('initBenchmark')");
                await initBenchmark(driver, benchmark, framework);
                await driver.executeScript("console.timeStamp('runBenchmark')");
                await runBenchmark(driver, benchmark, framework);
                await driver.executeScript("console.timeStamp('finishedBenchmark')");
                await afterBenchmark(driver, benchmark, framework);
                await driver.executeScript("console.timeStamp('afterBenchmark')");
            } catch (e) {
                await takeScreenshotOnError(driver, 'error-'+framework.name+'-'+benchmark.id+'.png', e);
                throw e;
            }
        }
        let results = benchmark.type === BenchmarkType.CPU ? await computeResultsCPU(driver) : await computeResultsMEM(driver);
        await writeResult({framework: framework, results: results, benchmark: benchmark}, dir);
        console.log("QUIT");
        await driver.quit();
    } catch (e) {
        console.log("ERROR:", e);
        console.log("QUIT");
        await driver.quit();
        if (config.EXIT_ON_ERROR) { throw "Benchmarking failed"}
    }
}

async function runStartupBenchmark(framework: FrameworkData, benchmark: Benchmark, dir: string) {
    console.log("benchmarking startup", framework, benchmark.id);
    let results : LighthouseData[] = [];
    let chromeDuration = 0;
    try {
        for (let i = 0; i<config.REPEAT_RUN; i++) {
            let driver = buildDriver();
            try {
                setUseShadowRoot(framework.useShadowRoot);
                await driver.executeScript("console.timeStamp('initBenchmark')");
                await initBenchmark(driver, benchmark, framework);
                await driver.executeScript("console.timeStamp('runBenchmark')");
                await runBenchmark(driver, benchmark, framework);
                await driver.executeScript("console.timeStamp('finishedBenchmark')");
                await afterBenchmark(driver, benchmark, framework);
                await driver.executeScript("console.timeStamp('afterBenchmark')");
                await wait(5000);
                results.push(await computeResultsStartup(driver));
            } catch (e) {
                await takeScreenshotOnError(driver, 'error-'+framework.name+'-'+benchmark.id+'.png', e);
                throw e;
            } finally {
                await driver.quit();
            }
        }
        await writeResult({framework: framework, results: results, benchmark: benchmark}, dir);
    } catch (e) {
        console.log("ERROR:", e);
        console.log("QUIT");
        if (config.EXIT_ON_ERROR) { throw "Benchmarking failed"}
    }
}

async function runBench(frameworkNames: string[], benchmarkNames: string[], dir: string) {
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

    for (let i = 0; i < data.length; i++) {
        let framework = data[i][0];
        let benchmark = data[i][1];
        if (benchmark.type == BenchmarkType.STARTUP) {
            await runStartupBenchmark(framework, benchmark, dir);
        } else {
            await runMemOrCPUBenchmark(framework, benchmark, dir);
        }
    }
}

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...] [--benchmark Benchmark1,Benchmark2,...] [--count n] [--exitOnError]")
.help('help')
.default('check','false')
.default('exitOnError','false')
.default('count', config.REPEAT_RUN)
.default('port', config.PORT)
.string('chromeBinary')
.string('chromeDriver')
.boolean('headless')
.array("framework").array("benchmark").argv;

console.log(args);

let runBenchmarks = args.benchmark && args.benchmark.length>0 ? args.benchmark : [""];
let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];
let count = Number(args.count);
let port = Number(args.port);

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

