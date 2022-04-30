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
    benchmarksPlaywright.benchRun,
    benchmarksPlaywright.benchReplaceAll,
    benchmarksPlaywright.benchUpdate,
    benchmarksPlaywright.benchSelect,
    benchmarksPlaywright.benchSwapRows,
    benchmarksPlaywright.benchRemove,
    benchmarksPlaywright.benchRunBig,
    benchmarksPlaywright.benchAppendToManyRows,
    benchmarksPlaywright.benchClear,
  
    benchmarksPlaywright.benchReadyMemory,
    benchmarksPlaywright.benchRunMemory,
    benchmarksPlaywright.benchUpdate5Memory,
    benchmarksPlaywright.benchReplace5Memory,
    benchmarksPlaywright.benchCreateClear5Memory,

    benchmarksLighthouse.benchLighthouse,
];
