import { Browser, Page, CDPSession } from "playwright-core";
import { BenchmarkType, CPUBenchmarkResult, slowDownFactor } from "./benchmarksCommon.js";
import {
  benchmarks,
  CPUBenchmarkPlaywright,
  MemBenchmarkPlaywright,
  BenchmarkPlaywright,
} from "./benchmarksPlaywright.js";
import {
  BenchmarkOptions,
  config as defaultConfig,
  ErrorAndWarning,
  FrameworkData,
  Config,
} from "./common.js";
import { startBrowser } from "./playwrightAccess.js";
import { computeResultsCPU, fileNameTrace } from "./timeline.js";

let config: Config = defaultConfig;

async function runBenchmark(
  browser: Browser,
  page: Page,
  benchmark: BenchmarkPlaywright,
  framework: FrameworkData
): Promise<any> {
  await benchmark.run(browser, page, framework);
  if (config.LOG_PROGRESS) console.log("after run", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
}

async function initBenchmark(
  browser: Browser,
  page: Page,
  benchmark: BenchmarkPlaywright,
  framework: FrameworkData
): Promise<any> {
  await benchmark.init(browser, page, framework);
  if (config.LOG_PROGRESS) console.log("after initialized", benchmark.benchmarkInfo.id, benchmark.type, framework.name);
  // if (benchmark.type === BenchmarkType.MEM) {
  //   await forceGC(page);
  // }
}

const wait = (delay = 1000) => new Promise((res) => setTimeout(res, delay));

function convertError(error: any): string {
  console.log(
    "ERROR in run Benchmark: |",
    error,
    "| type:",
    typeof error,
    "instance of Error",
    error instanceof Error,
    "Message:",
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function forceGC(page: Page, client: CDPSession) {
  for (let i = 0; i < 7; i++) {
      // await client.send('HeapProfiler.collectGarbage');
    await page.evaluate("window.gc()");
  }
}

async function runCPUBenchmark(
  framework: FrameworkData,
  benchmark: CPUBenchmarkPlaywright,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning<CPUBenchmarkResult>> {
    let error: string = undefined;
    let warnings: string[] = [];
    let results: CPUBenchmarkResult[] = [];

    console.log("benchmarking", framework, benchmark.benchmarkInfo.id);
  let browser: Browser = null;
  let page: Page = null;
    try {
        browser = await startBrowser(benchmarkOptions);
        page = await browser.newPage();
        // if (config.LOG_DETAILS) {
    page.on("console", (msg) => {
      for (let i = 0; i < msg.args().length; ++i) console.log(`BROWSER: ${msg.args()[i]}`);
            });
        // }
        let client = await page.context().newCDPSession(page);
    await client.send("Performance.enable");
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      await page.goto(
        `http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`,
        {
          waitUntil: "networkidle",
        }
      );

            console.log("initBenchmark Playwright");
            await initBenchmark(browser, page, benchmark, framework);
            // minimal categories
            // result svelte-v3.46.2-keyed_01_run1k.json min 67.237 max 71.611 mean 69.4036 median 69.20949999999999 stddev 1.3601652023845432
            // default categories:
            // result svelte-v3.46.2-keyed_01_run1k.json min 61.334 max 65.92 mean 63.84379999999999 median 63.756 stddev 1.5925086987377977
            let categories = [
                "blink.user_timing",
                "devtools.timeline",
                "disabled-by-default-devtools.timeline",
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

            await forceGC(page, client);
            let throttleCPU = slowDownFactor(
              benchmark.benchmarkInfo.id,
              benchmarkOptions.allowThrottling
            );
            if (throttleCPU) {
              console.log("CPU slowdown", throttleCPU);
              await client.send("Emulation.setCPUThrottlingRate", { rate: throttleCPU });
            }

      await browser.startTracing(page, {
        path: fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions),
                screenshots: false,
        categories: categories,
            });
      
      const performanceMetrics1 = await client.send("Performance.getMetrics")
      let m1 = performanceMetrics1.metrics;
      let m1_val = m1.find((m) => m.name === "ScriptDuration").value;
      let m1_Timestamp = m1.find((m) => m.name === "Timestamp").value;
            console.log("m1", m1, m1_val);
            console.log("runBenchmark Playwright");
            await runBenchmark(browser, page, benchmark, framework);

            await wait(40);
            await browser.stopTracing();

      const performanceMetrics2 = await client.send("Performance.getMetrics")
      let m2 = performanceMetrics2.metrics;
      let m2_val = m2.find((m) => m.name === "ScriptDuration").value;
      let m2_Timestamp = m2.find((m) => m.name === "Timestamp").value;
            console.log("m2", m2, m2_val);
            if (throttleCPU) {
        await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
          }  
      let result = await computeResultsCPU(
        fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions)
      );
      let resultScript = (m2_val - m1_val) * 1000;
            console.log("**** resultScript =", resultScript);
            if (m2_Timestamp == m1_Timestamp) throw new Error("Page metrics timestamp didn't change");

      results.push({ total: result.duration, script: resultScript });
            console.log(`duration for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${result}`);
      if (result.duration < 0) throw new Error(`duration ${result} < 0`);
        }
    return { error, warnings, result: results };
    } catch (e) {
        console.log("ERROR", e);
        error = convertError(e);
    return { error, warnings };
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
                await browser.close();
            }
        } catch (err) {
            console.log("ERROR cleaning up driver", err);
        }
    }
}

async function runMemBenchmark(
  framework: FrameworkData,
  benchmark: MemBenchmarkPlaywright,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning<number>> {
  let error: string = undefined;
  let warnings: string[] = [];
  let results: number[] = [];

  console.log("benchmarking", framework, benchmark.benchmarkInfo.id);
  let browser: Browser = null;
  try {
    browser = await startBrowser(benchmarkOptions);
    const page = await browser.newPage();
    for (let i = 0; i < benchmarkOptions.batchSize; i++) {
      if (config.LOG_DETAILS) {
        page.on("console", (msg) => {
          for (let i = 0; i < msg.args().length; ++i) console.log(`BROWSER: ${msg.args()[i]}`);
        });
      }

      await page.goto(
        `http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`,
        {
          waitUntil: "networkidle",
        }
      );

      // await (driver as any).sendDevToolsCommand('Network.enable');
      // await (driver as any).sendDevToolsCommand('Network.emulateNetworkConditions', {
      //     offline: false,
      //     latency: 200, // ms
      //     downloadThroughput: 780 * 1024 / 8, // 780 kb/s
      //     uploadThroughput: 330 * 1024 / 8, // 330 kb/s
      // });
      console.log("initBenchmark");
      let client = await page.context().newCDPSession(page);
      await client.send("Performance.enable");
      await initBenchmark(browser, page, benchmark, framework);

      console.log("runBenchmark");
      await runBenchmark(browser, page, benchmark, framework);
      await forceGC(page, client);
      await wait(40);
      // let result = (await client.send('Performance.getMetrics')).metrics.filter((m) => m.name==='JSHeapUsedSize')[0].value / 1024 / 1024;

      let result = (await page.evaluate("performance.measureUserAgentSpecificMemory()") as any).bytes / 1024 / 1024;
      console.log("afterBenchmark ");
      results.push(result);
      console.log(`memory result for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${result}`);
      if (result < 0) throw new Error(`memory result ${result} < 0`);
    }
    await page.close();
    await browser.close();
    return { error, warnings, result: results };
  } catch (e) {
    console.log("ERROR", e);
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
): Promise<ErrorAndWarning<number | CPUBenchmarkResult>> {
  let runBenchmarks: Array<BenchmarkPlaywright> = benchmarks.filter(
    (b) =>
      benchmarkId === b.benchmarkInfo.id &&
      (b instanceof CPUBenchmarkPlaywright || b instanceof MemBenchmarkPlaywright)
  ) as Array<BenchmarkPlaywright>;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning<number | CPUBenchmarkResult>;
  if (benchmark.type == BenchmarkType.CPU) {
    errorAndWarnings = await runCPUBenchmark(
      framework,
      benchmark as CPUBenchmarkPlaywright,
      benchmarkOptions
    );
  } else {
    errorAndWarnings = await runMemBenchmark(
      framework,
      benchmark as MemBenchmarkPlaywright,
      benchmarkOptions
    );
  }
  if (config.LOG_DEBUG) console.log("benchmark finished - got errors promise", errorAndWarnings);
  return errorAndWarnings;
}

process.on("message", (msg: any) => {
  config = msg.config;
  console.log("START PLAYWRIGHT BENCHMARK.");
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
      console.log("* success", result);
      process.send(result);
      process.exit(0);
    })
    .catch((err) => {
      console.log("CATCH: Error in forkedBenchmarkRunner", err);
      process.send({ failure: convertError(err) });
      process.exit(0);
    });
});
