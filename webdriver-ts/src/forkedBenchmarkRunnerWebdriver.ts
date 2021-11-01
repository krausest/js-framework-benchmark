import { WebDriver, logging } from "selenium-webdriver";
import { BenchmarkWebdriver, benchmarksWebdriver, LighthouseData } from "./benchmarksWebdriver";
import { setUseShadowRoot, buildDriver, setUseRowShadowRoot, setShadowRootName, setButtonsInShadowRoot } from "./webdriverAccess";

const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

import { TConfig, config as defaultConfig, FrameworkData, ErrorAndWarning, BenchmarkOptions } from "./common";
import * as R from "ramda";
import { BenchmarkType } from "./benchmarksGeneric";

let config: TConfig = defaultConfig;

// necessary to launch without specifiying a path
var chromedriver: any = require("chromedriver");

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
  entries.forEach((x) => {
    let e = JSON.parse(x.message).message;
    if (config.LOG_DETAILS) console.log(JSON.stringify(e));
    if (e.method === "Tracing.dataCollected") {
      protocolEvents.push(e);
    }
    if (e.method && (e.method.startsWith("Page") || e.method.startsWith("Network"))) {
      protocolEvents.push(e);
    } else if (e.params.name === "EventDispatch") {
      if (e.params.args.data.type === "click") {
        if (config.LOG_TIMELINE) console.log("CLICK ", JSON.stringify(e));
        filteredEvents.push({
          type: "click",
          ts: +e.params.ts,
          dur: +e.params.dur,
          end: +e.params.ts + e.params.dur,
        });
      }
    } else if (
      e.params.name === "TimeStamp" &&
      (e.params.args.data.message === "afterBenchmark" ||
        e.params.args.data.message === "finishedBenchmark" ||
        e.params.args.data.message === "runBenchmark" ||
        e.params.args.data.message === "initBenchmark")
    ) {
      filteredEvents.push({
        type: e.params.args.data.message,
        ts: +e.params.ts,
        dur: 0,
        end: +e.params.ts,
      });
      if (config.LOG_TIMELINE) console.log("TIMESTAMP ", JSON.stringify(e));
    } else if (e.params.name === "navigationStart") {
      filteredEvents.push({
        type: "navigationStart",
        ts: +e.params.ts,
        dur: 0,
        end: +e.params.ts,
      });
      if (config.LOG_TIMELINE) console.log("NAVIGATION START ", JSON.stringify(e));
    } else if (e.params.name === "Paint") {
      if (config.LOG_TIMELINE) console.log("PAINT ", JSON.stringify(e));
      filteredEvents.push({
        type: "paint",
        ts: +e.params.ts,
        dur: +e.params.dur,
        end: +e.params.ts + e.params.dur,
        evt: JSON.stringify(e),
      });
      // } else if (e.params.name==='Rasterize') {
      //     console.log("RASTERIZE ",JSON.stringify(e));
      //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur, evt: JSON.stringify(e)});
      // } else if (e.params.name==='CompositeLayers') {
      //     console.log("COMPOSITE ",JSON.stringify(e));
      //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts, evt: JSON.stringify(e)});
      // } else if (e.params.name==='Layout') {
      //     console.log("LAYOUT ",JSON.stringify(e));
      //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: e.params.ts, evt: JSON.stringify(e)});
      // } else if (e.params.name==='UpdateLayerTree') {
      //     console.log("UPDATELAYER ",JSON.stringify(e));
      //     filteredEvents.push({type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur, evt: JSON.stringify(e)});
    } else if (e.params.name === "MajorGC" && e.params.args.usedHeapSizeAfter) {
      filteredEvents.push({
        type: "gc",
        ts: +e.params.ts,
        dur: +e.params.dur,
        end: +e.params.ts,
        mem: Number(e.params.args.usedHeapSizeAfter) / 1024 / 1024,
      });
      if (config.LOG_TIMELINE) console.log("GC ", JSON.stringify(e));
    }
  });
  return { filteredEvents, protocolEvents };
}

async function fetchEventsFromPerformanceLog(driver: WebDriver): Promise<{ timingResults: Timingresult[]; protocolResults: any[] }> {
  let timingResults: Timingresult[] = [];
  let protocolResults: any[] = [];
  let entries = [];
  do {
    entries = await driver.manage().logs().get(logging.Type.PERFORMANCE);
    const { filteredEvents, protocolEvents } = extractRelevantEvents(entries);
    timingResults = timingResults.concat(filteredEvents);
    protocolResults = protocolResults.concat(protocolEvents);
  } while (entries.length > 0);
  return { timingResults, protocolResults };
}

function type_eq(requiredType: string) {
  return (e: Timingresult) => e.type === requiredType;
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
  if (typeof audit_with_id === "undefined") return null;
  if (typeof audit_with_id.numericValue === "undefined") return null;
  return audit_with_id.numericValue;
}

async function runLighthouse(framework: FrameworkData, benchmarkOptions: BenchmarkOptions): Promise<LighthouseData> {
  const opts: any = {
    chromeFlags: [
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
      "--remote-debugging-port=" + benchmarkOptions.remoteDebuggingPort.toFixed(),
    ],
    onlyCategories: ["performance"],
    port: benchmarkOptions.remoteDebuggingPort.toFixed(),
    logLevel: "info",
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
      TimeToConsistentlyInteractive: extractRawValue(results.lhr, "interactive"),
      ScriptBootUpTtime: extractRawValue(results.lhr, "bootup-time"),
      MainThreadWorkCost: extractRawValue(results.lhr, "mainthread-work-breakdown"),
      TotalKiloByteWeight: extractRawValue(results.lhr, "total-byte-weight") / 1024.0,
    };
    return LighthouseData;
  } catch (error) {
    console.log("error running lighthouse", error);
    throw error;
  }
}

async function computeResultsCPU(
  driver: WebDriver,
  benchmarkOptions: BenchmarkOptions,
  framework: FrameworkData,
  benchmark: BenchmarkWebdriver,
  warnings: String[],
  expcectedResultCount: number
): Promise<number[]> {
  let entriesBrowser = await driver.manage().logs().get(logging.Type.BROWSER);
  if (config.LOG_DEBUG) console.log("browser entries", entriesBrowser);
  const perfLogEvents = await fetchEventsFromPerformanceLog(driver);
  let filteredEvents = perfLogEvents.timingResults;

  // if (config.LOG_DEBUG) console.log("filteredEvents ", asString(filteredEvents));

  let remaining = R.dropWhile(type_eq("initBenchmark"))(filteredEvents);
  let results: number[] = [];

  while (remaining.length > 0) {
    let evts = R.splitWhen(type_eq("finishedBenchmark"))(remaining);
    if (R.find(type_neq("runBenchmark"))(evts[0]) && evts[1].length > 0) {
      let eventsDuringBenchmark = R.dropWhile(type_neq("runBenchmark"))(evts[0]);

      if (config.LOG_DEBUG) console.log("eventsDuringBenchmark ", eventsDuringBenchmark);

      let clicks = R.filter(type_eq("click"))(eventsDuringBenchmark);
      if (clicks.length !== 1) {
        console.log("exactly one click event is expected", eventsDuringBenchmark);
        throw "exactly one click event is expected";
      }

      let eventsAfterClick = R.dropWhile(type_neq("click"))(eventsDuringBenchmark);

      if (config.LOG_DEBUG) console.log("eventsAfterClick", eventsAfterClick);

      let paints = R.filter(type_eq("paint"))(eventsAfterClick);
      if (paints.length == 0) {
        console.log("at least one paint event is expected after the click event", eventsAfterClick);
        throw "at least one paint event is expected after the click event";
      }

      console.log("# of paint events ", paints.length);
      paints.forEach((p) => {
        console.log("duration to paint ", (p.end - clicks[0].ts) / 1000.0);
      });
      let lastPaint = R.reduce((max, elem) => (max.end > elem.end ? max : elem), { end: 0 } as Timingresult, paints);

      let upperBoundForSoundnessCheck = (R.last(eventsDuringBenchmark).end - eventsDuringBenchmark[0].ts) / 1000.0;
      let duration = (lastPaint.end - clicks[0].ts) / 1000.0;

      console.log("*** duration", duration, "upper bound ", upperBoundForSoundnessCheck);
      if (duration < 0) {
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
  if (results.length !== expcectedResultCount) {
    console.log(`soundness check failed. number or results isn't ${expcectedResultCount}`, results, asString(filteredEvents));
    throw `soundness check failed. number or results isn't ${expcectedResultCount}`;
  }
  return results;
}

async function runBenchmark(driver: WebDriver, benchmark: BenchmarkWebdriver, framework: FrameworkData): Promise<any> {
  await benchmark.run(driver, framework);
  if (config.LOG_PROGRESS) console.log("after run ", benchmark.id, benchmark.type, framework.name);
}

async function afterBenchmark(driver: WebDriver, benchmark: BenchmarkWebdriver, framework: FrameworkData): Promise<any> {
  if (benchmark.after) {
    await benchmark.after(driver, framework);
    if (config.LOG_PROGRESS) console.log("after benchmark ", benchmark.id, benchmark.type, framework.name);
  }
}

async function initBenchmark(driver: WebDriver, benchmark: BenchmarkWebdriver, framework: FrameworkData): Promise<any> {
  await benchmark.init(driver, framework);
  if (config.LOG_PROGRESS) console.log("after initialized ", benchmark.id, benchmark.type, framework.name);
}

// async function registerError(driver: WebDriver, framework: FrameworkData, benchmark: Benchmark, error: string): Promise<BenchmarkError> {
//     // let fileName = 'error-' + framework.name + '-' + benchmark.id + '.png';
//     console.error("Benchmark failed",error);
//     // let image = await driver.takeScreenshot();
//     // console.error(`Writing screenshot ${fileName}`);
//     // fs.writeFileSync(fileName, image, {encoding: 'base64'});
//     return {imageFile: /*fileName*/ "no img", exception: JSON.stringify(error)};
// }

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

async function runCPUBenchmark(
  framework: FrameworkData,
  benchmark: BenchmarkWebdriver,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let error: String = undefined;
  let warnings: String[] = [];

  console.log("benchmarking ", framework, benchmark.id);
  let driver: WebDriver = null;
  try {
    driver = buildDriver(benchmarkOptions);
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      setUseShadowRoot(framework.useShadowRoot);
      setUseRowShadowRoot(framework.useRowShadowRoot);
      setShadowRootName(framework.shadowRootName);
      setButtonsInShadowRoot(framework.buttonsInShadowRoot);
      await driver.get(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`);

      // await (driver as any).sendDevToolsCommand('Network.enable');
      // await (driver as any).sendDevToolsCommand('Network.emulateNetworkConditions', {
      //     offline: false,
      //     latency: 200, // ms
      //     downloadThroughput: 780 * 1024 / 8, // 780 kb/s
      //     uploadThroughput: 330 * 1024 / 8, // 330 kb/s
      // });
      console.log("driver timerstamp *");
      await driver.executeScript("console.timeStamp('initBenchmark')");

      await initBenchmark(driver, benchmark, framework);
      if (benchmark.throttleCPU) {
        console.log("CPU slowdown", benchmark.throttleCPU);
        await (driver as any).sendDevToolsCommand("Emulation.setCPUThrottlingRate", { rate: benchmark.throttleCPU });
      }
      await driver.executeScript("console.timeStamp('runBenchmark')");
      await runBenchmark(driver, benchmark, framework);
      if (benchmark.throttleCPU) {
        console.log("resetting CPU slowdown");
        await (driver as any).sendDevToolsCommand("Emulation.setCPUThrottlingRate", { rate: 1 });
      }
      await driver.executeScript("console.timeStamp('finishedBenchmark')");
      await afterBenchmark(driver, benchmark, framework);
      await driver.executeScript("console.timeStamp('afterBenchmark')");
    }
    let result = await computeResultsCPU(driver, benchmarkOptions, framework, benchmark, warnings, benchmarkOptions.batchSize);
    await driver.close();
    await driver.quit();
    return { error, warnings, result };
  } catch (e) {
    console.log("ERROR ", e);
    error = convertError(e);
    try {
      if (driver) {
        await driver.close();
        await driver.quit();
      }
    } catch (err) {
      console.log("ERROR cleaning up driver", err);
    }
    return { error, warnings };
  }
}

async function runStartupBenchmark(
  framework: FrameworkData,
  benchmark: BenchmarkWebdriver,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  console.log("benchmarking startup", framework, benchmark.id);

  let error: String = undefined;
  try {
    let result = await runLighthouse(framework, benchmarkOptions);
    return { error, warnings: [], result };
  } catch (e) {
    error = convertError(e);
    return { error, warnings: [] };
  }
}

export async function executeBenchmark(
  framework: FrameworkData,
  benchmarkId: string,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let runBenchmarks = benchmarksWebdriver.filter((b) => benchmarkId === b.id);
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning;
  if (benchmark.type == BenchmarkType.STARTUP) {
    errorAndWarnings = await runStartupBenchmark(framework, benchmark, benchmarkOptions);
  } else if (benchmark.type == BenchmarkType.CPU) {
    errorAndWarnings = await runCPUBenchmark(framework, benchmark, benchmarkOptions);
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
