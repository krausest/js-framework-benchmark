import * as benchmarksCommon from "./benchmarksCommon";
import { BenchmarkImpl, BenchmarkType, StartupBenchmarkInfo } from "./benchmarksCommon";

export interface StartupBenchmarkResult extends BenchmarkImpl {
  benchmark: StartupBenchmarkInfo;
  result: number;
}

let id = (x:number) => x;
let toKb = (x:number) => x/1024;

export const benchStartupConsistentlyInteractive: StartupBenchmarkInfo = {
  id: "31_startup-ci",
  label: "consistently interactive",
  description: "a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)",
  property: "interactive",
  fn: id,
  type: BenchmarkType.STARTUP,
};

export const benchStartupBootup: StartupBenchmarkInfo = {
  id: "32_startup-bt",
  label: "script bootup time",
  description: "the total ms required to parse/compile/evaluate all the page's scripts",
  property: "bootup-time",
  fn: id,
  type: BenchmarkType.STARTUP,
};

export const benchStartupMainThreadWorkCost: StartupBenchmarkInfo = {
  id: "33_startup-mainthreadcost",
  label: "main thread work cost",
  description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
  property: "mainthread-work-breakdown",
  fn: id,
  type: BenchmarkType.STARTUP,
};

export const benchStartupTotalBytes: StartupBenchmarkInfo = {
  id: "34_startup-totalbytes",
  label: "total kilobyte weight",
  description: "network transfer cost (post-compression) of all the resources loaded into the page.",
  property: "total-byte-weight",
  fn: toKb,
  type: BenchmarkType.STARTUP,
};

export const subbenchmarks = [benchStartupConsistentlyInteractive, benchStartupBootup, benchStartupMainThreadWorkCost, benchStartupTotalBytes];

export class BenchmarkLighthouse implements BenchmarkImpl {
  type = BenchmarkType.STARTUP_MAIN;
  benchmarkInfo = benchmarksCommon.startupBenchmarkInfos[benchmarksCommon.BENCHMARK_30];
  subbenchmarks = subbenchmarks;
}

export const benchLighthouse = new BenchmarkLighthouse();

export const benchmarks = [benchLighthouse];
