import * as benchmarksPuppeteer from "./benchmarksPuppeteer";
import * as benchmarksWebdriver from "./benchmarksWebdriver";

export const benchmarks: Array<benchmarksPuppeteer.BenchmarkPuppeteer|benchmarksWebdriver.BenchmarkWebdriver> = [
    benchmarksWebdriver.benchRun,
    benchmarksWebdriver.benchReplaceAll,
    benchmarksWebdriver.benchUpdate,
    benchmarksWebdriver.benchSelect,
    benchmarksWebdriver.benchSwapRows,
    benchmarksWebdriver.benchRemove,
    benchmarksWebdriver.benchRunBig,
    benchmarksWebdriver.benchAppendToManyRows,
    benchmarksWebdriver.benchClear,
  
    benchmarksPuppeteer.benchReadyMemory,
    benchmarksPuppeteer.benchRunMemory,
    benchmarksPuppeteer.benchUpdate5Memory,
    benchmarksPuppeteer.benchReplace5Memory,
    benchmarksPuppeteer.benchCreateClear5Memory,

    benchmarksWebdriver.benchStartup,
];