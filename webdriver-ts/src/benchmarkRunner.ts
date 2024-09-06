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
  SizeBenchmarkInfo,
  StartupBenchmarkInfo,
} from "./benchmarksCommon.js";
import { StartupBenchmarkResult } from "./benchmarksLighthouse.js";
import { writeResults } from "./writeResults.js";
import { PlausibilityCheck } from "./timeline.js";
import { SizeBenchmarkResult } from "./benchmarksSize.js";

function forkAndCallBenchmark(
  framework: FrameworkData,
  benchmarkInfo: BenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning<number | CPUBenchmarkResult | StartupBenchmarkResult | SizeBenchmarkResult>> {
  return new Promise((resolve, reject) => {
    let forkedRunner = null;
    if (benchmarkInfo.type === BenchmarkType.STARTUP_MAIN) {
      forkedRunner = "dist/forkedBenchmarkRunnerLighthouse.js";
    } else if (benchmarkInfo.type === BenchmarkType.SIZE_MAIN) {
      forkedRunner = "dist/forkedBenchmarkRunnerSize.js";
    } else if (config.BENCHMARK_RUNNER == BenchmarkRunner.WEBDRIVER_CDP) {
      forkedRunner = "dist/forkedBenchmarkRunnerWebdriverCDP.js";
    } else if (config.BENCHMARK_RUNNER == BenchmarkRunner.PLAYWRIGHT) {
      forkedRunner = "dist/forkedBenchmarkRunnerPlaywright.js";
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

async function runBenchmakLoopSize(
  framework: FrameworkData,
  benchmarkInfo: SizeBenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<{ errors: string[]; warnings: string[] }> {
  let warnings: string[] = [];
  let errors: string[] = [];

  let results: Array<SizeBenchmarkResult> = [];
  let count = benchmarkOptions.numIterationsForSizeBenchmark;
  benchmarkOptions.batchSize = 1;

  let done = 0;

  console.log("runBenchmakLoopSize", framework, benchmarkInfo);

  while (done < count) {
    console.log("FORKING:", benchmarkInfo.id, "BatchSize", benchmarkOptions.batchSize);
    let res = await forkAndCallBenchmark(framework, benchmarkInfo, benchmarkOptions);
    if (Array.isArray(res.result)) {
      results = results.concat(res.result as SizeBenchmarkResult[]);
    } else {
      results.push(res.result);
    }
    warnings = warnings.concat(res.warnings);
    if (res.error) {
      errors.push(`Executing ${framework.uri} and benchmark ${benchmarkInfo.id} failed: ` + res.error);
    }
    done++;
  }
  if (config.WRITE_RESULTS) {
    await writeResults(benchmarkOptions.resultsDirectory, {
      framework: framework,
      benchmark: benchmarkInfo,
      results: results,
      type: BenchmarkType.SIZE,
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
      console.log(`Executing ${framework.uri} and benchmark ${benchmarkInfo.id} failed: ` + res.error);
      errors.push(`Executing ${framework.uri} and benchmark ${benchmarkInfo.id} failed: ` + res.error);
      break;
    }
  }
  if (config.WRITE_RESULTS) {
    if (benchmarkInfo.type == BenchmarkType.CPU) {
      await writeResults(benchmarkOptions.resultsDirectory, {
        framework: framework,
        benchmark: benchmarkInfo,
        results: results as CPUBenchmarkResult[],
        type: BenchmarkType.CPU,
      });
    } else {
      await writeResults(benchmarkOptions.resultsDirectory, {
        framework: framework,
        benchmark: benchmarkInfo,
        results: results as number[],
        type: BenchmarkType.MEM,
      });
    }
  }
  return { errors, warnings };
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

  for (let i = 0; i < runFrameworks.length; i++) {
    for (let j = 0; j < benchmarkInfos.length; j++) {
      try {
        let result;

        if (benchmarkInfos[j].type == BenchmarkType.SIZE_MAIN) {
          result = await runBenchmakLoopSize(
            runFrameworks[i],
            benchmarkInfos[j] as SizeBenchmarkInfo,
            benchmarkOptions
          );
        } else if (benchmarkInfos[j].type == BenchmarkType.CPU) {
          result = await runBenchmakLoop(
            runFrameworks[i],
            benchmarkInfos[j] as CPUBenchmarkInfo,
            benchmarkOptions,
            plausibilityCheck
          );
        } else {
          result = await runBenchmakLoop(
            runFrameworks[i],
            benchmarkInfos[j] as MemBenchmarkInfo,
            benchmarkOptions,
            plausibilityCheck
          );
        }
        errors = errors.concat(result.errors);
        warnings = warnings.concat(result.warnings);
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

    warnings.forEach((e) => {
      console.log(e);
    });
  }

  plausibilityCheck.print();

  if (errors.length > 0) {
    console.log("================================");
    console.log("The following benchmarks failed:");
    console.log("================================");

    errors.forEach((e) => {
      console.log(e);
    });
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
    .string("type")
    .boolean("nothrottling")
    .default("nothrottling", false)
    .string("runner")
    .default("runner", "puppeteer")
    .string("browser")
    .default("browser", "chrome")
    .array("framework")
    .array("benchmark")
    .number("count")
    .number("puppeteerSleep")
    .string("chromeBinary").argv;

  console.log("args", args);

  let runner = args.runner;
  if (
    [
      BenchmarkRunner.WEBDRIVER_CDP,
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
      BenchmarkRunner.WEBDRIVER_AFTERFRAME,
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
    numIterationsForSizeBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_SIZE,
    batchSize: 1,
    resultsDirectory: "results",
    tracesDirectory: "traces",
    allowThrottling: !args.nothrottling,
    puppeteerSleep: args.puppeteerSleep ?? 0,
  };

  config.PUPPETEER_WAIT_MS = benchmarkOptions.puppeteerSleep;

  if (args.count) {
    benchmarkOptions.numIterationsForCPUBenchmarks = args.count;
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT = 0;
    benchmarkOptions.numIterationsForMemBenchmarks = args.count;
    benchmarkOptions.numIterationsForStartupBenchmark = args.count;
  }

  let allArgs = args._.length <= 2 ? [] : args._.slice(2);
  let frameworkArgument = args.framework ? args.framework : allArgs;
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

  let runFrameworks: FrameworkData[];
  let matchesDirectoryArg = (directoryName: string) =>
    frameworkArgument.length === 0 || frameworkArgument.some((arg: string) => arg == directoryName);
  let frameworks = await initializeFrameworks(benchmarkOptions, matchesDirectoryArg);
  runFrameworks = frameworks.filter((f) => f.keyed || config.BENCHMARK_RUNNER !== BenchmarkRunner.WEBDRIVER_AFTERFRAME);

  if (args.type == "keyed") {
    runFrameworks = runFrameworks.filter((f) => f.keyed);
    console.log("run only keyed frameworks");
  } else if (args.type == "non-keyed") {
    runFrameworks = runFrameworks.filter((f) => !f.keyed);
    console.log("run only non-keyed frameworks");
  }

  console.log("ARGS.smotest", args.smoketest);
  if (args.smoketest) {
    config.WRITE_RESULTS = false;
    benchmarkOptions.numIterationsForCPUBenchmarks = 1;
    benchmarkOptions.numIterationsForMemBenchmarks = 1;
    benchmarkOptions.numIterationsForStartupBenchmark = 1;
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT = 0;
    config.EXIT_ON_ERROR = true;
    cpuBenchmarkInfosArray.forEach((b) => {
      b.additionalNumberOfRuns = 0;
    });
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

main()
  .then(() => {
    console.log("successful run");
    process.exit(0);
  })
  .catch((error) => {
    console.log("run was not completely sucessful", error);
    process.exit(1);
  });
