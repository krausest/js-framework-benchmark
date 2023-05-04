import * as fs from "fs";
import yargs from "yargs";
import { BenchmarkInfo, benchmarkInfos, BenchmarkType, fileName, slowDownFactor } from "./benchmarksCommon.js";
import { subbenchmarks } from "./benchmarksLighthouse.js";
import { BenchmarkOptions, config, initializeFrameworks, JSONResult, JSONResultData } from "./common.js";

let args: any = yargs(process.argv)
  .usage(
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
  )
  .help("help")
  .string("runner").default("runner","puppeteer")
  .string("browser")
  .argv;

console.log("args", args);

let benchmarkOptions: BenchmarkOptions = {
  port: 8080,
  host: 'localhost',
  browser: args.browser,
  remoteDebuggingPort: 9999,
  chromePort: 9998,
  headless: args.headless,
  chromeBinaryPath: args.chromeBinary,
  numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  batchSize: 1,
  resultsDirectory: "results",
  tracesDirectory: "traces",
  allowThrottling: !args.nothrottling
};

let resultsDirectory = args.browser ? "./results_client_"+args.browser : "./results";

async function main() {
  let frameworks = await initializeFrameworks(benchmarkOptions);

  let results: Map<string, Map<string, JSONResult>> = new Map();

  let resultJS = "import {RawResult} from './Common';\n\nexport const results: RawResult[]=[";

  let allBenchmarks: Array<BenchmarkInfo> = [];
  let jsonResult: { framework: string; benchmark: string; values: {[key:string]: number[]} }[] = [];
  
  benchmarkInfos.forEach((benchmarkInfo, bIdx) => {
    if (args.browser) {
      if (benchmarkInfo.type == BenchmarkType.CPU) {
        allBenchmarks.push(benchmarkInfo);
      }
    } else {
      if (benchmarkInfo.type == BenchmarkType.STARTUP_MAIN) {
        allBenchmarks = allBenchmarks.concat( subbenchmarks);
      } else {
        allBenchmarks.push(benchmarkInfo);
      }
    }
  });
  
  frameworks.forEach((framework, fIdx) => {
    allBenchmarks.forEach((benchmarkInfo) => {
      if (!args.browser || framework.keyed) {
        let name = `${fileName(framework, benchmarkInfo)}`;
        let file = `${resultsDirectory}/${name}`;
        if (fs.existsSync(file)) {
          let data: JSONResult = JSON.parse(
            fs.readFileSync(file, {
              encoding: "utf-8",
            })
          );

          let values: {[k: string]: number[]} = {};
          for (let key of Object.keys(data.values)) {
            let vals = data.values[key].values.filter((v) => v != null);
            values[key] = vals;
            if (vals.some((v) => v == null))
              console.log(`Found null value for ${framework.fullNameWithKeyedAndVersion} and benchmark ${benchmarkInfo.id}`);
            if (benchmarkInfo.type === BenchmarkType.CPU && vals.length != config.NUM_ITERATIONS_FOR_BENCHMARK_CPU) {
              console.log(
                `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${vals.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_CPU}`
              );
            } else if (benchmarkInfo.type === BenchmarkType.MEM && vals.length != config.NUM_ITERATIONS_FOR_BENCHMARK_MEM) {
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
            }
          }  
          console.log("values=", values);
          let result: any = {
            f: data.framework,
            b: data.benchmark,
            v: values,
          };
          let resultNice = {
            framework: data.framework,
            benchmark: data.benchmark,
            values: values,
          };

          resultJS += "\n" + JSON.stringify(result) + ",";
          jsonResult.push(resultNice);
        } else {
          console.log("MISSING FILE", file);
        }
      }
    });
  });

  resultJS += "];\n";
  resultJS +=
    "export const frameworks = " +
    JSON.stringify(
      frameworks.map((f) =>
          ({
              name: f.fullNameWithKeyedAndVersion,
              dir: (f.keyed ? "keyed/" : "non-keyed/" ) + f.name,
              keyed: f.keyed,
              issues: f.issues && f.issues.length > 0 ? f.issues : undefined,
              frameworkHomeURL: f.frameworkHomeURL ?? ""
          })
      )
    ) +
    ";\n";
  let formattedBenchmarks = allBenchmarks.map(b => ({id:b.id, label: b.label, description: b.description(slowDownFactor(b.id, true)), type:b.type}));
  resultJS += "export const benchmarks = " + JSON.stringify(formattedBenchmarks) + ";\n";

  fs.writeFileSync("../webdriver-ts-results/src/results.ts", resultJS, {
    encoding: "utf-8",
  });
  fs.writeFileSync("./results.json", JSON.stringify(jsonResult), {
    encoding: "utf-8",
  });
}

main().catch((e) => {
  console.log("error processing results", e);
  process.exit(1);
});
