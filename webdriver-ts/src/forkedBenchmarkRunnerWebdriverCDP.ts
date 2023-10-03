import * as fs from "node:fs/promises";
import { WebDriver } from "selenium-webdriver";
import {
  BenchmarkType,
  CPUBenchmarkResult,
  slowDownFactor,
} from "./benchmarksCommon.js";
import {
  benchmarks,
  CPUBenchmarkWebdriverCDP,
} from "./benchmarksWebdriverCDP.js";
import {
  BenchmarkOptions,
  config as defaultConfig,
  ErrorAndWarning,
  FrameworkData,
  Config,
} from "./common.js";
import { computeResultsCPU, fileNameTrace } from "./timeline.js";
import {
  buildDriver,
  setButtonsInShadowRoot,
  setShadowRootName,
  setUseRowShadowRoot,
  setUseShadowRoot,
} from "./webdriverCDPAccess.js";

let config: Config = defaultConfig;

const { LOG_PROGRESS, LOG_DEBUG } = config;

// necessary to launch without specifiying a path
require("chromedriver");

async function runBenchmark(
  driver: WebDriver,
  benchmark: CPUBenchmarkWebdriverCDP,
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
  benchmark: CPUBenchmarkWebdriverCDP,
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
  benchmark: CPUBenchmarkWebdriverCDP,
  benchmarkOptions: BenchmarkOptions,
): Promise<ErrorAndWarning<CPUBenchmarkResult>> {
  let error: string = undefined;
  let warnings: string[] = [];
  let results: CPUBenchmarkResult[] = [];

  console.log(
    "benchmarking ",
    framework,
    benchmark.benchmarkInfo.id,
    "with webdriver (tracing via CDP Connection)",
  );
  let driver: WebDriver = null;
  try {
    driver = buildDriver(benchmarkOptions);
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      let trace: any = { traceEvents: [] }; //await fs.open(fileNameTrace(framework, benchmark.benchmarkInfo, i), "w");
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

      await initBenchmark(driver, benchmark, framework);
      const cdpConnection = await (driver as any).createCDPConnection("page");
      let throttleCPU = slowDownFactor(
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

      let categories = [
        "blink.user_timing",
        "devtools.timeline",
        "disabled-by-default-devtools.timeline",
      ];

      console.log("**** Tracing start");
      await cdpConnection.execute("Tracing.start", {
        transferMode: "ReportEvents",
        traceConfig: {
          enableSampling: false,
          enableSystrace: false,
          excludedCategories: [],
          includedCategories: categories,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let p = new Promise((resolve, reject) => {
        cdpConnection._wsConnection.on("message", async (msg: any) => {
          let message: any = JSON.parse(msg);
          // console.log("####", typeof message, message.method, Object.keys(message), message);
          if (message.method === "Tracing.dataCollected") {
            // console.log("Tracing.dataCollected");
            trace.traceEvents = trace.traceEvents.concat(message.params.value);
          } else if (message.method === "Tracing.tracingComplete") {
            console.log(
              "---- Tracing.tracingComplete",
              fileNameTrace(
                framework,
                benchmark.benchmarkInfo,
                i,
                benchmarkOptions,
              ),
            );
            await fs.writeFile(
              fileNameTrace(
                framework,
                benchmark.benchmarkInfo,
                i,
                benchmarkOptions,
              ),
              JSON.stringify(trace),
              "utf8",
            );
            resolve({});
          }
        });
      });

      await runBenchmark(driver, benchmark, framework);

      if (throttleCPU) {
        console.log("resetting CPU slowdown");
        await (driver as any).sendDevToolsCommand(
          "Emulation.setCPUThrottlingRate",
          { rate: 1 },
        );
      }
      await cdpConnection.execute("Tracing.end", {});
      await p;

      let result = await computeResultsCPU(
        fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions),
      );
      results.push({ total: result.duration, script: 0 });
      console.log(
        `duration for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${result}`,
      );
      if (result.duration < 0) throw new Error(`duration ${result} < 0`);
    }
    await driver.close();
    await driver.quit();
    return { error, warnings, result: results };
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
  let runBenchmarks: Array<CPUBenchmarkWebdriverCDP> = benchmarks.filter(
    (b) =>
      benchmarkId === b.benchmarkInfo.id &&
      b instanceof CPUBenchmarkWebdriverCDP,
  ) as Array<CPUBenchmarkWebdriverCDP>;
  if (runBenchmarks.length != 1)
    throw `Benchmark name ${benchmarkId} is not unique (webdriver)`;

  let benchmark = runBenchmarks[0];

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

  let {
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
