import { startBrowser } from "./puppeteerAccess";

const lighthouse = require("lighthouse");

import { TConfig, config as defaultConfig, FrameworkData, ErrorAndWarning, BenchmarkOptions } from "./common";
import { Browser, Page } from "puppeteer-core";
import { BenchmarkType, DurationMeasurementMode } from "./benchmarksCommon";
import { BenchmarkPuppeteer, fileNameTrace } from "./benchmarksPuppeteer";
import {benchmarks} from "./benchmarkConfiguration";
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as R from 'ramda';

let config: TConfig = defaultConfig;

interface Timingresult {
  type: string;
  ts: number;
  dur?: number;
  end?: number;
  mem?: number;
  evt?: any;
}

export function extractRelevantEvents(entries: any[]) {
  let filteredEvents: Timingresult[] = [];
  let click = 0;

  entries.forEach(x => {
      let e = x;
      if (config.LOG_DEBUG) console.log(JSON.stringify(e));
      if (e.name==='EventDispatch') {
          if (e.args.data.type==="click") {
            if (config.LOG_DETAILS) console.log("CLICK ",+e.ts);
              click = e.ts;
              filteredEvents.push({type:'click', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur});
          }
      } else if (e.name==='CompositeLayers' && e.ph==="X") {
        if (config.LOG_DETAILS) console.log("CompositeLayers",+e.ts+e.dur, +e.ts+e.dur-click);
          filteredEvents.push({type:'compositelayers', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
      } else if (e.name==='Layout' && e.ph==="X") {
        if (config.LOG_DETAILS) console.log("Layout",+e.ts+e.dur, +e.ts+e.dur-click);
          filteredEvents.push({type:'layout', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
      } else if (e.name==='Paint' && e.ph==="X") {
        if (config.LOG_DETAILS) console.log("PAINT",+e.ts+e.dur, +e.ts+e.dur-click);
          filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
      }
  });
  return filteredEvents;
}

async function fetchEventsFromPerformanceLog(fileName: string): Promise<Timingresult[]> {
  let timingResults : Timingresult[] = [];
  let entries = [];
  do {
      let contents = await readFile(fileName, {encoding: "utf8"});
      let json  = JSON.parse(contents)
      let entries = json['traceEvents'];
      const filteredEvents = extractRelevantEvents(entries);
      timingResults = timingResults.concat(filteredEvents);
  } while (entries.length > 0);
  return timingResults;
}

function type_eq(requiredType: string) {
  return (e: Timingresult) => e.type=== requiredType;
}

export async function computeResultsCPU(fileName: string, durationMeasurementMode: DurationMeasurementMode): Promise<number> {
  const perfLogEvents = (await fetchEventsFromPerformanceLog(fileName));
  let eventsDuringBenchmark = R.sortBy((e: Timingresult) => e.end)(perfLogEvents);

  // console.log("eventsDuringBenchmark ", asString(eventsDuringBenchmark));

  let clicks = R.filter(type_eq('click'))(eventsDuringBenchmark)
  if (clicks.length !== 1) {
      console.log("exactly one click event is expected", eventsDuringBenchmark);
      throw "exactly one click event is expected";
  }

  let lastLayoutEvent: Timingresult;
  let layouts = R.filter(type_eq('layout'))(eventsDuringBenchmark)
  layouts = R.filter((e: Timingresult) => e.ts > clicks[0].end)(layouts);
  if (durationMeasurementMode==DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT) {
    if (layouts.length > 1) {
      console.log("INFO: more than one layout event found");
      layouts.forEach(l => {
        console.log("layout event",l.end-clicks[0].ts);
      })
    } else if (layouts.length == 0) {
      console.log("ERROR: exactly one layout event is expected", eventsDuringBenchmark);
      throw "exactly one layouts event is expected";
    }
    lastLayoutEvent = layouts[layouts.length-1];
  } else {
    lastLayoutEvent = clicks[0];
  }

  let paints = R.filter(type_eq('paint'))(eventsDuringBenchmark);
  paints = R.filter((e: Timingresult) => e.ts > lastLayoutEvent.end)(paints);
  if (paints.length == 0) {
    console.log("ERROR: No paint event found");
    throw "No paint event found";
  } 
  if (paints.length > 1) {
    console.log("more than one paint event found");
    paints.forEach(l => {
      console.log("paints event",(l.end-clicks[0].ts)/1000.0);
    })
  }
  let duration = (paints[durationMeasurementMode==DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT ? 0 : paints.length-1].end - clicks[0].ts)/1000.0;
  console.log("duration", duration);
  return duration;
}

async function runBenchmark(page: Page, benchmark: BenchmarkPuppeteer, framework: FrameworkData): Promise<any> {
  await benchmark.run(page, framework);
  if (config.LOG_PROGRESS) console.log("after run ", benchmark.id, benchmark.type, framework.name);
  if (benchmark.type === BenchmarkType.MEM) {
    await forceGC(page);
  }
}

async function afterBenchmark(page: Page, benchmark: BenchmarkPuppeteer, framework: FrameworkData): Promise<any> {
  if (benchmark.after) {
    await benchmark.after(page, framework);
    if (config.LOG_PROGRESS) console.log("after benchmark ", benchmark.id, benchmark.type, framework.name);
  }
}

async function initBenchmark(page: Page, benchmark: BenchmarkPuppeteer, framework: FrameworkData): Promise<any> {
  await benchmark.init(page, framework);
  if (config.LOG_PROGRESS) console.log("after initialized ", benchmark.id, benchmark.type, framework.name);
  if (benchmark.type === BenchmarkType.MEM) {
    await forceGC(page);
  }
}

const wait = (delay = 1000) => new Promise((res) => setTimeout(res, delay));

function convertError(error: any): string {
  console.log(
    "ERROR in run Benchmark: |",
    error,
    "| type:",
    typeof error,
    " instance of Error",
    error instanceof Error,
    " Message: ",
    error.message
  );
  if (typeof error === "string") {
    console.log("Error is string");
    return error;
  } else if (error instanceof Error) {
    console.log("Error is instanceof Error");
    return error.message;
  } else {
    console.log("Error is unknown type");
    return error.toString();
  }
}

async function forceGC(page: Page) {
  const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
  const objectsHandle = await page.queryObjects(prototypeHandle);
  const numberOfObjects = await page.evaluate((instances) => instances.length, objectsHandle);

  await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);

  return numberOfObjects;
}

async function runCPUBenchmark(framework: FrameworkData, benchmark: BenchmarkPuppeteer, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning>
{
    let error: String = undefined;
    let warnings: String[] = [];
    let results: number[] = [];

    console.log("benchmarking ", framework, benchmark.id);
    let browser : Browser = null;
    let page : Page = null;
    try {
        browser = await startBrowser(benchmarkOptions);
        page = await browser.newPage();
        // if (config.LOG_DETAILS) {
            page.on('console', (msg) => {
                for (let i = 0; i < msg.args().length; ++i)
                console.log(`BROWSER: ${msg.args()[i]}`);
            });
        // }
        for (let i = 0; i <benchmarkOptions.batchSize; i++) {
            await page.goto(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`, {waitUntil: "domcontentloaded"});

            // await (driver as any).sendDevToolsCommand('Network.enable');
            // await (driver as any).sendDevToolsCommand('Network.emulateNetworkConditions', {
                //     offline: false,
                //     latency: 200, // ms
                //     downloadThroughput: 780 * 1024 / 8, // 780 kb/s
                //     uploadThroughput: 330 * 1024 / 8, // 330 kb/s
                // });
            console.log("initBenchmark");
            try {
              await initBenchmark(page, benchmark, framework);
            } catch (ex) {
              console.log("**** initBenchmark failed, retrying");
              await initBenchmark(page, benchmark, framework);
            }

            let categories = [
                "devtools.timeline",
                "blink.user_timing",
                'disabled-by-default-devtools.timeline',
            ];
            // let categories = [
            //     '-*',
            //     'devtools.timeline',
            //     'v8.execute',
            //     'disabled-by-default-devtools.timeline',
            //     'disabled-by-default-devtools.timeline.frame',
            //     'toplevel',
            //     'blink.console',
            //     'blink.user_timing',
            //     'latencyInfo',
            //     'disabled-by-default-devtools.timeline.stack',
            //     'disabled-by-default-v8.cpu_profiler',                
            // ];

            if (benchmark.throttleCPU) {
              console.log("CPU slowdown", benchmark.throttleCPU);
              await page.emulateCPUThrottling(benchmark.throttleCPU);
          }
  
            await page.tracing.start({path: fileNameTrace(framework, benchmark, i), 
                screenshots: false,
                categories:categories
            });
            console.log("runBenchmark");
            // let m1 = await page.metrics();
            await runBenchmark(page, benchmark, framework);
            await wait(10);
            await page.tracing.stop();
            // let m2 = await page.metrics();
            await afterBenchmark(page, benchmark, framework);
            if (benchmark.throttleCPU) {
              await page.emulateCPUThrottling(1);
          }
  
            // console.log("afterBenchmark", m1, m2);
            // let result = (m2.TaskDuration - m1.TaskDuration)*1000.0; //await computeResultsCPU(fileNameTrace(framework, benchmark, i), benchmarkOptions, framework, benchmark, warnings, benchmarkOptions.batchSize);
            let result = await computeResultsCPU(fileNameTrace(framework, benchmark, i), benchmark.durationMeasurementMode);
            results.push(result);
            console.log(`duration for ${framework.name} and ${benchmark.id}: ${result}`);
            if (result < 0)
                throw new Error(`duration ${result} < 0`);                
        }
        return {error, warnings, result: results};
    } catch (e) {
        console.log("ERROR ", e);
        error = convertError(e);
        return {error, warnings};
    } finally {
        try {
            if (page) {
                await page.close();
            }
        } catch (err) {
            console.log("ERROR closing page", err);
        }
        try {
            if (browser) {
                await browser.disconnect();
            }
        } catch (err) {
            console.log("ERROR disconnecting browser", err);
        }
        try {
            if (browser) {
                await browser.close();
            }
        } catch (err) {
            console.log("ERROR cleaning up driver", err);
        }

    }
}

async function runMemBenchmark(
  framework: FrameworkData,
  benchmark: BenchmarkPuppeteer,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let error: String = undefined;
  let warnings: String[] = [];
  let results: number[] = [];

  console.log("benchmarking ", framework, benchmark.id);
  let browser: Browser = null;
  try {
    browser = await startBrowser(benchmarkOptions);
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      const page = await browser.newPage();
      if (config.LOG_DETAILS) {
        page.on("console", (msg) => {
          for (let i = 0; i < msg.args().length; ++i) console.log(`BROWSER: ${msg.args()[i]}`);
        });
      }

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

      console.log("runBenchmark");
      await runBenchmark(page, benchmark, framework);
      await wait(40);
      await forceGC(page);
      let metrics = await page.metrics();

      await afterBenchmark(page, benchmark, framework);
      console.log("afterBenchmark");
      let result = metrics.JSHeapUsedSize / 1024.0 / 1024.0;
      results.push(result);
      console.log(`memory result for ${framework.name} and ${benchmark.id}: ${result}`);
      if (result < 0) throw new Error(`memory result ${result} < 0`);
      await page.close();
    }
    await browser.close();
    return { error, warnings, result: results };
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
    return { error, warnings };
  }
}

export async function executeBenchmark(
  framework: FrameworkData,
  benchmarkId: string,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let runBenchmarks: Array<BenchmarkPuppeteer> = benchmarks.filter(b => benchmarkId === b.id && b instanceof BenchmarkPuppeteer) as Array<BenchmarkPuppeteer>;
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique (puppeteer)`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning;
  if (benchmark.type == BenchmarkType.CPU) {
    errorAndWarnings = await runCPUBenchmark(framework, benchmark, benchmarkOptions);
  } else {
    errorAndWarnings = await runMemBenchmark(framework, benchmark, benchmarkOptions);
  }
  if (config.LOG_DEBUG) console.log("benchmark finished - got errors promise", errorAndWarnings);
  return errorAndWarnings;
}

process.on("message", (msg: any) => {
  config = msg.config;
  console.log("START BENCHMARK. Write results? ", config.WRITE_RESULTS);
  // if (config.LOG_DEBUG) console.log("child process got message", msg);

  let {
    framework,
    benchmarkId,
    benchmarkOptions,
  }: {
    framework: FrameworkData;
    benchmarkId: string;
    benchmarkOptions: BenchmarkOptions;
  } = msg;
  if (!benchmarkOptions.port) benchmarkOptions.port = config.PORT.toFixed();
  executeBenchmark(framework, benchmarkId, benchmarkOptions)
    .then((result) => {
      process.send(result);
      process.exit(0);
    })
    .catch((err) => {
      console.log("CATCH: Error in forkedBenchmarkRunner");
      process.send({ failure: convertError(err) });
      process.exit(0);
    });
});
