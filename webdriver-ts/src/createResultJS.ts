import * as fs from "node:fs";
import yargs from "yargs";
import {
  BenchmarkInfo,
  benchmarkInfos,
  BenchmarkType,
  fileName,
  slowDownFactor,
  slowDownNote,
  warmupNote,
} from "./benchmarksCommon.js";
import * as benchmarksLighthouse from "./benchmarksLighthouse.js";
import * as benchmarksSize from "./benchmarksSize.js";
import { BenchmarkOptions, config, initializeFrameworks, JsonResult } from "./common.js";

let args: any = yargs(process.argv)
  .usage(
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
  )
  .help("help")
  .string("runner")
  .default("runner", "puppeteer")
  .string("browser").argv;

console.log("args", args);

let benchmarkOptions: BenchmarkOptions = {
  port: 8080,
  host: "localhost",
  browser: args.browser,
  remoteDebuggingPort: 9999,
  chromePort: 9998,
  headless: args.headless,
  chromeBinaryPath: args.chromeBinary,
  numIterationsForCPUBenchmarks:
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU +
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  numIterationsForSizeBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_SIZE,
  batchSize: 1,
  resultsDirectory: "results",
  tracesDirectory: "traces",
  allowThrottling: !args.nothrottling,
};

let resultsDirectory = args.browser ? "./results_client_" + args.browser : "./results";

async function main() {
  let frameworks = await initializeFrameworks(benchmarkOptions);

  let resultJS = "import {RawResult} from './Common';\n\nexport const results: RawResult[]=[";

  let allBenchmarks: Array<BenchmarkInfo> = [];
  let jsonResult: { framework: string; benchmark: string; values: { [key: string]: number[] } }[] =
    [];

  benchmarkInfos.forEach((benchmarkInfo) => {
    if (args.browser) {
      if (benchmarkInfo.type == BenchmarkType.CPU) {
        allBenchmarks.push(benchmarkInfo);
      }
    } else {
      // if (benchmarkInfo.type == BenchmarkType.STARTUP_MAIN) {
      //   allBenchmarks = allBenchmarks.concat(benchmarksLighthouse.subbenchmarks);
      // } else 
      if (benchmarkInfo.type == BenchmarkType.SIZE_MAIN) {
        allBenchmarks = allBenchmarks.concat(benchmarksSize.subbenchmarks);
      } else {
        allBenchmarks.push(benchmarkInfo);
      }
    }
  });

  frameworks.forEach((framework,idx) => {
    let result: any = {
      f: idx,
      b: []
    };
  allBenchmarks.forEach((benchmarkInfo) => {
      if (!args.browser || framework.keyed) {
        let name = `${fileName(framework, benchmarkInfo)}`;
        let file = `${resultsDirectory}/${name}`;
        if (fs.existsSync(file)) {
          let data: JsonResult = JSON.parse(
            fs.readFileSync(file, {
              encoding: "utf8",
            })
          );

          let values: { [k: string]: number[] } = {};
          for (let key of Object.keys(data.values)) {
            let vals = data.values[key].values.filter((v) => v != null);
            values[key] = vals;
            if (vals.some((v) => v == null)) {
              console.log(`Found null value for ${framework.fullNameWithKeyedAndVersion} and benchmark ${benchmarkInfo.id}`);
            }
            if (
              benchmarkInfo.type === BenchmarkType.CPU &&
              vals.length !=
                config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + benchmarkInfo.additionalNumberOfRuns
            ) {
              console.log(`WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${vals.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + benchmarkInfo.additionalNumberOfRuns}`);
            } else if (
              benchmarkInfo.type === BenchmarkType.MEM &&
              vals.length != config.NUM_ITERATIONS_FOR_BENCHMARK_MEM
            ) {
              console.log(
                `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${vals.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_MEM}`
              );
            } else if (
              benchmarkInfo.type === BenchmarkType.STARTUP &&
              vals.length != config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP
            ) {
              console.log(
                `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${vals.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP}`
              );
            } else if (
              benchmarkInfo.type === BenchmarkType.SIZE &&
              vals.length != config.NUM_ITERATIONS_FOR_BENCHMARK_SIZE
            ) {
              console.log(
                `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${vals.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_SIZE}`
              );
            }
          }
          result.b.push({
              b: allBenchmarks.findIndex((b) => b.id== data.benchmark),
              v: values,
            });
          let resultNice = {
            framework: data.framework,
            benchmark: data.benchmark,
            values: values,
          };

          jsonResult.push(resultNice);
        } else {
          console.log("MISSING FILE", file);
        }
      }
    });
    resultJS += "\n" + JSON.stringify(result, function(key, val) {
      return val.toFixed ? Number(val.toFixed(1)) : val;
    }) + ",";
  });

  resultJS += "];\n";
  resultJS +=
    "export const frameworks = " +
    JSON.stringify(
      frameworks.map((f) => ({
        name: f.fullNameWithKeyedAndVersion,
        dir: (f.keyed ? "keyed/" : "non-keyed/") + f.name,
        keyed: f.keyed,
        issues: f.issues && f.issues.length > 0 ? f.issues : undefined,
        frameworkHomeURL: f.frameworkHomeURL ?? "",
      }))
    ) +
    ";\n";
  let formattedBenchmarks = allBenchmarks.map((b) => ({
    id: b.id,
    label: b.label,
    description: b.description + warmupNote(b) + slowDownNote(slowDownFactor(b.id, true)),
    type: b.type,
  }));
  resultJS += "export const benchmarks = " + JSON.stringify(formattedBenchmarks) + ";\n";

  fs.writeFileSync("../webdriver-ts-results/src/results.ts", resultJS, {
    encoding: "utf8",
  });
  fs.writeFileSync("./results.json", JSON.stringify(jsonResult), {
    encoding: "utf8",
  });
}

main().catch((error) => {
  console.log("error processing results", error);
  process.exit(1);
});
