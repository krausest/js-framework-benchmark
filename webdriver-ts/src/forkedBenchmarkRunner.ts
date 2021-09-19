import {WebDriver, logging} from 'selenium-webdriver'
import {BenchmarkType, Benchmark, benchmarks, fileName, LighthouseData, fileNameTrace} from './benchmarks'
import {setUseShadowRoot, startBrowser, setUseRowShadowRoot, setShadowRootName, setButtonsInShadowRoot} from './webdriverAccess'

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

import { readFile } from 'fs/promises';
import * as path from 'path';
import {TConfig, config as defaultConfig, JSONResult, FrameworkData, ErrorAndWarning, BenchmarkOptions, BenchmarkDriverOptions, TBenchmarkStatus} from './common'
import * as R from 'ramda';
import { Browser, Page } from 'puppeteer-core';

let config:TConfig = defaultConfig;

// necessary to launch without specifiying a path
var chromedriver:any = require('chromedriver');

interface Timingresult {
    type: string;
    ts: number;
    dur?: number;
    end?: number;
    mem?: number;
    evt?: any;
}

function extractRelevantEvents(entries: any[]) {
    let filteredEvents: Timingresult[] = [];
    let protocolEvents: any[] = [];
    entries.forEach(x => {
        let e = x;
        if (config.LOG_DETAILS) console.log(JSON.stringify(e));
        if (e.name==='EventDispatch') {
            if (e.args.data.type==="click") {
                if (config.LOG_TIMELINE) console.log("CLICK ",JSON.stringify(e));
                filteredEvents.push({type:'click', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur});
            }
        } else if (e.name==='Paint' && e.ph==="X") {
            console.log("PAINT ",+e.ts+e.dur);
            filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        }
/*        } else if (e.name==='Rasterize' && e.ph==="X") {
            console.log("RASTERIZE ",+e.ts+e.dur);
            // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='CompositeLayers' && e.ph==="X") {
            console.log("COMPOSITE ",+e.ts);
            // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts, evt: JSON.stringify(e)});
        } else if (e.name==='Layout' && e.ph==="X") {
            console.log("LAYOUT ",+e.ts);
            // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: e.ts, evt: JSON.stringify(e)});
        } else if (e.name==='UpdateLayerTree' && e.ph==="X") {
            console.log("UPDATELAYER ",+e.ts);
            // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        }
        */
    });
    return {filteredEvents, protocolEvents};
}

async function fetchEventsFromPerformanceLog(fileName: string): Promise<{timingResults: Timingresult[], protocolResults: any[]}> {
    let timingResults : Timingresult[] = [];
    let protocolResults : any[] = [];
    let entries = [];
    do {
        let contents = await readFile(fileName, {encoding: "utf8"});
        let json  = JSON.parse(contents)
        let entries = json['traceEvents'];
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

function extractRawValue(results: any, id: string) {
    let audits = results.audits;
    if (!audits) return null;
    let audit_with_id = audits[id];
    if (typeof audit_with_id === 'undefined') return null;
    if (typeof audit_with_id.numericValue === 'undefined') return null;
    return audit_with_id.numericValue;
}

 /*function rmDir(dirPath: string) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { console.log("error in rmDir "+dirPath, e); return; }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = path.join(dirPath, files[i]);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    fs.rmdirSync(dirPath);
  };
*/
  async function runLighthouse(framework: FrameworkData, benchmarkOptions: BenchmarkOptions): Promise<LighthouseData> {
    const opts: any = {
        chromeFlags:
        [
            "--headless",
            "--no-sandbox",
            "--no-first-run",
            "--enable-automation",
            "--disable-infobars",
            "--disable-background-networking",
            "--disable-background-timer-throttling",
            "--disable-cache",
            "--disable-translate",
            "--disable-sync",
            "--disable-extensions",
            "--disable-default-apps",
            "--window-size=1200,800",
            "--remote-debugging-port=" + (benchmarkOptions.remoteDebuggingPort).toFixed()
        ],
        onlyCategories: ['performance'],
        port: (benchmarkOptions.remoteDebuggingPort).toFixed(),
        logLevel: "info"
    };

    try {
        if (benchmarkOptions.chromeBinaryPath) opts.chromePath = benchmarkOptions.chromeBinaryPath;
        let chrome = await chromeLauncher.launch(opts);
        let results = null;
        try {
            results = await lighthouse(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`, opts, null);
            await chrome.kill();
        } catch (error) {
            console.log("error running lighthouse", error);
            await chrome.kill();
            throw error;
        }
        //console.log("lh result", results);

        let LighthouseData: LighthouseData = {
            TimeToConsistentlyInteractive: extractRawValue(results.lhr, 'interactive'),
            ScriptBootUpTtime: extractRawValue(results.lhr, 'bootup-time'),
            MainThreadWorkCost: extractRawValue(results.lhr, 'mainthread-work-breakdown'),
            TotalKiloByteWeight: extractRawValue(results.lhr, 'total-byte-weight')/1024.0
        };
        return LighthouseData;
    } catch (error) {
        console.log("error running lighthouse", error);
        throw error;
    }
}

async function computeResultsCPU(fileName: string, benchmarkOptions: BenchmarkOptions, framework: FrameworkData, benchmark: Benchmark, warnings: String[], expcectedResultCount: number): Promise<number> {
    const perfLogEvents = (await fetchEventsFromPerformanceLog(fileName));
    let eventsDuringBenchmark = perfLogEvents.timingResults;

    console.log("eventsDuringBenchmark ", asString(eventsDuringBenchmark));

    let clicks = R.filter(type_eq('click'))(eventsDuringBenchmark)
    if (clicks.length !== 1) {
        console.log("exactly one click event is expected", eventsDuringBenchmark);
        throw "exactly one click event is expected";
    }

    let paints = R.filter(type_eq('paint'))(eventsDuringBenchmark);
    if (paints.length == 0) {
        console.log("at least one paint event is expected after the click event", paints);
        throw "at least one paint event is expected after the click event";
    }
    let lastPaint = R.reduce((max, elem) => max.end > elem.end ? max : elem, {end: 0} as Timingresult, paints);
    let duration = (lastPaint.end - clicks[0].ts)/1000.0;
    return duration;
}

async function computeResultsMEM(driver: WebDriver, benchmarkOptions: BenchmarkOptions, framework: FrameworkData, benchmark: Benchmark, warnings: String[]): Promise<number> {
   /* let entriesBrowser = await driver.manage().logs().get(logging.Type.BROWSER);
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
            results.push(mem);
        }
        remaining = R.drop(1, evts[1]);
    }
    // if (results.length !== benchmarkOptions.numIterationsForMemBenchmarks) {
    if (results.length !== 1) { //benchmarkOptions.numIterationsForAllBenchmarks) {
        console.log(`soundness check failed. number or results isn't 1*`, results, asString(filteredEvents));
        throw `soundness check failed. number or results isn't 1`;
    }
    return results[0];
    */
   return 0;
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
    // currently needed due to https://github.com/krausest/js-framework-benchmark/issues/538
    let heapSnapshot: any = await driver.executeScript(":takeHeapSnapshot");
    if (typeof(heapSnapshot) === 'string') {
        console.log("INFO: heapSnapshot was a JSON string");
        heapSnapshot = JSON.parse(heapSnapshot);
    }
    console.log("****** heapSnapshot.snapshot.meta", typeof(heapSnapshot));
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

async function runBenchmark(page: Page, benchmark: Benchmark, framework: FrameworkData) : Promise<any> {
    await benchmark.run(page, framework);
    if (config.LOG_PROGRESS) console.log("after run ",benchmark.id, benchmark.type, framework.name);
    if (benchmark.type === BenchmarkType.MEM) {
        // FIXME
        // await forceGC(framework, page);
    }
}

async function afterBenchmark(page: Page, benchmark: Benchmark, framework: FrameworkData) : Promise<any> {
    if (benchmark.after) {
        await benchmark.after(page, framework);
        if (config.LOG_PROGRESS) console.log("after benchmark ",benchmark.id, benchmark.type, framework.name);
    }
}

async function initBenchmark(page: Page, benchmark: Benchmark, framework: FrameworkData): Promise<any> {
    await benchmark.init(page, framework)
    if (config.LOG_PROGRESS) console.log("after initialized ",benchmark.id, benchmark.type, framework.name);
    if (benchmark.type === BenchmarkType.MEM) {
        // FIXME
       // await forceGC(framework, page);
    }
}

// async function registerError(driver: WebDriver, framework: FrameworkData, benchmark: Benchmark, error: string): Promise<BenchmarkError> {
//     // let fileName = 'error-' + framework.name + '-' + benchmark.id + '.png';
//     console.error("Benchmark failed",error);
//     // let image = await driver.takeScreenshot();
//     // console.error(`Writing screenshot ${fileName}`);
//     // fs.writeFileSync(fileName, image, {encoding: 'base64'});
//     return {imageFile: /*fileName*/ "no img", exception: JSON.stringify(error)};
// }

const wait = (delay = 1000) => new Promise(res => setTimeout(res, delay));

function convertError(error:any): string {
    console.log("ERROR in run Benchmark: |", error, "| type:", typeof error, " instance of Error", error instanceof Error, " Message: ", error.message);
    if (typeof error === 'string') {
        console.log("Error is string");
        return error;
    }
    else if (error instanceof Error) {
        console.log("Error is instanceof Error");
        return error.message;
    } else {
        console.log("Error is unknown type");
        return error.toString();
    }
}

async function runCPUBenchmark(framework: FrameworkData, benchmark: Benchmark, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning>
{
    let error: String = undefined;
    let warnings: String[] = [];
    let results: number[] = [];

    console.log("benchmarking ", framework, benchmark.id);
    let browser : Browser = null;
    try {
        browser = await startBrowser(benchmarkOptions);
        const page = await browser.newPage();
        for (let i = 0; i <benchmarkOptions.batchSize; i++) {
            setUseShadowRoot(framework.useShadowRoot);
            setUseRowShadowRoot(framework.useRowShadowRoot);
            setShadowRootName(framework.shadowRootName);
            setButtonsInShadowRoot(framework.buttonsInShadowRoot);
            await page.goto(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`);

            // await (driver as any).sendDevToolsCommand('Network.enable');
            // await (driver as any).sendDevToolsCommand('Network.emulateNetworkConditions', {
                //     offline: false,
                //     latency: 200, // ms
                //     downloadThroughput: 780 * 1024 / 8, // 780 kb/s
                //     uploadThroughput: 330 * 1024 / 8, // 330 kb/s
                // });
            console.log("driver timerstamp *")
            await page.evaluate("console.timeStamp('initBenchmark')");

            await initBenchmark(page, benchmark, framework);
            await page.tracing.start({path: fileNameTrace(framework, benchmark, i), screenshots: true});
/*            if (benchmark.throttleCPU) {
                console.log("CPU slowdown", benchmark.throttleCPU);
                await (driver as any).sendDevToolsCommand('Emulation.setCPUThrottlingRate', {rate: benchmark.throttleCPU});
            }*/
            await page.evaluate("console.timeStamp('runBenchmark')");
            await runBenchmark(page, benchmark, framework);
            /*if (benchmark.throttleCPU) {
                console.log("resetting CPU slowdown");
                await (driver as any).sendDevToolsCommand('Emulation.setCPUThrottlingRate', {rate: 1});
            }*/
            await page.tracing.stop();
            await page.evaluate("console.timeStamp('finishedBenchmark')");
            await afterBenchmark(page, benchmark, framework);
            await page.evaluate("console.timeStamp('afterBenchmark')");
            let result = await computeResultsCPU(fileNameTrace(framework, benchmark, i), benchmarkOptions, framework, benchmark, warnings, benchmarkOptions.batchSize);
            results.push(result);
        }
        await browser.close();
        return {error, warnings, result: results};
    } catch (e) {
        console.log("ERROR ", e);
        error = convertError(e);
        try {
            if (browser) {
                await browser.close();
            }
        } catch (err) {
            console.log("ERROR cleaning up driver", err);
        }
        return {error, warnings};
    }
}

async function runMemBenchmark(framework: FrameworkData, benchmark: Benchmark, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning>
{
    let error: String = undefined;
    let warnings: String[] = [];
    let allResults: number[] = [];
/*
    console.log("benchmarking ", framework, benchmark.id);
    let driver : WebDriver = null;
    try {
        driver = buildDriver(benchmarkOptions);
        setUseShadowRoot(framework.useShadowRoot);
        setUseRowShadowRoot(framework.useRowShadowRoot);
        setShadowRootName(framework.shadowRootName);
        setButtonsInShadowRoot(framework.buttonsInShadowRoot);
        await driver.get(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`);

        await driver.executeScript("console.timeStamp('initBenchmark')");

        await initBenchmark(driver, benchmark, framework);
        if (benchmark.throttleCPU) {
            console.log("CPU slowdown", benchmark.throttleCPU);
            await (driver as any).sendDevToolsCommand('Emulation.setCPUThrottlingRate', {rate: benchmark.throttleCPU});
        }
        await driver.executeScript("console.timeStamp('runBenchmark')");
        await runBenchmark(driver, benchmark, framework);
        if (benchmark.throttleCPU) {
            console.log("resetting CPU slowdown");
            await (driver as any).sendDevToolsCommand('Emulation.setCPUThrottlingRate', {rate: 1});
        }
        let snapshotSize = await snapMemorySize(driver);
        await driver.executeScript("console.timeStamp('finishedBenchmark')");
        await afterBenchmark(driver, benchmark, framework);
        await driver.executeScript("console.timeStamp('afterBenchmark')");
        let result = await computeResultsMEM(driver, benchmarkOptions, framework, benchmark, warnings);
        if (config.LOG_DETAILS) console.log("comparison of memory usage. GC log:", result,  " :takeHeapSnapshot", snapshotSize);
        allResults.push();
        await driver.close();
        await driver.quit();
        return {error, warnings, result: [result]};
    } catch (e) {
        error= convertError(e);
        try {
            if (driver) {
                await driver.close();
                await driver.quit();
            }
        } catch (err) {
            console.log("ERROR cleaning up driver", err);
        }
        return {error, warnings};
    }
    */
    return {error, warnings};
}

async function runStartupBenchmark(framework: FrameworkData, benchmark: Benchmark, benchmarkOptions: BenchmarkOptions ): Promise<ErrorAndWarning>
{
    console.log("benchmarking startup", framework, benchmark.id);

    let error: String = undefined;
/*    try {
        let result = await runLighthouse(framework, benchmarkOptions);
        return {error, warnings: [], result};
    } catch (e) {
        error = convertError(e);
        return {error, warnings: []};
    }
    */
    return {error, warnings: []};
}

export async function executeBenchmark(frameworks: FrameworkData[], keyed: boolean, frameworkName: string, benchmarkName: string, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning> {
    let runFrameworks = frameworks.filter(f => f.keyed === keyed).filter(f => frameworkName === f.name);
    let runBenchmarks = benchmarks.filter(b => benchmarkName === b.id);
    if (runFrameworks.length!=1) throw `Framework name ${frameworkName} is not unique`;
    if (runBenchmarks.length!=1) throw `Benchmark name ${benchmarkName} is not unique`;

    let framework = runFrameworks[0];
    let benchmark = runBenchmarks[0];

    let errorAndWarnings : ErrorAndWarning;
    if (benchmark.type == BenchmarkType.STARTUP) {
        errorAndWarnings = await runStartupBenchmark(framework, benchmark, benchmarkOptions);
    } else if (benchmark.type == BenchmarkType.CPU) {
        errorAndWarnings = await runCPUBenchmark(framework, benchmark, benchmarkOptions);
    } else {
        errorAndWarnings = await runMemBenchmark(framework, benchmark, benchmarkOptions);
    }

    return errorAndWarnings;
}

export async function performBenchmark(frameworks: FrameworkData[], keyed: boolean, frameworkName: string, benchmarkName: string, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning> {
    let errorAndWarnings = await executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
    if (config.LOG_DEBUG) console.log("benchmark finished - got errors promise", errorAndWarnings);
    return errorAndWarnings;
}

process.on('message', (msg:any) => {
    config = msg.config;
    console.log("START BENCHMARK. Write results? ", config.WRITE_RESULTS);
    // if (config.LOG_DEBUG) console.log("child process got message", msg);

    let {frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions} : {frameworks: FrameworkData[], keyed: boolean, frameworkName: string, benchmarkName: string, benchmarkOptions: BenchmarkOptions} = msg;
    if (!benchmarkOptions.port) benchmarkOptions.port = config.PORT.toFixed();
        performBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions).then(result => {
            process.send(result);
            process.exit(0);
        }).catch((err) => {
            console.log("CATCH: Error in forkedBenchmarkRunner");
            process.send({failure: convertError(err)});
            process.exit(0);
    });
});
