import * as fs from "fs";
import { BenchmarkOptions, config, initializeFrameworks } from "./common.js";
import ejs from "ejs";

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

  const templateFilePath = "./index.ejs";
  const templateContent = fs.readFileSync(templateFilePath, "utf8");

  const renderedContent = ejs.render(templateContent, {
    frameworks: frameworks,
  });

  const minifiedContent = renderedContent
    .replace(/\n/g, "")
    .replace(/\s+/g, " ")
    .replace(/(<[^>]*>)\s+/g, "$1")
    .replace(/\s*>\s*/g, ">"); // Removes line wraps and spaces

  fs.writeFileSync("../index.html", minifiedContent, {
    encoding: "utf8",
  });
}

main().catch(err => {console.log("Error in createIndex", err)});
