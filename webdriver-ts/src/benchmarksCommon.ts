import { FrameworkData } from "./common";

export enum BenchmarkType {
  CPU,
  MEM,
  STARTUP,
}

export enum DurationMeasurementMode {
  FIRST_PAINT_AFTER_LAYOUT,
  LAST_PAINT
}

export interface BenchmarkInfo {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
  throttleCPU?: number;
  allowBatching: boolean;
  durationMeasurementMode: DurationMeasurementMode;
}

export function fileName(framework: FrameworkData, benchmark: BenchmarkInfo) {
  return `${framework.fullNameWithKeyedAndVersion}_${benchmark.id}.json`;
}


export const BENCHMARK_01 = "01_run1k";
export const BENCHMARK_02 = "02_replace1k";
export const BENCHMARK_03 = "03_update10th1k_x16";
export const BENCHMARK_04 = "04_select1k";
export const BENCHMARK_05 = "05_swap1k";
export const BENCHMARK_06 = "06_remove-one-1k";
export const BENCHMARK_07 = "07_create10k";
export const BENCHMARK_08 = "08_create1k-after1k_x2";
export const BENCHMARK_09 = "09_clear1k_x8";

export const BENCHMARK_21 = "21_ready-memory";
export const BENCHMARK_22 = "22_run-memory";
export const BENCHMARK_23 = "23_update5-memory";
export const BENCHMARK_24 = "24_run5-memory";
export const BENCHMARK_25 = "25_run-clear-memory";

export const BENCHMARK_31 = "31_startup-ci";

export type TBenchmarkID =
  | typeof BENCHMARK_01
  | typeof BENCHMARK_02
  | typeof BENCHMARK_03
  | typeof BENCHMARK_04
  | typeof BENCHMARK_05
  | typeof BENCHMARK_06
  | typeof BENCHMARK_07
  | typeof BENCHMARK_08
  | typeof BENCHMARK_09
  | typeof BENCHMARK_31;

type ISlowDowns = {
  [key in TBenchmarkID]?: number;
};

const slowDownsOSX: ISlowDowns = {
  [BENCHMARK_03]: 2,
  [BENCHMARK_04]: 4,
  [BENCHMARK_05]: 2,
  [BENCHMARK_09]: 2,
};

const slowDownsLinux: ISlowDowns = {
  [BENCHMARK_03]: 16,
  [BENCHMARK_04]: 16,
  [BENCHMARK_05]: 4,
  [BENCHMARK_08]: 2,
  [BENCHMARK_09]: 8,
};

const slowDowns: ISlowDowns = process.platform == "darwin" ? slowDownsOSX : slowDownsLinux;

export function slowDownNote(benchmark: TBenchmarkID): string {
  return slowDowns[benchmark] ? " " + slowDowns[benchmark] + "x CPU slowdown." : "";
}

export function slowDownFactor(benchmark: TBenchmarkID): number | undefined {
  return slowDowns[benchmark] ? slowDowns[benchmark] : undefined;
}
