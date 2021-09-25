import {BenchmarkType, Benchmark, benchmarks, fileName, LighthouseData, fileNameTrace} from './benchmarks'
import {setUseShadowRoot, startBrowser, setUseRowShadowRoot, setShadowRootName, setButtonsInShadowRoot} from './webdriverAccess'

const lighthouse = require('lighthouse');

import { readFile } from 'fs/promises';
import * as path from 'path';
import {TConfig, config as defaultConfig, JSONResult, FrameworkData, ErrorAndWarning, BenchmarkOptions, BenchmarkDriverOptions, TBenchmarkStatus} from './common'
import * as R from 'ramda';
import { Browser, Page } from 'puppeteer-core';

let config:TConfig = defaultConfig;

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
        // console.log(JSON.stringify(e));
        if (e.name==='EventDispatch') {
            if (e.args.data.type==="click") {
                // console.log("CLICK ",+e.ts);
                filteredEvents.push({type:'click', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur});
            }
        } else if (e.name==='Paint' && e.ph==="X") {
            // console.log("PAINT X",+e.ts+e.dur);
            filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='Paint') {
            // console.log("PAINT I ",+e.ts);
            filteredEvents.push({type:'paint', ts: +e.ts, dur: 0, end: +e.ts, evt: JSON.stringify(e)});
        // } else if (e.name==='Rasterize' && e.ph==="X") {
        //     console.log("RASTERIZE ",+e.ts+e.dur);
        //     // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        // } else if (e.name==='CompositeLayers' && e.ph==="X") {
        //     console.log("COMPOSITE ",+e.ts);
        //     // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts, evt: JSON.stringify(e)});
        // } else if (e.name==='Layout' && e.ph==="X") {
        //     console.log("LAYOUT ",+e.ts);
        //     // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: e.ts, evt: JSON.stringify(e)});
        // } else if (e.name==='UpdateLayerTree' && e.ph==="X") {
        //     console.log("UPDATELAYER ",+e.ts);
        //     // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        // } else if (e.name==='UpdateLayoutTree' && e.ph==="X") {
        //     console.log("UPDATELAYOUT ",+e.ts);
        //     // filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        }
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

function extractRawValue(results: any, id: string) {
    let audits = results.audits;
    if (!audits) return null;
    let audit_with_id = audits[id];
    if (typeof audit_with_id === 'undefined') return null;
    if (typeof audit_with_id.numericValue === 'undefined') return null;
    return audit_with_id.numericValue;
}

  async function runLighthouse(framework: FrameworkData, benchmarkOptions: BenchmarkOptions): Promise<LighthouseData> {
    let browser = await startBrowser(benchmarkOptions);

    try {
        const {lhr} = await lighthouse(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`, {
            port: (new URL(browser.wsEndpoint())).port,
            output: 'json',
            logLevel: 'info',
          });
          let lighthouseData: LighthouseData = {
            TimeToConsistentlyInteractive: extractRawValue(lhr, 'interactive'),
            ScriptBootUpTtime: extractRawValue(lhr, 'bootup-time'),
            MainThreadWorkCost: extractRawValue(lhr, 'mainthread-work-breakdown'),
            SpeedIndex: extractRawValue(lhr, 'speed-index'),
            FirstMeaningfulPaint: extractRawValue(lhr, 'first-meaningful-paint'),
            TotalKiloByteWeight: extractRawValue(lhr, 'total-byte-weight')/1024.0
        };
        return lighthouseData;
    
    } catch (error) {
        console.log("error running lighthouse", error);
        await browser.close();
        throw error;
    }
}

async function computeResultsCPU(fileName: string, benchmarkOptions: BenchmarkOptions, framework: FrameworkData, benchmark: Benchmark, warnings: String[], expcectedResultCount: number): Promise<number> {
    const perfLogEvents = (await fetchEventsFromPerformanceLog(fileName));
    let eventsDuringBenchmark = perfLogEvents.timingResults;

    // console.log("eventsDuringBenchmark ", asString(eventsDuringBenchmark));

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
        for (let i = 0; i <benchmarkOptions.batchSize; i++) {
            const page = await browser.newPage();
            if (benchmark.throttleCPU) {
                console.log("CPU slowdown", benchmark.throttleCPU);
                await page.emulateCPUThrottling(benchmark.throttleCPU);
            }
            page.on('console', (msg) => {
                for (let i = 0; i < msg.args().length; ++i)
                  console.log(`BROWSER: ${msg.args()[i]}`);
              });

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
            console.log("initBenchmark");
            await initBenchmark(page, benchmark, framework);

   
            await page.tracing.start({path: fileNameTrace(framework, benchmark, i), 
                screenshots: false,
                // categories:[ "devtools.timeline","blink.user_timing"]
                },
                );
            console.log("runBenchmark");
            await runBenchmark(page, benchmark, framework);
            await wait(40);
            await page.tracing.stop();
            await afterBenchmark(page, benchmark, framework);
            if (benchmark.throttleCPU) {
                console.log("resetting CPU slowdown");
                await page.emulateCPUThrottling(null);
            }
            console.log("afterBenchmark");
            let result = await computeResultsCPU(fileNameTrace(framework, benchmark, i), benchmarkOptions, framework, benchmark, warnings, benchmarkOptions.batchSize);
            results.push(result);
            console.log(`duration for ${framework.name} and ${benchmark.id}: ${result}`);
            if (result < 0)
                throw new Error(`duration ${result} < 0`);
            await page.close();
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

async function forceGC(page: Page) {
    const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
    const objectsHandle = await page.queryObjects(prototypeHandle);
    const numberOfObjects = await page.evaluate(
      (instances) => instances.length,
      objectsHandle
    );
  
    await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);
  
    return numberOfObjects;
  };

async function runMemBenchmark(framework: FrameworkData, benchmark: Benchmark, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning>
{
    let error: String = undefined;
    let warnings: String[] = [];
    let results: number[] = [];

    console.log("benchmarking ", framework, benchmark.id);
    let browser : Browser = null;
    try {
        browser = await startBrowser(benchmarkOptions);
        for (let i = 0; i <benchmarkOptions.batchSize; i++) {
            const page = await browser.newPage();
            page.on('console', (msg) => {
                for (let i = 0; i < msg.args().length; ++i)
                  console.log(`BROWSER: ${msg.args()[i]}`);
              });

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
            console.log("initBenchmark");
            await initBenchmark(page, benchmark, framework);

   
            await page.tracing.start({path: fileNameTrace(framework, benchmark, i), screenshots: true});
            console.log("runBenchmark");
            await runBenchmark(page, benchmark, framework);
            await wait(40);
            await forceGC(page);
            let metrics = await page.metrics();
            await page.tracing.stop();

            await afterBenchmark(page, benchmark, framework);
            console.log("afterBenchmark");
            let result = metrics.JSHeapUsedSize;
            results.push(result);
            console.log(`memory result for ${framework.name} and ${benchmark.id}: ${result}`);
            if (result < 0)
                throw new Error(`memory result ${result} < 0`);
            await page.close();
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

async function runStartupBenchmark(framework: FrameworkData, benchmark: Benchmark, benchmarkOptions: BenchmarkOptions ): Promise<ErrorAndWarning>
{
    console.log("benchmarking startup", framework, benchmark.id);

    let error: String = undefined;
    try {
        let result = await runLighthouse(framework, benchmarkOptions);
        return {error, warnings: [], result};
    } catch (e) {
        error = convertError(e);
        return {error, warnings: []};
    }
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
