import { WebDriver, logging } from "selenium-webdriver";
import { CPUBenchmarkWebdriver, benchmarks } from "./benchmarksWebdriver.js";
import {
  setUseShadowRoot,
  buildDriver,
  setUseRowShadowRoot,
  setShadowRootName,
  setButtonsInShadowRoot,
} from "./webdriverAccess.js";

import {
  Config,
  config as defaultConfig,
  FrameworkData,
  ErrorAndWarning,
  BenchmarkOptions,
} from "./common.js";
import * as R from "ramda";
import {
  BenchmarkType,
  CPUBenchmarkResult,
  slowDownFactor,
} from "./benchmarksCommon.js";

let config: Config = defaultConfig;
const { LOG_DETAILS, LOG_TIMELINE, LOG_DEBUG, LOG_PROGRESS } = config;

// necessary to launch without specifiying a path
import "chromedriver";

interface Timingresult {
  type: string;
  ts: number;
  dur?: number;
  end?: number;
  mem?: number;
  evt?: any;
}

function extractRelevantEvents(entries: logging.Entry[]) {
  const filteredEvents: Timingresult[] = [];
  const protocolEvents: any[] = [];
  entries.forEach((x) => {
    const e = JSON.parse(x.message).message;
    if (LOG_DETAILS) console.log(JSON.stringify(e));
    if (e.method === "Tracing.dataCollected") {
      protocolEvents.push(e);
    }
    if (
      e.method &&
      (e.method.startsWith("Page") || e.method.startsWith("Network"))
    ) {
      protocolEvents.push(e);
    } else if (e.params.name === "EventDispatch") {
      if (e.params.args.data.type === "click") {
        if (LOG_TIMELINE) console.log("CLICK ", JSON.stringify(e));
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
      if (LOG_TIMELINE) console.log("TIMESTAMP ", JSON.stringify(e));
    } else if (e.params.name === "navigationStart") {
      filteredEvents.push({
        type: "navigationStart",
        ts: +e.params.ts,
        dur: 0,
        end: +e.params.ts,
      });
      if (LOG_TIMELINE) console.log("NAVIGATION START ", JSON.stringify(e));
    } else if (e.params.name === "CompositeLayers" && e.params.ph == "X") {
      if (LOG_TIMELINE) console.log("COMPOSITELAYERS ", JSON.stringify(e));
      filteredEvents.push({
        type: "compositelayers",
        ts: +e.params.ts,
        dur: +e.params.dur,
        end: +e.params.ts + e.params.dur,
        evt: JSON.stringify(e),
      });
    } else if (e.params.name === "Layout" && e.params.ph == "X") {
      if (LOG_TIMELINE) console.log("LAYOUT ", JSON.stringify(e));
      filteredEvents.push({
        type: "layout",
        ts: +e.params.ts,
        dur: +e.params.dur,
        end: +e.params.ts + e.params.dur,
        evt: JSON.stringify(e),
      });
    } else if (e.params.name === "Paint" && e.params.ph == "X") {
      if (LOG_TIMELINE) console.log("PAINT ", JSON.stringify(e));
      filteredEvents.push({
        type: "paint",
        ts: +e.params.ts,
        dur: +e.params.dur,
        end: +e.params.ts + e.params.dur,
        evt: JSON.stringify(e),
      });
    }
  });
  return { filteredEvents, protocolEvents };
}

async function fetchEventsFromPerformanceLog(
  driver: WebDriver,
): Promise<{ timingResults: Timingresult[]; protocolResults: any[] }> {
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

async function computeResultsCPU(
  driver: WebDriver,
  benchmarkOptions: BenchmarkOptions,
  framework: FrameworkData,
  benchmark: CPUBenchmarkWebdriver,
  warnings: string[],
  expcectedResultCount: number,
): Promise<CPUBenchmarkResult[]> {
  const entriesBrowser = await driver.manage().logs().get(logging.Type.BROWSER);
  if (LOG_DEBUG) console.log("browser entries", entriesBrowser);
  const perfLogEvents = await fetchEventsFromPerformanceLog(driver);
  const filteredEvents = perfLogEvents.timingResults;

  // if (LOG_DEBUG) console.log("filteredEvents ", asString(filteredEvents));

  let remaining = R.dropWhile(type_eq("initBenchmark"))(filteredEvents);
  const results: CPUBenchmarkResult[] = [];

  while (remaining.length > 0) {
    const evts = R.splitWhen(type_eq("finishedBenchmark"))(remaining);
    if (R.find(type_neq("runBenchmark"))(evts[0]) && evts[1].length > 0) {
      const eventsDuringBenchmark = R.dropWhile(type_neq("runBenchmark"))(
        evts[0],
      );

      if (LOG_DEBUG)
        console.log("eventsDuringBenchmark ", eventsDuringBenchmark);

      const clicks = R.filter(type_eq("click"))(eventsDuringBenchmark);
      if (clicks.length !== 1) {
        console.log(
          "exactly one click event is expected",
          eventsDuringBenchmark,
        );
        throw "exactly one click event is expected";
      }

      const eventsAfterClick = R.dropWhile(type_neq("click"))(
        eventsDuringBenchmark,
      );

      if (LOG_DEBUG) console.log("eventsAfterClick", eventsAfterClick);

      let lastLayoutEvent: Timingresult;
      let layouts = R.filter(type_eq("layout"))(eventsAfterClick);
      layouts = R.filter((e: Timingresult) => e.ts > clicks[0].end)(layouts);
      if (layouts.length > 1) {
        console.log("INFO: more than one layout event found");
        layouts.forEach((l) => {
          console.log("layout event", l.end - clicks[0].ts);
        });
      } else if (layouts.length == 0) {
        console.log(
          "WARNING: exactly one layout event is expected",
          eventsAfterClick,
        );
        lastLayoutEvent = clicks[0];
      }

      let paintsP = R.filter(type_eq("paint"))(eventsAfterClick);
      paintsP = R.filter((e: Timingresult) => e.ts > lastLayoutEvent.end)(
        paintsP,
      );
      if (paintsP.length == 0) {
        console.log("ERROR: No paint event found");
        throw "No paint event found";
      }
      if (paintsP.length > 1) {
        console.log("more than one paint event found");
        paintsP.forEach((l) => {
          console.log("paints event", (l.end - clicks[0].ts) / 1000.0);
        });
      }

      const duration =
        (paintsP[paintsP.length - 1].end - clicks[0].ts) / 1000.0;
      const upperBoundForSoundnessCheck =
        (R.last(eventsDuringBenchmark).end - eventsDuringBenchmark[0].ts) /
        1000.0;

      if (duration < 0) {
        console.log(
          "soundness check failed. reported duration is less 0",
          asString(eventsDuringBenchmark),
        );
        throw "soundness check failed. reported duration is less 0";
      }

      if (duration > upperBoundForSoundnessCheck) {
        console.log(
          "soundness check failed. reported duration is bigger than whole benchmark duration",
          asString(eventsDuringBenchmark),
        );
        throw "soundness check failed. reported duration is bigger than whole benchmark duration";
      }
      // script is currently not implemented
      results.push({ total: duration, script: 0 });
    }
    remaining = R.drop(1, evts[1]);
  }
  if (results.length !== expcectedResultCount) {
    console.log(
      `soundness check failed. number or results isn't ${expcectedResultCount}`,
      results,
      asString(filteredEvents),
    );
    throw `soundness check failed. number or results isn't ${expcectedResultCount}`;
  }
  return results;
}

async function runBenchmark(
  driver: WebDriver,
  benchmark: CPUBenchmarkWebdriver,
  framework: FrameworkData,
): Promise<void> {
  await benchmark.run(driver, framework);
  if (LOG_PROGRESS)
    console.log(
      "after run ",
      benchmark.benchmarkInfo.id,
      benchmark.benchmarkInfo.type,
      framework.name,
    );
}

async function initBenchmark(
  driver: WebDriver,
  benchmark: CPUBenchmarkWebdriver,
  framework: FrameworkData,
): Promise<void> {
  await benchmark.init(driver, framework);
  if (LOG_PROGRESS)
    console.log(
      "after initialized ",
      benchmark.benchmarkInfo.id,
      benchmark.benchmarkInfo.type,
      framework.name,
    );
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
    error.message,
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
  benchmark: CPUBenchmarkWebdriver,
  benchmarkOptions: BenchmarkOptions,
): Promise<ErrorAndWarning<number | CPUBenchmarkResult>> {
  let error: string = undefined;
  const warnings: string[] = [];

  console.log("benchmarking ", framework, benchmark.benchmarkInfo.id);
  let driver: WebDriver = null;
  try {
    driver = buildDriver(benchmarkOptions);
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      setUseShadowRoot(framework.useShadowRoot);
      setUseRowShadowRoot(framework.useRowShadowRoot);
      setShadowRootName(framework.shadowRootName);
      setButtonsInShadowRoot(framework.buttonsInShadowRoot);
      await driver.get(
        `http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`,
      );

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
      const throttleCPU = slowDownFactor(
        benchmark.benchmarkInfo.id,
        benchmarkOptions.allowThrottling,
      );
      if (throttleCPU) {
        console.log("CPU slowdown", throttleCPU);
        await (driver as any).sendDevToolsCommand(
          "Emulation.setCPUThrottlingRate",
          { rate: throttleCPU },
        );
      }
      await driver.executeScript("console.timeStamp('runBenchmark')");
      await runBenchmark(driver, benchmark, framework);
      if (throttleCPU) {
        console.log("resetting CPU slowdown");
        await (driver as any).sendDevToolsCommand(
          "Emulation.setCPUThrottlingRate",
          { rate: 1 },
        );
      }
      await driver.executeScript("console.timeStamp('finishedBenchmark')");
    }
    const result = await computeResultsCPU(
      driver,
      benchmarkOptions,
      framework,
      benchmark,
      warnings,
      benchmarkOptions.batchSize,
    );
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

export async function executeBenchmark(
  framework: FrameworkData,
  benchmarkId: string,
  benchmarkOptions: BenchmarkOptions,
): Promise<ErrorAndWarning<number | CPUBenchmarkResult>> {
  const runBenchmarks: Array<CPUBenchmarkWebdriver> = benchmarks.filter(
    (b) =>
      benchmarkId === b.benchmarkInfo.id && b instanceof CPUBenchmarkWebdriver,
  ) as Array<CPUBenchmarkWebdriver>;
  if (runBenchmarks.length != 1)
    throw `Benchmark name ${benchmarkId} is not unique (webdriver)`;

  const benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning<number | CPUBenchmarkResult>;
  if (benchmark.benchmarkInfo.type == BenchmarkType.CPU) {
    errorAndWarnings = await runCPUBenchmark(
      framework,
      benchmark,
      benchmarkOptions,
    );
  }

  if (LOG_DEBUG)
    console.log("benchmark finished - got errors promise", errorAndWarnings);
  return errorAndWarnings;
}

process.on("message", (msg: any) => {
  config = msg.config;
  console.log("START BENCHMARK. Write results? ", config.WRITE_RESULTS);
  // if (LOG_DEBUG) console.log("child process got message", msg);

  const {
    framework,
    benchmarkId,
    benchmarkOptions,
  }: {
    framework: FrameworkData;
    benchmarkId: string;
    benchmarkOptions: BenchmarkOptions;
  } = msg;
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
