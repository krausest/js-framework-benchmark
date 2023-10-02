import * as fs from "node:fs";
import {
  BenchmarkInfo,
  BenchmarkType,
  CPUBenchmarkResult,
  fileName,
} from "./benchmarksCommon.js";
import {
  StartupBenchmarkResult,
  subbenchmarks,
} from "./benchmarksLighthouse.js";
import { FrameworkData, JSONResult, JSONResultData } from "./common.js";
import { jStat } from "jstat";

export type ResultLightHouse = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: StartupBenchmarkResult[];
  type: BenchmarkType.STARTUP;
};

export type ResultCPU = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: CPUBenchmarkResult[];
  type: BenchmarkType.CPU;
};

export type ResultMem = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: number[];
  type: BenchmarkType.MEM;
};

export function writeResults(
  resultDir: string,
  res: ResultLightHouse | ResultCPU | ResultMem,
) {
  switch (res.type) {
    case BenchmarkType.STARTUP:
      for (let subbench of subbenchmarks) {
        let results = res.results
          .filter((r) => r.benchmark.id == subbench.id)
          .map((r) => r.result);
        createResultFile(resultDir, results, res.framework, subbench);
      }
      break;
    case BenchmarkType.CPU:
      createResultFile(
        resultDir,
        {
          total: res.results.map((r) => r.total),
          script: res.results.map((r) => r.script),
        },
        res.framework,
        res.benchmark,
      );
      break;
    case BenchmarkType.MEM:
      createResultFile(
        resultDir,
        res.results as any as number[],
        res.framework,
        res.benchmark,
      );
      break;
  }
}

function createResultFile(
  resultDir: string,
  data: number[] | { [key: string]: number[] },
  framework: FrameworkData,
  benchmark: BenchmarkInfo,
) {
  let type = "";
  switch (benchmark.type) {
    case BenchmarkType.CPU:
      type = "cpu";
      break;
    case BenchmarkType.MEM:
      type = "memory";
      break;
    case BenchmarkType.STARTUP:
      type = "startup";
      break;
  }
  let convertResult = (label: string, data: number[]) => {
    let s = jStat(data);
    let res = {
      min: s.min(),
      max: s.max(),
      mean: s.mean(),
      median: s.median(),
      stddev: s.stdev(true),
      values: data,
    };
    console.log(
      `result ${fileName(framework, benchmark)} ${label} ${JSON.stringify(
        res,
      )}`,
    );
    return res;
  };
  if (Array.isArray(data)) {
    let result: JSONResult = {
      framework: framework.fullNameWithKeyedAndVersion,
      keyed: framework.keyed,
      benchmark: benchmark.id,
      type: type,
      values: { DEFAULT: convertResult("", data as number[]) },
    };
    fs.writeFileSync(
      `${resultDir}/${fileName(framework, benchmark)}`,
      JSON.stringify(result),
      { encoding: "utf8" },
    );
  } else {
    let values: { [k: string]: JSONResultData } = {};
    for (let key of Object.keys(data)) {
      values[key] = convertResult(key, data[key]);
    }
    let result: JSONResult = {
      framework: framework.fullNameWithKeyedAndVersion,
      keyed: framework.keyed,
      benchmark: benchmark.id,
      type: type,
      values,
    };
    fs.writeFileSync(
      `${resultDir}/${fileName(framework, benchmark)}`,
      JSON.stringify(result),
      { encoding: "utf8" },
    );
  }
}
