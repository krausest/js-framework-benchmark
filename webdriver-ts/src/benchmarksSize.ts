import * as benchmarksCommon from "./benchmarksCommon.js";
import { BenchmarkImpl, BenchmarkType, SizeBenchmarkInfo } from "./benchmarksCommon.js";

export interface SizeBenchmarkResult {
  benchmark: SizeBenchmarkInfo;
  result: number;
}

let toKb = (x: number) => x / 1024;

export const benchUncompressedSize: benchmarksCommon.SizeBenchmarkInfo = {
  id: "41_size-uncompressed",
  label: "uncompressed size",
  description: "uncompressed size of all implementation files (excluding /css and http headers)",
  type: BenchmarkType.SIZE,
  fn: (sizeInfo) => Number(toKb(sizeInfo.size_uncompressed).toFixed(1)),
};

export const benchCompressedSize: benchmarksCommon.SizeBenchmarkInfo = {
  id: "42_size-compressed",
  label: "compressed size",
  description: "brotli compressed size of all implementation files (excluding /css and http headers)",
  type: BenchmarkType.SIZE,
  fn: (sizeInfo) => Number(toKb(sizeInfo.size_compressed).toFixed(1)),
};

export const benchFP: benchmarksCommon.SizeBenchmarkInfo = {
  id: "43_first-paint",
  label: "first paint",
  description: "first paint",
  type: BenchmarkType.SIZE,
  fn: (sizeInfo) => Number(sizeInfo.fp.toFixed(1)),
};

// export const benchFCP: benchmarksCommon.SizeBenchmarkInfo = {
//   id: "44_first-contentful-paint",
//   label: "first contentful paint",
//   description: () =>
//     "first contentful paint",
//   type: BenchmarkType.SIZE,
//   fn: (sizeInfo) => Number(sizeInfo.fcp.toFixed(1)),
// };

export const subbenchmarks = [
  benchUncompressedSize,
  benchCompressedSize,
  benchFP,
  // benchFCP,
];

export class BenchmarkSize implements BenchmarkImpl {
  type = BenchmarkType.SIZE_MAIN;
  benchmarkInfo = benchmarksCommon.sizeBenchmarkInfos[benchmarksCommon.Benchmark._40];
  subbenchmarks = subbenchmarks;
}

export const benchSize = new BenchmarkSize();

export const benchmarks = [benchSize];
