import yargs from "yargs";
import {
  BenchmarkOptions,
  BenchmarkRunner,
  config,
  ErrorAndWarning,
  FrameworkData,
  initializeFrameworks,
} from "./common.js";
import { fork } from "node:child_process";
import * as fs from "node:fs";
import {
  BenchmarkInfo,
  benchmarkInfos,
  BenchmarkType,
  CPUBenchmarkInfo,
  cpuBenchmarkInfosArray,
  CPUBenchmarkResult,
  MemBenchmarkInfo,
  StartupBenchmarkInfo,
} from "./benchmarksCommon.js";
import { StartupBenchmarkResult } from "./benchmarksLighthouse.js";
import { writeResults } from "./writeResults.js";
import { PlausibilityCheck } from "./timeline.js";

function forkAndCallBenchmark(
  framework: FrameworkData,
  benchmarkInfo: BenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning<number | CPUBenchmarkResult | StartupBenchmarkResult>> {
  return new Promise((resolve, reject) => {
    let forkedRunner = null;
    if (benchmarkInfo.type === BenchmarkType.STARTUP_MAIN) {
      forkedRunner = "dist/forkedBenchmarkRunnerLighthouse.js";
    } else if (config.BENCHMARK_RUNNER == BenchmarkRunner.WEBDRIVER_CDP) {
      forkedRunner = "dist/forkedBenchmarkRunnerWebdriverCdp.js";
    } else if (config.BENCHMARK_RUNNER == BenchmarkRunner.PLAYWRIGHT) {
      forkedRunner = "dist/forkedBenchmarkRunnerPlaywright.js";
    } else if (config.BENCHMARK_RUNNER == BenchmarkRunner.WEBDRIVER) {
      forkedRunner = "dist/forkedBenchmarkRunnerWebdriver.js";
    } else if (config.BENCHMARK_RUNNER == BenchmarkRunner.WEBDRIVER_AFTERFRAME) {
      forkedRunner = "dist/forkedBenchmarkRunnerWebdriverAfterframe.js";
    } else {
      forkedRunner = "dist/forkedBenchmarkRunnerPuppeteer.js";
    }
    console.log("forking", forkedRunner);
    const forked = fork(forkedRunner);
    if (config.LOG_DETAILS) console.log("FORKING:  forked child process");
    forked.send({
      config,
      framework,
      benchmarkId: benchmarkInfo.id,
      benchmarkOptions,
    });
    forked.on("message", (msg: ErrorAndWarning<number | CPUBenchmarkResult | StartupBenchmarkResult>) => {
      if (config.LOG_DETAILS) console.log("FORKING: main process got message from child", msg);
      resolve(msg);
    });
    forked.on("close", (msg) => {
      if (config.LOG_DETAILS) console.log("FORKING: child closed", msg);
    });
    forked.on("error", (msg) => {
      if (config.LOG_DETAILS) console.log("FORKING: child error", msg);
      reject(msg);
    });
    forked.on("exit", (code, signal) => {
      if (config.LOG_DEBUG) console.log("child exit", code, signal);
    });
  });
}

async function runBenchmakLoopStartup(
  framework: FrameworkData,
  benchmarkInfo: StartupBenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<{ errors: string[]; warnings: string[] }> {
  let warnings: string[] = [];
  let errors: string[] = [];

  let results: Array<StartupBenchmarkResult> = [];
  let count = benchmarkOptions.numIterationsForStartupBenchmark;
  benchmarkOptions.batchSize = 1;

  let retries = 0;
  let done = 0;

  console.log("runBenchmakLoopStartup", framework, benchmarkInfo);

  while (done < count) {
    console.log("FORKING:", benchmarkInfo.id, "BatchSize", benchmarkOptions.batchSize);
    let res = await forkAndCallBenchmark(framework, benchmarkInfo, benchmarkOptions);
    if (Array.isArray(res.result)) {
      results = results.concat(res.result as StartupBenchmarkResult[]);
    } else results.push(res.result);
    warnings = warnings.concat(res.warnings);
    if (res.error) {
      if (res.error.includes("Server terminated early with status 1")) {
        console.log("******* STRANGE selenium error found - retry #", retries + 1);
        retries++;
        if (retries == 3) break;
      } else {
        errors.push(`Executing ${framework.uri} and benchmark ${benchmarkInfo.id} failed: ` + res.error);
        break;
      }
    }
    done++;
  }
  console.log("******* result", results);
  if (config.WRITE_RESULTS) {
    await writeResults(benchmarkOptions.resultsDirectory, {
      framework: framework,
      benchmark: benchmarkInfo,
      results: results,
      type: BenchmarkType.STARTUP,
    });
  }
  return { errors, warnings };
  // } else {
  //     return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
}

async function runBenchmakLoop(
  framework: FrameworkData,
  benchmarkInfo: CPUBenchmarkInfo | MemBenchmarkInfo,
  benchmarkOptions: BenchmarkOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  plausibilityCheck: PlausibilityCheck
): Promise<{ errors: string[]; warnings: string[] }> {
  let warnings: string[] = [];
  let errors: string[] = [];

  let results: Array<CPUBenchmarkResult | number> = [];
  let count = 0;

  if (benchmarkInfo.type == BenchmarkType.CPU) {
    count = benchmarkOptions.numIterationsForCPUBenchmarks + benchmarkInfo.additionalNumberOfRuns;
    benchmarkOptions.batchSize = config.ALLOW_BATCHING && benchmarkInfo.allowBatching ? count : 1;
  } else if (benchmarkInfo.type == BenchmarkType.MEM) {
    count = benchmarkOptions.numIterationsForMemBenchmarks;
    benchmarkOptions.batchSize = 1;
  }

  let retries = 0;

  console.log("runBenchmakLoop", framework, benchmarkInfo);

  while (results.length < count) {
    benchmarkOptions.batchSize = Math.min(benchmarkOptions.batchSize, count - results.length);
    console.log("FORKING:", benchmarkInfo.id, "BatchSize", benchmarkOptions.batchSize);
    let res = await forkAndCallBenchmark(framework, benchmarkInfo, benchmarkOptions);
    if (Array.isArray(res.result)) {
      results = results.concat(res.result as number[] | CPUBenchmarkResult[]);
    } else if (res.result !== undefined) {
      results.push(res.result);
    }
    warnings = warnings.concat(res.warnings);
    if (res.error) {
      if (res.error.includes("Server terminated early with status 1")) {
        console.log("******* STRANGE selenium error found - retry #", retries + 1);
        retries++;
        if (retries == 3) break;
      } else {
        errors.push(`Executing ${framework.uri} and benchmark ${benchmarkInfo.id} failed: ` + res.error);
        break;
      }
    }
  }
  if (benchmarkInfo.type == BenchmarkType.CPU) {
    console.log("CPU results before:", results);
    // (results as CPUBenchmarkResult[]).sort(
    //   (a: CPUBenchmarkResult, b: CPUBenchmarkResult) => a.total - b.total
    // );
    // results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU);
    // console.log("CPU results after: ", results)
  }

  console.log("******* result", results);
  if (config.WRITE_RESULTS) {
    await (benchmarkInfo.type == BenchmarkType.CPU
      ? writeResults(benchmarkOptions.resultsDirectory, {
          framework: framework,
          benchmark: benchmarkInfo,
          results: results as CPUBenchmarkResult[],
          type: BenchmarkType.CPU,
        })
      : writeResults(benchmarkOptions.resultsDirectory, {
          framework: framework,
          benchmark: benchmarkInfo,
          results: results as number[],
          type: BenchmarkType.MEM,
        }));
  }
  return { errors, warnings };
  // } else {
  //     return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
}

async function runBench(
  runFrameworks: FrameworkData[],
  benchmarkInfos: BenchmarkInfo[],
  benchmarkOptions: BenchmarkOptions
) {
  let errors: string[] = [];
  let warnings: string[] = [];

  let restart: string;
  let index = runFrameworks.findIndex((f) => f.fullNameWithKeyedAndVersion === restart);
  if (index > -1) {
    runFrameworks = runFrameworks.slice(index);
  }

  console.log(
    "Frameworks that will be benchmarked",
    runFrameworks.map((f) => f.fullNameWithKeyedAndVersion)
  );
  console.log(
    "Benchmarks that will be run",
    benchmarkInfos.map((b) => b.id)
  );

  let plausibilityCheck = new PlausibilityCheck();

  for (const runFramework of runFrameworks) {
    for (const benchmarkInfo of benchmarkInfos) {
      try {
        let result;

        if (benchmarkInfo.type == BenchmarkType.STARTUP_MAIN) {
          result = await runBenchmakLoopStartup(
            runFramework,
            benchmarkInfo as unknown as StartupBenchmarkInfo,
            benchmarkOptions
          );
        } else if (benchmarkInfo.type == BenchmarkType.CPU) {
          result = await runBenchmakLoop(
            runFramework,
            benchmarkInfo as CPUBenchmarkInfo,
            benchmarkOptions,
            plausibilityCheck
          );
        } else {
          result = await runBenchmakLoop(
            runFramework,
            benchmarkInfo as MemBenchmarkInfo,
            benchmarkOptions,
            plausibilityCheck
          );
        }
        errors = [...errors, ...result.errors];
        warnings = [...warnings, ...result.warnings];
      } catch (error) {
        console.log("UNHANDELED ERROR", error);
        errors.push(error as string);
      }
    }
  }

  if (warnings.length > 0) {
    console.log("================================");
    console.log("The following warnings were logged:");
    console.log("================================");

    for (const e of warnings) {
      console.log(e);
    }
  }

  plausibilityCheck.print();

  if (errors.length > 0) {
    console.log("================================");
    console.log("The following benchmarks failed:");
    console.log("================================");

    for (const e of errors) {
      console.log(e);
    }
    throw "Benchmarking failed with errors";
  }
}

async function main() {
  // FIXME: Clean up args.
  // What works: npm run bench keyed/react, npm run bench -- keyed/react, npm run bench -- keyed/react --count 1 --benchmark 01_
  // What doesn't work (keyed/react becomes an element of argument benchmark): npm run bench -- --count 1 --benchmark 01_ keyed/react

  console.error("PLEASE MAKE SURE THAT YOUR MOUSE IS OUTSIDE OF THE BROWSER WINDOW - and sorry for shouting :-) ");

  let args: any = yargs(process.argv)
    .usage(
      "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
    )
    .help("help")
    .boolean("headless")
    .default("headless", false)
    .boolean("smoketest")
    .boolean("nothrottling")
    .default("nothrottling", false)
    .string("runner")
    .default("runner", "puppeteer")
    .string("browser")
    .default("browser", "chrome")
    .array("framework")
    .array("benchmark")
    .number("count")
    .string("chromeBinary").argv;

  console.log("args", args);

  let runner = args.runner;
  if (
    [
      BenchmarkRunner.WEBDRIVER_CDP,
      BenchmarkRunner.WEBDRIVER,
      BenchmarkRunner.WEBDRIVER_AFTERFRAME,
      BenchmarkRunner.PLAYWRIGHT,
      BenchmarkRunner.PUPPETEER,
    ].includes(runner)
  ) {
    console.log(`INFO: Using ${runner} benchmark runner`);
    config.BENCHMARK_RUNNER = runner;
  } else {
    console.log("ERROR: argument driver has illegal value " + runner, [
      BenchmarkRunner.WEBDRIVER_CDP,
      BenchmarkRunner.WEBDRIVER,
      BenchmarkRunner.PLAYWRIGHT,
      BenchmarkRunner.PUPPETEER,
    ]);
    process.exit(1);
  }
  console.log("HEADLESS***", args.headless);

  let benchmarkOptions: BenchmarkOptions = {
    port: 8080,
    host: "localhost",
    browser: args.browser,
    remoteDebuggingPort: 9999,
    chromePort: 9998,
    headless: args.headless,
    chromeBinaryPath: args.chromeBinary,
    numIterationsForCPUBenchmarks:
      config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
    numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
    numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
    batchSize: 1,
    resultsDirectory: "results",
    tracesDirectory: "traces",
    allowThrottling: !args.nothrottling,
  };

  if (args.count) {
    benchmarkOptions.numIterationsForCPUBenchmarks = args.count;
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT = 0;
    benchmarkOptions.numIterationsForMemBenchmarks = args.count;
    benchmarkOptions.numIterationsForStartupBenchmark = args.count;
  }

  let allArgs = args._.length <= 2 ? [] : args._.slice(2, args._.length);
  let frameworkArgument = args.framework || allArgs;
  console.log("args", args, "allArgs", allArgs);

  if (process.env.HOST) {
    benchmarkOptions.host = process.env.HOST;
    console.log(`INFO: Using host ${benchmarkOptions.host} instead of localhost`);
  }
  console.log("benchmarkOptions", benchmarkOptions);

  let runBenchmarksArgs: string[] = args.benchmark && args.benchmark.length > 0 ? args.benchmark : [""];
  let runBenchmarks: Array<BenchmarkInfo> = benchmarkInfos.filter(
    (b) =>
      // afterframe currently only targets CPU benchmarks
      (config.BENCHMARK_RUNNER !== BenchmarkRunner.WEBDRIVER_AFTERFRAME || b.type == BenchmarkType.CPU) &&
      runBenchmarksArgs.some((name) => b.id.toLowerCase().includes(name))
  );

  let matchesDirectoryArg = (directoryName: string) =>
    frameworkArgument.length === 0 || frameworkArgument.some((arg: string) => arg == directoryName);
  const initializedFrameworks = await initializeFrameworks(benchmarkOptions, matchesDirectoryArg);
  const runFrameworks = initializedFrameworks.filter(
    (f) => f.keyed || config.BENCHMARK_RUNNER !== BenchmarkRunner.WEBDRIVER_AFTERFRAME
  );

  console.log("ARGS.smotest", args.smoketest);
  if (args.smoketest) {
    config.WRITE_RESULTS = false;
    benchmarkOptions.numIterationsForCPUBenchmarks = 1;
    benchmarkOptions.numIterationsForMemBenchmarks = 1;
    benchmarkOptions.numIterationsForStartupBenchmark = 1;
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT = 0;
    config.EXIT_ON_ERROR = true;
    for (const b of cpuBenchmarkInfosArray) {
      b.additionalNumberOfRuns = 0;
    }
    console.log("Using smoketest config", JSON.stringify(config));
  }
  if (config.BENCHMARK_RUNNER == BenchmarkRunner.WEBDRIVER_AFTERFRAME) {
    benchmarkOptions.resultsDirectory = "results_client_" + benchmarkOptions.browser;
  }
  if (!fs.existsSync(benchmarkOptions.resultsDirectory)) fs.mkdirSync(benchmarkOptions.resultsDirectory);
  if (!fs.existsSync(benchmarkOptions.tracesDirectory)) fs.mkdirSync(benchmarkOptions.tracesDirectory);

  if (args.help) {
    // yargs.showHelp();
  } else {
    return runBench(runFrameworks, runBenchmarks, benchmarkOptions);
  }
}

try {
  await main();
  console.log("successful run");
  process.exit(0);
} catch (error) {
  console.log("run was not completely sucessful", error);
  process.exit(1);
}
