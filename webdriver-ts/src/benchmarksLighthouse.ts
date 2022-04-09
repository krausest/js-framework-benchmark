// import { BenchmarkInfo, BenchmarkType } from "./benchmarksCommon";
// import { config, FrameworkData } from "./common";
// import * as benchmarksCommon from "./benchmarksCommon";
// import {DurationMeasurementMode} from "./benchmarksCommon";

import { BenchmarkInfo, BenchmarkType, BENCHMARK_30, DurationMeasurementMode } from "./benchmarksCommon";


// export interface LighthouseData {
//   TimeToConsistentlyInteractive: number;
//   ScriptBootUpTtime: number;
//   MainThreadWorkCost: number;
//   TotalKiloByteWeight: number;
//   [propName: string]: number;
// }

// export interface StartupBenchmarkResult extends BenchmarkInfo {
//   property: keyof LighthouseData;
// }


export interface StartupBenchmark extends BenchmarkInfo {
  property: string;
  fn: (x:number) => number;
}

export interface StartupBenchmarkResult extends StartupBenchmark {
  result: number;
}


let id = (x:number) => x;
let toKb = (x:number) => x/1024;

export const benchStartupConsistentlyInteractive: StartupBenchmark = {
  id: "31_startup-ci",
  label: "consistently interactive",
  description: "a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)",
  property: "interactive",
  fn: id,
  type: BenchmarkType.STARTUP,
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export const benchStartupBootup: StartupBenchmark = {
  id: "32_startup-bt",
  label: "script bootup time",
  description: "the total ms required to parse/compile/evaluate all the page's scripts",
  property: "bootup-time",
  fn: id,
  type: BenchmarkType.STARTUP,
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export const benchStartupMainThreadWorkCost: StartupBenchmark = {
  id: "33_startup-mainthreadcost",
  label: "main thread work cost",
  description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
  property: "mainthread-work-breakdown",
  fn: id,
  type: BenchmarkType.STARTUP,
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export const benchStartupTotalBytes: StartupBenchmark = {
  id: "34_startup-totalbytes",
  label: "total kilobyte weight",
  description: "network transfer cost (post-compression) of all the resources loaded into the page.",
  property: "total-byte-weight",
  fn: toKb,
  type: BenchmarkType.STARTUP,
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export let startupBenchmarks = [benchStartupConsistentlyInteractive, benchStartupBootup, benchStartupMainThreadWorkCost, benchStartupTotalBytes];

export class BenchmarkLighthouse {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
  throttleCPU?: number;
  allowBatching: boolean;
  durationMeasurementMode: DurationMeasurementMode;
  subbenchmarks = startupBenchmarks;

  constructor(public benchmarkInfo: BenchmarkInfo) {
    this.id = benchmarkInfo.id;
    this.type = benchmarkInfo.type;
    this.label = benchmarkInfo.label;
    this.description = benchmarkInfo.description;
    this.throttleCPU = benchmarkInfo.throttleCPU;
    this.allowBatching = benchmarkInfo.allowBatching;
    this.durationMeasurementMode = benchmarkInfo.durationMeasurementMode;
  }
}

export const benchLighthouse = new BenchmarkLighthouse({
  id: BENCHMARK_30,
  label: "Startup Metric",
  description: "Startup Metrics as reported from Lighthouse",
  type: BenchmarkType.STARTUP,
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT,
});
