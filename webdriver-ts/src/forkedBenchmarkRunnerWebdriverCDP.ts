import { WebDriver, logging } from "selenium-webdriver";
import { CPUBenchmarkWebdriverCDP, fileNameTrace } from "./benchmarksWebdriverCDP";
import { setUseShadowRoot, buildDriver, setUseRowShadowRoot, setShadowRootName, setButtonsInShadowRoot } from "./webdriverCDPAccess";
import {benchmarks} from "./benchmarkConfiguration";

import { TConfig, config as defaultConfig, FrameworkData, ErrorAndWarning, BenchmarkOptions } from "./common";
import { BenchmarkType, DurationMeasurementMode } from "./benchmarksCommon";
import * as fs from "fs/promises";
import { computeResultsCPU } from "./timeline";

let config: TConfig = defaultConfig;

// necessary to launch without specifiying a path
var chromedriver: any = require("chromedriver");

async function runBenchmark(driver: WebDriver, benchmark: CPUBenchmarkWebdriverCDP, framework: FrameworkData): Promise<any> {
  await benchmark.run(driver, framework);
  if (config.LOG_PROGRESS) console.log("after run ", benchmark.benchmarkInfo.id, benchmark.benchmarkInfo.type, framework.name);
}

async function afterBenchmark(driver: WebDriver, benchmark: CPUBenchmarkWebdriverCDP, framework: FrameworkData): Promise<any> {
  if (benchmark.after) {
    await benchmark.after(driver, framework);
    if (config.LOG_PROGRESS) console.log("after benchmark ", benchmark.benchmarkInfo.id, benchmark.benchmarkInfo.type, framework.name);
  }
}

async function initBenchmark(driver: WebDriver, benchmark: CPUBenchmarkWebdriverCDP, framework: FrameworkData): Promise<any> {
  await benchmark.init(driver, framework);
  if (config.LOG_PROGRESS) console.log("after initialized ", benchmark.benchmarkInfo.id, benchmark.benchmarkInfo.type, framework.name);
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
  benchmark: CPUBenchmarkWebdriverCDP,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let error: String = undefined;
  let warnings: String[] = [];
  let results: number[] = [];

  console.log("benchmarking ", framework, benchmark.benchmarkInfo.id, "with webdriver (tracing via CDP Connection)");
  let driver: WebDriver = null;
  try {
    driver = buildDriver(benchmarkOptions);
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      let trace: any = {"traceEvents":[]}; //await fs.open(fileNameTrace(framework, benchmark.benchmarkInfo, i), "w");
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

      await initBenchmark(driver, benchmark, framework);
      const cdpConnection = await (driver as any).createCDPConnection('page');
      if (benchmark.benchmarkInfo.throttleCPU) {
        console.log("CPU slowdown", benchmark.benchmarkInfo.throttleCPU);
        await (driver as any).sendDevToolsCommand("Emulation.setCPUThrottlingRate", { rate: benchmark.benchmarkInfo.throttleCPU });
      }

      let categories = [
        "blink.user_timing",
        "devtools.timeline",
        'disabled-by-default-devtools.timeline',
    ];

      console.log("**** Tracing start");
      await cdpConnection.execute("Tracing.start",
      {
        transferMode: 'ReportEvents',
        traceConfig: {
            enableSampling: false,
            enableSystrace: false,
            excludedCategories : [],
            includedCategories: categories,
        },
      })

      let p = new Promise((resolve,reject) => {
        cdpConnection._wsConnection.on('message', async (msg: any) => {
          let message: any = JSON.parse(msg);
          // console.log("####", typeof message, message.method, Object.keys(message), message);
          if (message.method==="Tracing.dataCollected") {
            // console.log("Tracing.dataCollected");
            trace.traceEvents = trace.traceEvents.concat(message.params.value);
          } else if (message.method==="Tracing.tracingComplete") {
            console.log("---- Tracing.tracingComplete", fileNameTrace(framework, benchmark.benchmarkInfo, i));
            await fs.writeFile(fileNameTrace(framework, benchmark.benchmarkInfo, i), JSON.stringify(trace), 'utf8');
            resolve({});
          }
        });  
      })

      await runBenchmark(driver, benchmark, framework);

      if (benchmark.benchmarkInfo.throttleCPU) {
        console.log("resetting CPU slowdown");
        await (driver as any).sendDevToolsCommand("Emulation.setCPUThrottlingRate", { rate: 1 });
      }
      await afterBenchmark(driver, benchmark, framework);

      await cdpConnection.execute("Tracing.end", {});
      await p;

      let result = await computeResultsCPU(config, fileNameTrace(framework, benchmark.benchmarkInfo, i), benchmark.benchmarkInfo.durationMeasurementMode);
      results.push(result);
      console.log(`duration for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${result}`);
      if (result < 0)
          throw new Error(`duration ${result} < 0`);                

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
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let runBenchmarks: Array<CPUBenchmarkWebdriverCDP> = benchmarks.filter(b => benchmarkId === b.benchmarkInfo.id && b instanceof CPUBenchmarkWebdriverCDP) as Array<CPUBenchmarkWebdriverCDP>;
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique (webdriver)`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning;
  if (benchmark.benchmarkInfo.type == BenchmarkType.CPU) {
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
