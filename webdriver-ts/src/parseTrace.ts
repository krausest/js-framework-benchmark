import * as fs from 'fs';
import { BenchmarkType, cpuBenchmarkInfos, CPUBenchmarkResult, DurationMeasurementMode } from './benchmarksCommon.js';
import { fileNameTrace } from './benchmarksPuppeteer.js';
import { BenchmarkOptions, config, initializeFrameworks } from './common.js';
import { computeResultsCPU, computeResultsJS } from './timeline.js';
import { writeResults } from "./writeResults.js";
// let TimelineModelBrowser = require("./timeline-model-browser.js");
//var DevtoolsTimelineModel = require('devtools-timeline-model');

let benchmarkOptions: BenchmarkOptions = {
    port: 8080,
    host: 'localhost',
    browser: 'chrome',
    remoteDebuggingPort: 9999,
    chromePort: 9998,
    headless: true,
    chromeBinaryPath: undefined,
    numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
    numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
    numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
    batchSize: 1,
    resultsDirectory: "results",
    tracesDirectory: "traces",
    allowThrottling: false
  };

async function single() {



    for (let i = 0; i < 1; i++) {
        // const trace = `traces/1more-v0.1.18-keyed_01_run1k_0.json`;
        const trace = `traces/react-hooks-use-transition-v18.2.0-keyed_07_create10k_1.json`;
        console.log("analyzing trace ", trace);
        const cpuTrace = await computeResultsCPU(config, trace, DurationMeasurementMode.LAST_PAINT);
        console.log(trace, cpuTrace)
        console.log(trace, await computeResultsJS(cpuTrace, config, trace, DurationMeasurementMode.LAST_PAINT))
    }


}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function readAll() {
    let cpuCPUBenchmarks = Object.values(cpuBenchmarkInfos);
    
    let frameworks = await initializeFrameworks(benchmarkOptions);
    for (let framework of frameworks) {
        for (let benchmarkInfo of cpuCPUBenchmarks) {
            let results: CPUBenchmarkResult[] = [];
            for (let i = 0; i < 12; i++) {
                let trace = `${fileNameTrace(framework, benchmarkInfo, i, benchmarkOptions)}`;
                if (!fs.existsSync(trace)) {
                    console.log("ignoring ", trace, "since it doesn't exist.");
                } else {
                    // console.log("checking ", trace, benchmarkInfo.durationMeasurementMode);
                    let result = await computeResultsCPU(config, trace, benchmarkInfo.durationMeasurementMode); 
                    let resultJS = await computeResultsJS(result, config, trace, benchmarkInfo.durationMeasurementMode); 
                    results.push({total:result.duration, script:resultJS});
                    // console.log(result);
                }
            }
            results.sort((a: CPUBenchmarkResult, b: CPUBenchmarkResult) => a.total - b.total);
            results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU);      
            await writeResults(benchmarkOptions.resultsDirectory, {
                framework: framework,
                benchmark: benchmarkInfo,
                results: results,
                type: BenchmarkType.CPU
              });
        }
    }
}

single().catch(err => {console.log("Error in isKeyed", err)}); 