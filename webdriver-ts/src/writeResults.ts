import * as fs from "fs";
import { result } from "lodash";
import { BenchmarkInfo, BenchmarkType, CPUBenchmarkResult, fileName } from "./benchmarksCommon.js";
import { BenchmarkLighthouse, StartupBenchmarkResult, subbenchmarks } from "./benchmarksLighthouse.js";
import { TBenchmarkPuppeteer } from "./benchmarksPuppeteer.js";
import { CPUBenchmarkWebdriver } from "./benchmarksWebdriver.js";
import { config as defaultConfig, FrameworkData, JSONResult, JSONResultData } from "./common.js";
import pkg from 'jstat';
const { jStat } = pkg;

export type ResultLightHouse = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: StartupBenchmarkResult[];
  type: BenchmarkType.STARTUP; 
}

export type ResultCPU = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: CPUBenchmarkResult[];
  type: BenchmarkType.CPU; 
}

const DEFAULT = "default";

export type ResultMem = {
  framework: FrameworkData;
  benchmark: BenchmarkInfo;
  results: number[];
  type: BenchmarkType.MEM; 
}

export function writeResults(resultDir: string, res: ResultLightHouse|ResultCPU|ResultMem) {

  switch(res.type) {
  case BenchmarkType.STARTUP:
    for (let subbench of subbenchmarks) {
      let results = res.results.filter(r => r.benchmark.id == subbench.id).map(r => r.result);
      createResultFile(resultDir, results, res.framework, subbench);
    }
      break;
    case BenchmarkType.CPU:
      console.log("writeResults", res);
      createResultFile(resultDir, ({total: res.results.map(r=>r.total), script: res.results.map(r=>r.script)}), res.framework, res.benchmark);
      break;
    case BenchmarkType.MEM:
      createResultFile(resultDir, (res.results as any) as number[], res.framework, res.benchmark);
      break;
    }
}

function createResultFile(resultDir: string, data: number[]|{[key:string]: number[]}, framework: FrameworkData, benchmark: BenchmarkInfo) {
  console.log("createResultFile", data);
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
        mean:s.mean(),
        median:s.median(),
        stddev:s.stdev(true),
        values: data,      
      }
      console.log(
        `result ${fileName(framework, benchmark)} ${label} ${JSON.stringify(res)}`
      );
      return res;
    }
  if (Array.isArray(data)) {
    let result: JSONResult = {
      framework: framework.fullNameWithKeyedAndVersion,
      keyed: framework.keyed,
      benchmark: benchmark.id,
      type: type,
      values: {DEFAULT: convertResult('', data as number[])}
    };
    fs.writeFileSync(`${resultDir}/${fileName(framework, benchmark)}`, JSON.stringify(result), { encoding: "utf8" });
  } else {
    let values: {[k: string]: JSONResultData} = {};
    for (let key of Object.keys(data)) {
      console.log("converting", key, data[key], data);
      values[key] = convertResult(key, data[key]);
    }
    let result: JSONResult = {
      framework: framework.fullNameWithKeyedAndVersion,
      keyed: framework.keyed,
      benchmark: benchmark.id,
      type: type,
      values
    };
    fs.writeFileSync(`${resultDir}/${fileName(framework, benchmark)}`, JSON.stringify(result), { encoding: "utf8" });

  }
}
