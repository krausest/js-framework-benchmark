import * as fs from "fs";
import { result } from "lodash";
import { BenchmarkInfo, BenchmarkType, fileName } from "./benchmarksCommon";
import { BenchmarkLighthouse, StartupBenchmarkResult, subbenchmarks } from "./benchmarksLighthouse";
import { TBenchmarkPuppeteer } from "./benchmarksPuppeteer";
import { CPUBenchmarkWebdriver } from "./benchmarksWebdriver";
import { config as defaultConfig, FrameworkData, JSONResult } from "./common";
const jStat = require("jstat").jStat;

export type ResultLightHouse = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: StartupBenchmarkResult[];
  type: BenchmarkType.STARTUP; 
}

export type ResultCPUOrMem = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: number[];
  type: BenchmarkType.MEM | BenchmarkType.CPU; 
}

export function writeResults(config: typeof defaultConfig, res: ResultLightHouse|ResultCPUOrMem) {
  if (!config.WRITE_RESULTS) return;

  if (res.type==BenchmarkType.STARTUP) {
    for (let subbench of subbenchmarks) {
      let results = res.results.filter(r => r.benchmark.id == subbench.id).map(r => r.result);
      createResultFile(config, results, res.framework, subbench);
    }
  } else {
    createResultFile(config, (res.results as any) as number[], res.framework, res.benchmark);
  }
}

function createResultFile(config: typeof defaultConfig, data: number[], framework: FrameworkData, benchmark: BenchmarkInfo) {
  let s = jStat(data);
  console.log(
    `result ${fileName(framework, benchmark)} min ${s.min()} max ${s.max()} mean ${s.mean()} median ${s.median()} stddev ${s.stdev(
      true
    )}`
  );
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
  let result: JSONResult = {
    framework: framework.fullNameWithKeyedAndVersion,
    keyed: framework.keyed,
    benchmark: benchmark.id,
    type: type,
    min: s.min(),
    max: s.max(),
    mean: s.mean(),
    median: s.median(),
    geometricMean: s.geomean(),
    standardDeviation: s.stdev(true),
    values: data,
  };
  fs.writeFileSync(`${config.RESULTS_DIRECTORY}/${fileName(framework, benchmark)}`, JSON.stringify(result), { encoding: "utf8" });
}
