import { WebDriver, logging, Builder } from "selenium-webdriver";
import { CPUBenchmarkWebdriver, benchmarks } from "./benchmarksWebdriverAfterframe";
import { setUseShadowRoot, buildDriver, setUseRowShadowRoot, setShadowRootName, setButtonsInShadowRoot } from "./webdriverAccess";

import { TConfig, config as defaultConfig, FrameworkData, ErrorAndWarning, BenchmarkOptions } from "./common";
import { BenchmarkType } from "./benchmarksCommon";
import { getAfterframeDurations, initMeasurement } from "./benchmarksWebdriverAfterframe";

let config: TConfig = defaultConfig;

async function runBenchmark(driver: WebDriver, benchmark: CPUBenchmarkWebdriver, framework: FrameworkData): Promise<any> {
  await benchmark.run(driver, framework);
  if (config.LOG_PROGRESS) console.log("after run ", benchmark.benchmarkInfo.id, benchmark.benchmarkInfo.type, framework.name);
}

async function initBenchmark(driver: WebDriver, benchmark: CPUBenchmarkWebdriver, framework: FrameworkData): Promise<any> {
  await benchmark.init(driver, framework);
  if (config.LOG_PROGRESS) console.log("after initialized ", benchmark.benchmarkInfo.id, benchmark.benchmarkInfo.type, framework.name);
  await initMeasurement(driver);
}

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
  benchmark: CPUBenchmarkWebdriver,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let error: string = undefined;
  let warnings: string[] = [];
  let results: number[] = [];

  console.log("benchmarking ", framework, benchmark.benchmarkInfo.id);
  let driver: WebDriver = null;
  try {
    // let driver = buildDriver(benchmarkOptions); 
    let driver = await new Builder()
      .forBrowser(benchmarkOptions.browser)
      .build(); 
    console.log(`using afterframe measurement with ${benchmarkOptions.browser}`)
    await driver.manage().window().maximize();

    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      setUseShadowRoot(framework.useShadowRoot);
      setUseRowShadowRoot(framework.useRowShadowRoot);
      setShadowRootName(framework.shadowRootName);
      setButtonsInShadowRoot(framework.buttonsInShadowRoot);
      console.log("runCPUBenchmark: before loading page")
      // must be run with an IP adress otherwise Safari crashes with an error. 
      // Use the HOST env variable to set the HOST to an IP adress for safari!
      await driver.get(`http://${benchmarkOptions.HOST}:${benchmarkOptions.port}/${framework.uri}/index.html`);
      // Needed for Firefox
      await driver.sleep(50);
      console.log("runCPUBenchmark: initBenchmark")
      await initBenchmark(driver, benchmark, framework);
      console.log("runCPUBenchmark: runBenchmark")
      await runBenchmark(driver, benchmark, framework);
      console.log("runCPUBenchmark: getAfterframeDurations")
      results.push(...getAfterframeDurations());              
      console.log("runCPUBenchmark: loop end")
    }
    console.log("runCPUBenchmark: driver.quit");
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
  let runBenchmarks: Array<CPUBenchmarkWebdriver> = benchmarks.filter(b => benchmarkId === b.benchmarkInfo.id && b instanceof CPUBenchmarkWebdriver) as Array<CPUBenchmarkWebdriver>;
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
