// import { BenchmarkInfo, BenchmarkType } from "./benchmarksCommon";
// import { config, FrameworkData } from "./common";
// import * as benchmarksCommon from "./benchmarksCommon";
// import {DurationMeasurementMode} from "./benchmarksCommon";

import { BenchmarkImpl, BenchmarkType, BENCHMARK_30, DurationMeasurementMode, StartupBenchmark, StartupMainBenchmark } from "./benchmarksCommon";


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

export interface StartupBenchmarkResult extends BenchmarkImpl {
  benchmark: StartupBenchmark;
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
};

export const benchStartupBootup: StartupBenchmark = {
  id: "32_startup-bt",
  label: "script bootup time",
  description: "the total ms required to parse/compile/evaluate all the page's scripts",
  property: "bootup-time",
  fn: id,
  type: BenchmarkType.STARTUP,
};

export const benchStartupMainThreadWorkCost: StartupBenchmark = {
  id: "33_startup-mainthreadcost",
  label: "main thread work cost",
  description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
  property: "mainthread-work-breakdown",
  fn: id,
  type: BenchmarkType.STARTUP,
};

export const benchStartupTotalBytes: StartupBenchmark = {
  id: "34_startup-totalbytes",
  label: "total kilobyte weight",
  description: "network transfer cost (post-compression) of all the resources loaded into the page.",
  property: "total-byte-weight",
  fn: toKb,
  type: BenchmarkType.STARTUP,
};

export class BenchmarkLighthouse implements BenchmarkImpl {
  type = BenchmarkType.STARTUP_MAIN;

  subbenchmarks = [benchStartupConsistentlyInteractive, benchStartupBootup, benchStartupMainThreadWorkCost, benchStartupTotalBytes];

  constructor(public benchmarkInfo: StartupMainBenchmark) {
  }
}

export const benchLighthouse = new BenchmarkLighthouse({
  id: BENCHMARK_30,
  type: BenchmarkType.STARTUP_MAIN,
  label: '',
  description: '',
});
