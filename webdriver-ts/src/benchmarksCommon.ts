import { FrameworkData } from "./common.js";

export enum BenchmarkType {
  CPU,
  MEM,
  STARTUP_MAIN,
  STARTUP,
  SIZE_MAIN,
  SIZE,
}

export interface BenchmarkInfoBase {
  id: string;
  label: string;
  description: string;
  type: BenchmarkType;
}

export interface CPUBenchmarkInfo extends BenchmarkInfoBase {
  allowBatching: boolean;
  type: BenchmarkType.CPU;
  layoutEventRequired: boolean;
  additionalNumberOfRuns: number;
  warmupCount: number
}

export interface MemBenchmarkInfo extends BenchmarkInfoBase {
  type: BenchmarkType.MEM;
}

export interface SizeInfoJSON {
  size_uncompressed: number,
  size_compressed: number,
  fp: number,
}

export interface SizeBenchmarkInfo extends BenchmarkInfoBase {
  type: BenchmarkType.SIZE;
  fn(sizeInfo: SizeInfoJSON): number;
}

export interface SizeMainBenchmarkInfo extends BenchmarkInfoBase {
  type: BenchmarkType.SIZE_MAIN;
}
export interface StartupMainBenchmarkInfo extends BenchmarkInfoBase {
  type: BenchmarkType.STARTUP_MAIN;
}

export interface StartupBenchmarkInfo extends BenchmarkInfoBase {
  type: BenchmarkType.STARTUP;
  property: string;
  fn: (x: number) => number;
}

export type BenchmarkInfo = CPUBenchmarkInfo | MemBenchmarkInfo | StartupMainBenchmarkInfo | StartupBenchmarkInfo | SizeBenchmarkInfo | SizeMainBenchmarkInfo;

export interface BenchmarkImpl {
  benchmarkInfo: BenchmarkInfo;
  type: BenchmarkType;
}

export interface CPUBenchmarkResult {
  total: number;
  script: number;
  paint: number;
}

export function fileName(framework: FrameworkData, benchmark: BenchmarkInfo) {
  return `${framework.fullNameWithKeyedAndVersion}_${benchmark.id}.json`;
}

export enum Benchmark {
  _01 = "01_run1k",
  _02 = "02_replace1k",
  _03 = "03_update10th1k_x16",
  _04 = "04_select1k",
  _05 = "05_swap1k",
  _06 = "06_remove-one-1k",
  _07 = "07_create10k",
  _08 = "08_create1k-after1k_x2",
  _09 = "09_clear1k_x8",
  _21 = "21_ready-memory",
  _22 = "22_run-memory",
  _23 = "23_update5-memory",
  // _24 = "24_run5-memory",
  _25 = "25_run-clear-memory",
  _26 = "26_run-10k-memory",
  _30 = "30_startup",
  _40 = "40_sizes",
}

export type BenchmarkId =
  | typeof Benchmark._01
  | typeof Benchmark._02
  | typeof Benchmark._03
  | typeof Benchmark._04
  | typeof Benchmark._05
  | typeof Benchmark._06
  | typeof Benchmark._07
  | typeof Benchmark._08
  | typeof Benchmark._09
  | typeof Benchmark._30
  | typeof Benchmark._40;

const throttlingFactors: { [idx: string]: number } = {
  [Benchmark._03]: 4,
  [Benchmark._04]: 4,
  [Benchmark._05]: 4,
  [Benchmark._06]: 2,
  [Benchmark._09]: 4,
};

export function slowDownNote(throttleCPU: number | undefined): string {
  return throttleCPU ? ` ${throttleCPU} x CPU slowdown.` : "";
}

export function warmupNote(b: BenchmarkInfo): string {
  return 'warmupCount' in b ? ` (${b.warmupCount} warmup runs).` : "";
}

export function slowDownFactor(benchmarkId: string, allowThrottling: boolean): number | undefined {
  if (!allowThrottling) return undefined;
  return throttlingFactors[benchmarkId];
}

export const cpuBenchmarkInfosArray: Array<CPUBenchmarkInfo> = [
  {
    id: Benchmark._01,
    label: "create rows",
    warmupCount: 5,
    description: "creating 1,000 rows.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._02,
    label: "replace all rows",
    warmupCount: 5,
    description: "updating all 1,000 rows.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._03,
    label: "partial update",
    warmupCount: 3,
    description: "updating every 10th row for 1,000 row.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._04,
    label: "select row",
    warmupCount: 5,
    description: "highlighting a selected row.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: false,
    additionalNumberOfRuns: 10,
  },
  {
    id: Benchmark._05,
    label: "swap rows",
    warmupCount: 5,
    description: "swap 2 rows for table with 1,000 rows.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._06,
    label: "remove row",
    warmupCount: 5,
    description: "removing one row.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._07,
    label: "create many rows",
    warmupCount: 5,
    description: "creating 10,000 rows.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._08,
    label: "append rows to large table",
    warmupCount: 5,
    description: "appending 1,000 to a table of 1,000 rows.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
  {
    id: Benchmark._09,
    label: "clear rows",
    warmupCount: 5,
    description: "clearing a table with 1,000 rows.",
    type: BenchmarkType.CPU,
    allowBatching: true,
    layoutEventRequired: true,
    additionalNumberOfRuns: 0,
  },
];

export const memBenchmarkInfosArray: Array<MemBenchmarkInfo> = [
  {
    id: Benchmark._21,
    label: "ready memory",
    description: "Memory usage after page load.",
    type: BenchmarkType.MEM,
  },
  {
    id: Benchmark._22,
    label: "run memory",
    description: "Memory usage after adding 1,000 rows.",
    type: BenchmarkType.MEM,
  },
  {
    id: Benchmark._23,
    label: "update every 10th row for 1k rows (5 cycles)",
    description: "Memory usage after clicking update every 10th row 5 times",
    type: BenchmarkType.MEM,
  },
  // {
  //   id: Benchmark._24,
  //   label: "replace 1k rows (5 cycles)",
  //   description: "Memory usage after clicking create 1000 rows 5 times",
  //   type: BenchmarkType.MEM,
  // },
  {
    id: Benchmark._25,
    label: "creating/clearing 1k rows (5 cycles)",
    description: "Memory usage after creating and clearing 1000 rows 5 times",
    type: BenchmarkType.MEM,
  },
  {
    id: Benchmark._26,
    label: "run memory 10k",
    description: "Memory usage after adding 10,000 rows.",
    type: BenchmarkType.MEM,
  },
];

export const startupBenchmarkInfosArray: Array<StartupMainBenchmarkInfo> = [
  {
    id: Benchmark._30,
    type: BenchmarkType.STARTUP_MAIN,
    label: "",
    description: "",
  }
];

export const sizesBenchmarkInfosArray: Array<SizeMainBenchmarkInfo> = [
  {
    id: Benchmark._40,
    type: BenchmarkType.SIZE_MAIN,
    label: "",
    description: "",
  },
];

export const cpuBenchmarkInfos: { [idx: string]: CPUBenchmarkInfo } = {};
for (let bi of cpuBenchmarkInfosArray) {
  cpuBenchmarkInfos[bi.id] = bi;
}

export const memBenchmarkInfos: { [idx: string]: MemBenchmarkInfo } = {};
for (let bi of memBenchmarkInfosArray) {
  memBenchmarkInfos[bi.id] = bi;
}

export const startupBenchmarkInfos: { [idx: string]: StartupMainBenchmarkInfo } = {};
for (let bi of startupBenchmarkInfosArray) {
  startupBenchmarkInfos[bi.id] = bi;
}

export const sizeBenchmarkInfos: { [idx: string]: SizeMainBenchmarkInfo } = {};
for (let bi of sizesBenchmarkInfosArray) {
  sizeBenchmarkInfos[bi.id] = bi;
}

export const benchmarkInfos = [...cpuBenchmarkInfosArray, ...memBenchmarkInfosArray, ...sizesBenchmarkInfosArray];
