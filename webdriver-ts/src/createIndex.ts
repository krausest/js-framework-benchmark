import * as fs from "fs";
import { BenchmarkOptions, JSONResult, config, initializeFrameworks } from "./common.js";
import * as dot from "dot";

let benchmarkOptions: BenchmarkOptions = {
  port: 8080,
  host: 'localhost',
  browser: 'chrome',
  remoteDebuggingPort: 9999,
  chromePort: 9998,
  headless: true,
  chromeBinaryPath: undefined,
  numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  batchSize: 1,
  resultsDirectory: "results",
  tracesDirectory: "traces",
  allowThrottling: false
};

async function main() {
  let frameworks = await initializeFrameworks(benchmarkOptions);

  frameworks.sort((a, b) =>
    a.fullNameWithKeyedAndVersion.localeCompare(b.fullNameWithKeyedAndVersion)
  );

  const dots = dot.process({
    path: "./",
  });

  fs.writeFileSync(
    "../index.html",
    dots.index({
      frameworks,
    }),
    {
      encoding: "utf8",
    }
  );
}

main().catch(err => {console.log("Error in createIndex", err)});
