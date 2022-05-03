import { Browser, Page } from "puppeteer-core";
import { BenchmarkType } from "./benchmarksCommon";
import { CPUBenchmarkPuppeteer, fileNameTrace, MemBenchmarkPuppeteer, TBenchmarkPuppeteer, benchmarks } from "./benchmarksPuppeteer";
import { BenchmarkOptions, config as defaultConfig, ErrorAndWarning, FrameworkData, TConfig } from "./common";
import { startBrowser } from "./puppeteerAccess";
import { computeResultsCPU } from "./timeline";


let config: TConfig = defaultConfig;

async function runBenchmark(page: Page, benchmark: TBenchmarkPuppeteer, framework: FrameworkData): Promise<any> {
  await benchmark.run(page, framework);
  if (config.LOG_PROGRESS) console.log("after run ", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
  if (benchmark.type === BenchmarkType.MEM) {
    await forceGC(page);
  }
}

async function afterBenchmark(page: Page, benchmark: TBenchmarkPuppeteer, framework: FrameworkData): Promise<any> {
  if (benchmark.after) {
    await benchmark.after(page, framework);
    if (config.LOG_PROGRESS) console.log("after benchmark ", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
  }
}

async function initBenchmark(page: Page, benchmark: TBenchmarkPuppeteer, framework: FrameworkData): Promise<any> {
  await benchmark.init(page, framework);
  if (config.LOG_PROGRESS) console.log("after initialized ", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
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

async function runCPUBenchmark(framework: FrameworkData, benchmark: CPUBenchmarkPuppeteer, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning>
{
    let error: String = undefined;
    let warnings: String[] = [];
    let results: number[] = [];

    console.log("benchmarking ", framework, benchmark.benchmarkInfo.id);
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
            await page.goto(`http://${benchmarkOptions.HOST}:${benchmarkOptions.port}/${framework.uri}/index.html`, {waitUntil: "networkidle0"});

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
                "blink.user_timing",
                "devtools.timeline",
                'disabled-by-default-devtools.timeline',
            ];
            // let categories = [
            // "loading",
            // 'devtools.timeline',
            //   'disabled-by-default-devtools.timeline',
            //   '-*',
            //   'v8.execute',
            //     'disabled-by-default-devtools.timeline.frame',
            //     'toplevel',
            //     'blink.console',
            //     'blink.user_timing',
            //     'latencyInfo',
            //     'disabled-by-default-v8.cpu_profiler',                
            //     'disabled-by-default-devtools.timeline.stack',
            // ];

            if (benchmark.benchmarkInfo.throttleCPU) {
              console.log("CPU slowdown", benchmark.benchmarkInfo.throttleCPU);
              await page.emulateCPUThrottling(benchmark.benchmarkInfo.throttleCPU);
          }
  
            await page.tracing.start({path: fileNameTrace(framework, benchmark.benchmarkInfo, i), 
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
            if (benchmark.benchmarkInfo.throttleCPU) {
              await page.emulateCPUThrottling(1);
          }
  
            // console.log("afterBenchmark", m1, m2);
            // let result = (m2.TaskDuration - m1.TaskDuration)*1000.0; //await computeResultsCPU(fileNameTrace(framework, benchmark, i), benchmarkOptions, framework, benchmark, warnings, benchmarkOptions.batchSize);
            let result = await computeResultsCPU(config, fileNameTrace(framework, benchmark.benchmarkInfo, i), benchmark.benchmarkInfo.durationMeasurementMode);
            results.push(result);
            console.log(`duration for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${result}`);
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
  benchmark: MemBenchmarkPuppeteer,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  let error: String = undefined;
  let warnings: String[] = [];
  let results: number[] = [];

  console.log("benchmarking ", framework, benchmark.benchmarkInfo.id);
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

      await page.goto(`http://${benchmarkOptions.HOST}:${benchmarkOptions.port}/${framework.uri}/index.html`);

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
      console.log(`memory result for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${result}`);
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
  let runBenchmarks: Array<TBenchmarkPuppeteer> = benchmarks.filter(b => benchmarkId === b.benchmarkInfo.id && (b instanceof CPUBenchmarkPuppeteer || b instanceof MemBenchmarkPuppeteer) ) as Array<TBenchmarkPuppeteer>;
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique (puppeteer)`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning;
  if (benchmark.type == BenchmarkType.CPU) {
    errorAndWarnings = await runCPUBenchmark(framework, benchmark as CPUBenchmarkPuppeteer, benchmarkOptions);
  } else {
    errorAndWarnings = await runMemBenchmark(framework, benchmark as MemBenchmarkPuppeteer, benchmarkOptions);
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
