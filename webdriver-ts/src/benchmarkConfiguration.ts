import * as benchmarksPuppeteer from "./benchmarksPuppeteer";
import * as benchmarksWebdriver from "./benchmarksWebdriver";
import * as benchmarksLighthouse from "./benchmarksLighthouse";

export const benchmarks: Array<benchmarksPuppeteer.BenchmarkPuppeteer|benchmarksWebdriver.BenchmarkWebdriver|benchmarksLighthouse.BenchmarkLighthouse> = [
    benchmarksPuppeteer.benchRun,
    benchmarksPuppeteer.benchReplaceAll,
    benchmarksPuppeteer.benchUpdate,
    benchmarksPuppeteer.benchSelect,
    benchmarksPuppeteer.benchSwapRows,
    benchmarksPuppeteer.benchRemove,
    benchmarksPuppeteer.benchRunBig,
    benchmarksPuppeteer.benchAppendToManyRows,
    benchmarksPuppeteer.benchClear,
  
    benchmarksPuppeteer.benchReadyMemory,
    benchmarksPuppeteer.benchRunMemory,
    benchmarksPuppeteer.benchUpdate5Memory,
    benchmarksPuppeteer.benchReplace5Memory,
    benchmarksPuppeteer.benchCreateClear5Memory,

    benchmarksLighthouse.benchLighthouse,
];