import *  as chromeLauncher from "chrome-launcher";

import { TConfig, config as defaultConfig, FrameworkData, ErrorAndWarning, BenchmarkOptions } from "./common.js";
import { BenchmarkLighthouse, StartupBenchmarkResult, benchmarks } from "./benchmarksLighthouse.js";
import { StartupBenchmarkInfo } from "./benchmarksCommon.js";
import lighthouse from "lighthouse";

let config: TConfig = defaultConfig;

function extractRawValue(results: any, id: string) {
  let audits = results.audits;
  if (!audits) return null;
  let audit_with_id = audits[id];
  if (typeof audit_with_id === "undefined") return null;
  if (typeof audit_with_id.numericValue === "undefined") return null;
  return audit_with_id.numericValue;
}

async function runLighthouse(framework: FrameworkData, startupBenchmarks: StartupBenchmarkInfo[], benchmarkOptions: BenchmarkOptions): Promise<StartupBenchmarkResult[]> {
  const opts: any = {
    chromeFlags: [
      "--headless",
      "--no-sandbox",
      "--no-first-run",
      "--enable-automation",
      "--disable-infobars",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-cache",
      "--disable-translate",
      "--disable-sync",
      "--disable-extensions",
      "--disable-default-apps",
      "--window-size=1200,800",
      "--remote-debugging-port=" + benchmarkOptions.remoteDebuggingPort.toFixed(),
    ],
    onlyCategories: ["performance"],
    port: benchmarkOptions.remoteDebuggingPort.toFixed(),
    logLevel: "info",
  };

  try {
    if (benchmarkOptions.chromeBinaryPath) opts.chromePath = benchmarkOptions.chromeBinaryPath;
    let chrome = await chromeLauncher.launch(opts);
    let results: any = null;
    try {
      results = await (lighthouse as any)(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`, opts, null);
      await chrome.kill();
    } catch (error) {
      console.log("error running lighthouse", error);
      await chrome.kill();
      throw error;
    }
    if (config.LOG_DEBUG) console.log("lighthouse result", results);

    return startupBenchmarks.map(bench => {
      return {benchmark: bench, result: bench.fn(extractRawValue(results.lhr, bench.property))} as StartupBenchmarkResult;
    });
  } catch (error) {
    console.log("error running lighthouse", error);
    throw error;
  }
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

async function runStartupBenchmark(
  framework: FrameworkData,
  benchmark: BenchmarkLighthouse,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning<StartupBenchmarkResult>> {
  console.log("benchmarking startup", framework, benchmark.benchmarkInfo.id);

  let error: string = undefined;
  try {
    let result = await runLighthouse(framework, benchmark.subbenchmarks, benchmarkOptions);
    return { error, warnings: [], result };
  } catch (e) {
    error = convertError(e);
    return { error, warnings: [] };
  }
}

export async function executeBenchmark(
  framework: FrameworkData,
  benchmarkId: string,
  benchmarkOptions: BenchmarkOptions
): Promise<ErrorAndWarning<StartupBenchmarkResult>> {
  let runBenchmarks: Array<BenchmarkLighthouse> = benchmarks.filter(b => benchmarkId === b.benchmarkInfo.id && b instanceof BenchmarkLighthouse) as Array<BenchmarkLighthouse>;
  if (runBenchmarks.length != 1) throw `Benchmark name ${benchmarkId} is not unique (lighthouse)`;

  let benchmark = runBenchmarks[0];

  let errorAndWarnings: ErrorAndWarning<StartupBenchmarkResult>;
    errorAndWarnings = await runStartupBenchmark(framework, benchmark, benchmarkOptions);
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
  executeBenchmark(framework, benchmarkId, benchmarkOptions)
    .then((result) => {
      process.send(result);
      process.exit(0);
    })
    .catch((err) => {
      console.log("CATCH: Error in forkedBenchmarkRunnerLighthouse");
      process.send({ failure: convertError(err) });
      process.exit(0);
    });
});
