import { fork } from "child_process";
import * as fs from "fs";
import * as yargs from "yargs";
import { BenchmarkInfo, benchmarkInfos, BenchmarkType, CPUBenchmarkInfo, MemBenchmarkInfo, StartupBenchmarkInfo } from "./benchmarksCommon";
import { StartupBenchmarkResult } from "./benchmarksLighthouse";
import { BenchmarkOptions, BENCHMARK_RUNNER, config, ErrorAndWarning, FrameworkData, initializeFrameworks } from "./common";
import { writeResults } from "./writeResults";

function forkAndCallBenchmark(
  framework: FrameworkData,
  benchmarkInfo: BenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  return new Promise((resolve, reject) => {
    let forkedRunner = null;
    if (benchmarkInfo.type === BenchmarkType.STARTUP_MAIN) {
      forkedRunner = "dist/forkedBenchmarkRunnerLighthouse.js";
    } else if (config.BENCHMARK_RUNNER == BENCHMARK_RUNNER.WEBDRIVER_CDP) {
      forkedRunner = "dist/forkedBenchmarkRunnerWebdriverCDP.js";
    } else if (config.BENCHMARK_RUNNER == BENCHMARK_RUNNER.PLAYWRIGHT) {
      forkedRunner = "dist/forkedBenchmarkRunnerPlaywright.js";
    } else if (config.BENCHMARK_RUNNER == BENCHMARK_RUNNER.WEBDRIVER) {
      forkedRunner = "dist/forkedBenchmarkRunnerWebdriver.js";
    } else {
      forkedRunner = "dist/forkedBenchmarkRunnerPuppeteer.js";
    }
    console.log("forking ",forkedRunner);
    const forked = fork(forkedRunner);
    if (config.LOG_DETAILS) console.log("FORKING:  forked child process");
    forked.send({
      config,
      framework,
      benchmarkId: benchmarkInfo.id,
      benchmarkOptions,
    });
    forked.on("message", async (msg: ErrorAndWarning) => {
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
): Promise<{ errors: String[]; warnings: String[] }> {
  let warnings: String[] = [];
  let errors: String[] = [];

  let results: Array<StartupBenchmarkResult> = [];
  let count = benchmarkOptions.numIterationsForStartupBenchmark;
  benchmarkOptions.batchSize = 1;

  let retries = 0;
  let done = 0;

  console.log("runBenchmakLoopStartup", framework, benchmarkInfo);


  while (done < count) {
    console.log("FORKING: ", benchmarkInfo.id, " BatchSize ", benchmarkOptions.batchSize);
    let res = await forkAndCallBenchmark(framework, benchmarkInfo, benchmarkOptions);
    if (Array.isArray(res.result)) {
      results = results.concat(res.result as StartupBenchmarkResult[]);
    } else results.push(res.result);
    warnings = warnings.concat(res.warnings);
    if (res.error) {
      if (res.error.indexOf("Server terminated early with status 1") > -1) {
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
  console.log("******* result ", results);
  await writeResults(config, {
    framework: framework,
    benchmark: benchmarkInfo,
    results: results,
    type: BenchmarkType.STARTUP
  });
  return { errors, warnings };
  // } else {
  //     return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
}

async function runBenchmakLoop(
  framework: FrameworkData,
  benchmarkInfo: CPUBenchmarkInfo|MemBenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<{ errors: String[]; warnings: String[] }> {
  let warnings: String[] = [];
  let errors: String[] = [];

  let results: Array<number> = [];
  let count = 0;

  if (benchmarkInfo.type == BenchmarkType.CPU) {
    count = benchmarkOptions.numIterationsForCPUBenchmarks;
    // FIXME
    benchmarkOptions.batchSize = config.ALLOW_BATCHING && benchmarkInfo.allowBatching ? count : 1;
  } else if (benchmarkInfo.type == BenchmarkType.MEM) {
    count = benchmarkOptions.numIterationsForMemBenchmarks;
    benchmarkOptions.batchSize = 1;
  }

  let retries = 0;

  console.log("runBenchmakLoop", framework, benchmarkInfo);

  while (results.length < count) {
    benchmarkOptions.batchSize = Math.min(benchmarkOptions.batchSize, count - results.length);
    console.log("FORKING: ", benchmarkInfo.id, " BatchSize ", benchmarkOptions.batchSize);
    let res = await forkAndCallBenchmark(framework, benchmarkInfo, benchmarkOptions);
    if (Array.isArray(res.result)) {
      results = results.concat(res.result as number[]);
    } else results.push(res.result);
    warnings = warnings.concat(res.warnings);
    if (res.error) {
      if (res.error.indexOf("Server terminated early with status 1") > -1) {
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
    console.log("CPU results before: ", results);
    (results as number[]).sort((a: number, b: number) => a - b);
    results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU);
    // console.log("CPU results after: ", results)
  }

  console.log("******* result ", results);
  await writeResults(config, {
    framework: framework,
    benchmark: benchmarkInfo,
    results: results,
    type: benchmarkInfo.type as typeof BenchmarkType.CPU|BenchmarkType.MEM
  });
  return { errors, warnings };
  // } else {
  //     return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
}

async function runBench(runFrameworks: FrameworkData[], benchmarkInfos: BenchmarkInfo[]) {
  let errors: String[] = [];
  let warnings: String[] = [];

  let restart: string = undefined;
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

    console.log("HEADLESS*** ", args.headless);

  let benchmarkOptions: BenchmarkOptions = {
    port: config.PORT.toFixed(),
    HOST: config.HOST,
    remoteDebuggingPort: config.REMOTE_DEBUGGING_PORT,
    chromePort: config.CHROME_PORT,
    headless: args.headless,
    chromeBinaryPath: args.chromeBinary,
    numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
    numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
    numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
    batchSize: 1,
  };

  console.log("benchmarkOptions", benchmarkOptions);

  for (let i = 0; i < runFrameworks.length; i++) {
    for (let j = 0; j < benchmarkInfos.length; j++) {
      try {
        let result;

        if (benchmarkInfos[j].type == BenchmarkType.STARTUP_MAIN) {
          result = await runBenchmakLoopStartup(runFrameworks[i], benchmarkInfos[j] as StartupBenchmarkInfo, benchmarkOptions)
        } else if (benchmarkInfos[j].type == BenchmarkType.CPU) {
          result = await runBenchmakLoop(runFrameworks[i], benchmarkInfos[j] as CPUBenchmarkInfo, benchmarkOptions);
        } else {
          result = await runBenchmakLoop(runFrameworks[i], benchmarkInfos[j] as MemBenchmarkInfo, benchmarkOptions);
        }
        errors = errors.concat(result.errors);
        warnings = warnings.concat(result.warnings);
      } catch (e) {
        console.log("UNHANDELED ERROR", e);
        errors.push(e);
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

// FIXME: Clean up args.
// What works: npm run bench keyed/react, npm run bench -- keyed/react, npm run bench -- keyed/react --count 1 --benchmark 01_
// What doesn't work (keyed/react becomes an element of argument benchmark): npm run bench -- --count 1 --benchmark 01_ keyed/react

let args: any = yargs(process.argv)
  .usage(
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
  )
  .help("help")
  .boolean("headless").default("headless", false)
  .boolean("smoketest")
  .string("runner").default("runner",config.BENCHMARK_RUNNER)
  .array("framework")
  .array("benchmark")
  .string("chromeBinary").argv;

let runner = args.runner;
if ([BENCHMARK_RUNNER.WEBDRIVER_CDP,BENCHMARK_RUNNER.WEBDRIVER,BENCHMARK_RUNNER.PLAYWRIGHT,BENCHMARK_RUNNER.PUPPETEER].includes(runner)) {
  console.log(`INFO: Using ${runner} benchmark runner`)
  config.BENCHMARK_RUNNER = runner;
} else {
  console.log("ERROR: argument driver has illegal value "+runner, [BENCHMARK_RUNNER.WEBDRIVER_CDP,BENCHMARK_RUNNER.WEBDRIVER,BENCHMARK_RUNNER.PLAYWRIGHT,BENCHMARK_RUNNER.PUPPETEER]);
  process.exit(1);
}

let allArgs = args._.length <= 2 ? [] : args._.slice(2, args._.length);
let frameworkArgument = !args.framework ? allArgs : args.framework;
console.log("args", args, "allArgs", allArgs);

if (process.env.HOST) {
  config.HOST = process.env.HOST;
  console.log(`INFO: Using host ${config.HOST} instead of localhost`);
}

async function main() {
  let runBenchmarksArgs: string[] =  (args.benchmark && args.benchmark.length > 0) ? args.benchmark : [""];
  let runBenchmarks: Array<BenchmarkInfo> = benchmarkInfos.filter((b) =>
    runBenchmarksArgs.some((name) => b.id.toLowerCase().indexOf(name) > -1)
  );
  
  
  let runFrameworks: FrameworkData[];
  let matchesDirectoryArg = (directoryName: string) =>
    frameworkArgument.length == 0 || frameworkArgument.some((arg: string) => arg == directoryName);
  runFrameworks = await initializeFrameworks(matchesDirectoryArg);

  console.log("ARGS.smotest", args.smoketest)
  if (args.smoketest) {
    config.WRITE_RESULTS = false;
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU = 1;
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT = 0;
    config.NUM_ITERATIONS_FOR_BENCHMARK_MEM = 1;
    config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP = 1;
    config.EXIT_ON_ERROR = true;
    console.log('Using smoketest config ', JSON.stringify(config));
  }
    
  if (!fs.existsSync(config.RESULTS_DIRECTORY)) fs.mkdirSync(config.RESULTS_DIRECTORY);
  if (!fs.existsSync(config.TRACES_DIRECTORY)) fs.mkdirSync(config.TRACES_DIRECTORY);

  if (args.help) {
    yargs.showHelp();
  } else {
    return runBench(runFrameworks, runBenchmarks);
  }
}

main()
  .then((_) => {
    console.log("successful run");
    process.exit(0);
  })
  .catch((error) => {
    console.log("run was not completely sucessful", error);
    process.exit(1);
  });