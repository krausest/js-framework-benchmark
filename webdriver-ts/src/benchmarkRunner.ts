import { fork } from "child_process";
import * as fs from "fs";
import * as yargs from "yargs";
import { BenchmarkInfo, BenchmarkType } from "./benchmarksGeneric";
import { BenchmarkPuppeteer, benchmarksPuppeteer } from "./benchmarksPuppeteer";
import { benchmarksWebdriver, BenchmarkWebdriver, LighthouseData } from "./benchmarksWebdriver";
import { BenchmarkOptions, config, ErrorAndWarning, FrameworkData, initializeFrameworks } from "./common";
import { writeResults } from "./writeResults";

function forkAndCallBenchmark(
  framework: FrameworkData,
  benchmark: BenchmarkInfo,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning> {
  return new Promise((resolve, reject) => {
    const forked = fork(
      benchmark.type == BenchmarkType.MEM ? "src/forkedBenchmarkRunnerPuppeteer.ts" : "src/forkedBenchmarkRunnerWebdriver.ts"
    );
    if (config.LOG_DETAILS) console.log("FORKING:  forked child process");
    forked.send({
      config,
      framework,
      benchmarkId: benchmark.id,
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

async function runBenchmakLoop(
  framework: FrameworkData,
  benchmark: BenchmarkWebdriver | BenchmarkPuppeteer,
  benchmarkOptions: BenchmarkOptions
): Promise<{ errors: String[]; warnings: String[] }> {
  if (config.FORK_CHROMEDRIVER) {
    let warnings: String[] = [];
    let errors: String[] = [];

    let results: Array<number | LighthouseData> = [];
    let count = 0;

    if (benchmark.type == BenchmarkType.CPU) {
      count = benchmarkOptions.numIterationsForCPUBenchmarks;
      benchmarkOptions.batchSize = config.ALLOW_BATCHING && benchmark.allowBatching ? count : 1;
    } else if (benchmark.type == BenchmarkType.MEM) {
      count = benchmarkOptions.numIterationsForMemBenchmarks;
      benchmarkOptions.batchSize = 1;
    } else {
      count = benchmarkOptions.numIterationsForStartupBenchmark;
      benchmarkOptions.batchSize = 1;
    }

    let retries = 0;

    while (results.length < count) {
      benchmarkOptions.batchSize = Math.min(benchmarkOptions.batchSize, count - results.length);
      console.log("FORKING: ", benchmark.id, " BatchSize ", benchmarkOptions.batchSize);
      let res = await forkAndCallBenchmark(framework, benchmark, benchmarkOptions);
      if (res.result) {
        if (Array.isArray(res.result)) {
          results = results.concat(res.result);
        } else results.push(res.result);
      }
      warnings = warnings.concat(res.warnings);
      if (res.error) {
        if (res.error.indexOf("Server terminated early with status 1") > -1) {
          console.log("******* STRANGE selenium error found - retry #", retries + 1);
          retries++;
          if (retries == 3) break;
        } else {
          errors.push(`Executing ${framework.uri} and benchmark ${benchmark.id} failed: ` + res.error);
          break;
        }
      }
    }
    if (benchmark.type == BenchmarkType.CPU) {
      // console.log("CPU results before: ", results);
      (results as number[]).sort((a: number, b: number) => a - b);
      results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU);
      // console.log("CPU results after: ", results)
    }

    console.log("******* result ", results);
    await writeResults(config, {
      framework: framework,
      benchmark: benchmark,
      results: results,
    });
    return { errors, warnings };
    // } else {
    //     return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
  }
}

async function runBench(runFrameworks: FrameworkData[], benchmarkNames: string[]) {
  let errors: String[] = [];
  let warnings: String[] = [];

  let b1: Array<BenchmarkWebdriver | BenchmarkPuppeteer> = benchmarksWebdriver.filter((b) =>
    benchmarkNames.some((name) => b.id.toLowerCase().indexOf(name) > -1)
  );
  let b2: Array<BenchmarkWebdriver | BenchmarkPuppeteer> = benchmarksPuppeteer.filter((b) =>
    benchmarkNames.some((name) => b.id.toLowerCase().indexOf(name) > -1)
  );
  let runBenchmarks: Array<BenchmarkWebdriver | BenchmarkPuppeteer> = b1.concat(b2);

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
    runBenchmarks.map((b) => b.id)
  );

  let benchmarkOptions: BenchmarkOptions = {
    port: config.PORT.toFixed(),
    remoteDebuggingPort: config.REMOTE_DEBUGGING_PORT,
    chromePort: config.CHROME_PORT,
    headless: args.headless,
    chromeBinaryPath: args.chromeBinary,
    numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
    numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
    numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
    batchSize: 1,
  };

  for (let i = 0; i < runFrameworks.length; i++) {
    for (let j = 0; j < runBenchmarks.length; j++) {
      try {
        let result = await runBenchmakLoop(runFrameworks[i], runBenchmarks[j], benchmarkOptions);
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
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--count n] [--exitOnError] \n or: $0 [directory1] [directory2] .. [directory3] \n or: $0 installed"
  )
  .help("help")
  .default("headless", false)
  .array("framework")
  .array("benchmark").argv;

let allArgs = args._.length <= 2 ? [] : args._.slice(2, args._.length);
let frameworkArgument = !args.framework ? allArgs : args.framework;
console.log("args", args, "allArgs", allArgs);

async function main() {
  let runBenchmarks = (args.benchmark && args.benchmark.length > 0 ? args.benchmark : [""]).map((v: string) => v.toString());
  let runFrameworks: FrameworkData[];

  let matchesDirectoryArg = (directoryName: string) =>
    frameworkArgument.length == 0 || frameworkArgument.some((arg: string) => arg == directoryName);
  runFrameworks = await initializeFrameworks(matchesDirectoryArg);

  config.WRITE_RESULTS = !args.noResults;

  console.log(args, "no-results", args.noResults, config.WRITE_RESULTS);

  let exitOnError = args.exitOnError === "true";

  config.EXIT_ON_ERROR = exitOnError;

  if (!fs.existsSync(config.RESULTS_DIRECTORY)) fs.mkdirSync(config.RESULTS_DIRECTORY);

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
