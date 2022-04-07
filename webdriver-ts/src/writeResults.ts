import * as fs from "fs";
import { BenchmarkType, fileName } from "./benchmarksCommon";
import { BenchmarkPuppeteer } from "./benchmarksPuppeteer";
import { BenchmarkWebdriver } from "./benchmarksWebdriver";
import { config as defaultConfig, FrameworkData, JSONResult } from "./common";
const jStat = require("jstat").jStat;

export interface Result<T> {
  framework: FrameworkData;
  results: T[];
  benchmark: BenchmarkPuppeteer | BenchmarkWebdriver;
}

export function writeResults<T>(config: typeof defaultConfig, res: Result<T>) {
  if (!config.WRITE_RESULTS) return;
  let benchmark = res.benchmark;
  let framework = res.framework.name;
  let keyed = res.framework.keyed;
  let type = null;

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

  for (let resultKind of benchmark.resultKinds()) {
    let data = benchmark.extractResult(res.results, resultKind);
    let s = jStat(data);
    console.log(
      `result ${fileName(res.framework, resultKind)} min ${s.min()} max ${s.max()} mean ${s.mean()} median ${s.median()} stddev ${s.stdev(
        true
      )}`
    );
    let result: JSONResult = {
      framework: res.framework.fullNameWithKeyedAndVersion,
      keyed: keyed,
      benchmark: resultKind.id,
      type: type,
      min: s.min(),
      max: s.max(),
      mean: s.mean(),
      median: s.median(),
      geometricMean: s.geomean(),
      standardDeviation: s.stdev(true),
      values: data,
    };
    fs.writeFileSync(`${config.RESULTS_DIRECTORY}/${fileName(res.framework, resultKind)}`, JSON.stringify(result), { encoding: "utf8" });
  }
}
