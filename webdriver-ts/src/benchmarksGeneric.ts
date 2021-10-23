import { FrameworkData } from "./common";

export enum BenchmarkType {
  CPU,
  MEM,
  STARTUP,
}

export interface BenchmarkInfo {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
  throttleCPU?: number;
  allowBatching: boolean;
}

export function fileName(framework: FrameworkData, benchmark: BenchmarkInfo) {
  return `${framework.fullNameWithKeyedAndVersion}_${benchmark.id}.json`;
}
