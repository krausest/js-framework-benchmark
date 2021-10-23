import { startBrowser } from "./puppeteerAccess";

const lighthouse = require("lighthouse");

import { TConfig, config as defaultConfig, FrameworkData, ErrorAndWarning, BenchmarkOptions } from "./common";
import { Browser, Page } from "puppeteer-core";
import { BenchmarkType } from "./benchmarksGeneric";
import { BenchmarkPuppeteer, benchmarksPuppeteer } from "./benchmarksPuppeteer";

let config: TConfig = defaultConfig;

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
  let runBenchmarks = benchmarksPuppeteer.filter((b) => benchmarkId === b.id);
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning;
  errorAndWarnings = await runMemBenchmark(framework, benchmark, benchmarkOptions);
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
