import * as benchmarksPuppeteer from "./benchmarksPuppeteer";
import * as benchmarksPlaywright from "./benchmarksPlaywright";
import * as benchmarksWebdriver from "./benchmarksWebdriver";
import * as benchmarksWebdriverCDP from "./benchmarksWebdriverCDP";
import * as benchmarksLighthouse from "./benchmarksLighthouse";

export type TBenchmarkImplementation = benchmarksWebdriver.CPUBenchmarkWebdriver | benchmarksPuppeteer.TBenchmarkPuppeteer 
                            | benchmarksLighthouse.BenchmarkLighthouse 
                            | benchmarksPlaywright.CPUBenchmarkPlaywright | benchmarksPlaywright.MemBenchmarkPlaywright 
                            | benchmarksWebdriverCDP.CPUBenchmarkWebdriverCDP;

export const benchmarks: Array<TBenchmarkImplementation> = [
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
