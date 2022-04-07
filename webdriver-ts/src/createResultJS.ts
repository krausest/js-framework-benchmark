import * as _ from "lodash";
import * as fs from "fs";
import { JSONResult, config, FrameworkData, initializeFrameworks } from "./common";
import * as yargs from "yargs";
import { BenchmarkInfo, BenchmarkType, fileName } from "./benchmarksCommon";
import { BenchmarkPuppeteer } from "./benchmarksPuppeteer";
import { BenchmarkWebdriver } from "./benchmarksWebdriver";
import {benchmarks} from "./benchmarkConfiguration";

async function main() {
  let frameworks = await initializeFrameworks();

  let results: Map<string, Map<string, JSONResult>> = new Map();

  let resultJS = "import {RawResult} from './Common';\n\nexport const results: RawResult[]=[";

  let allBenchmarks: BenchmarkInfo[] = [];

  let jsonResult: { framework: string; benchmark: string; values: number[] }[] = [];

  benchmarks.forEach((benchmark, bIdx) => {
    let r = benchmark.resultKinds ? benchmark.resultKinds() : [benchmark];
    r.forEach((benchmarkInfo) => {
      allBenchmarks.push(benchmarkInfo);
    });
  });

  frameworks.forEach((framework, fIdx) => {
    allBenchmarks.forEach((benchmarkInfo) => {
      let name = `${fileName(framework, benchmarkInfo)}`;
      let file = "./results/" + name;
      if (fs.existsSync(file)) {
        let data: JSONResult = JSON.parse(
          fs.readFileSync(file, {
            encoding: "utf-8",
          })
        );
        if (data.values.some((v) => v == null))
          console.log(`Found null value for ${framework.fullNameWithKeyedAndVersion} and benchmark ${benchmarkInfo.id}`);
        let result: any = {
          f: data.framework,
          b: data.benchmark,
          v: data.values.filter((v) => v != null),
        };
        let resultNice = {
          framework: data.framework,
          benchmark: data.benchmark,
          values: data.values.filter((v) => v != null),
        };
        resultJS += "\n" + JSON.stringify(result) + ",";
        jsonResult.push(resultNice);
        if (benchmarkInfo.type === BenchmarkType.CPU && resultNice.values.length != config.NUM_ITERATIONS_FOR_BENCHMARK_CPU) {
          console.log(
            `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${resultNice.values.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_CPU}`
          );
        } else if (benchmarkInfo.type === BenchmarkType.MEM && resultNice.values.length != config.NUM_ITERATIONS_FOR_BENCHMARK_MEM) {
          console.log(
            `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${resultNice.values.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_MEM}`
          );
        } else if (
          benchmarkInfo.type === BenchmarkType.STARTUP &&
          resultNice.values.length != config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP
        ) {
          console.log(
            `WARNING: for ${framework.uri} and benchmark ${benchmarkInfo.id} count was ${resultNice.values.length}. We expected ${config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP}`
          );
        }
      } else {
        console.log("MISSING FILE", file);
      }
    });
  });

  resultJS += "];\n";
  resultJS +=
    "export const frameworks = " +
    JSON.stringify(
      frameworks.map((f) =>
        f.issues && f.issues.length > 0
          ? {
              name: f.fullNameWithKeyedAndVersion,
              keyed: f.keyed,
              issues: f.issues,
            }
          : { name: f.fullNameWithKeyedAndVersion, keyed: f.keyed }
      )
    ) +
    ";\n";
  resultJS += "export const benchmarks = " + JSON.stringify(allBenchmarks) + ";\n";

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
