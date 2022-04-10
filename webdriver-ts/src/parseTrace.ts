import * as fs from 'fs';
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as R from 'ramda';
import { BenchmarkType, DurationMeasurementMode } from './benchmarksCommon';
import { CPUBenchmarkPuppeteer, fileNameTrace } from './benchmarksPuppeteer';
import { config, initializeFrameworks } from './common';
import { computeResultsCPU } from './forkedBenchmarkRunnerPuppeteer';
import {benchmarks} from "./benchmarkConfiguration";
import { writeResults } from "./writeResults";

/*
                        0       1       2       3   4       5       6       7       8       9       10      11
CPU results before:  11.404, 22.339, 7.968, 6.486, 20.566, 12.011, 8.693, 22.172, 20.764, 8.445, 10.791, 7.754
*/

// config.LOG_DETAILS = true;

async function main() {



    // console.log(await computeResultsCPU(`traces/vanillajs-keyed_04_select1k_0.json`, false))
    for (let i = 0; i < 12; i++) {
        // let trace = `traces/angular-v13.0.0-keyed_01_run1k_${i}.json`;
        let trace = `traces/angular-v13.0.0-keyed_01_run1k_${i}.json`;
        console.log("trace", trace)
        console.log(await computeResultsCPU(trace, DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT));
    }
}

async function readAll() {
    let jsonResult: { framework: string; benchmark: string; values: number[] }[] = [];

    let puppeteerCPUBenchmarks: Array<CPUBenchmarkPuppeteer> = benchmarks.filter(b => b instanceof CPUBenchmarkPuppeteer) as Array<CPUBenchmarkPuppeteer>;
    
    let frameworks = await initializeFrameworks();
    for (let framework of frameworks) {
        for (let benchmark of puppeteerCPUBenchmarks) {
            let results: number[] = [];
            for (let i = 0; i < 12; i++) {
                let trace = `${fileNameTrace(framework, benchmark.benchmarkInfo, i)}`;
                if (!fs.existsSync(trace)) {
                    console.log("ignoring ", trace, "since it doesn't exist.");
                } else {
                    console.log("checking ", trace);
                    let result = await computeResultsCPU(trace, benchmark.benchmarkInfo.durationMeasurementMode); 
                    results.push(result);
                    console.log(result);
                }
            }
            results.sort((a: number, b: number) => a - b);
            results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU);      
            await writeResults(config, {
                framework: framework,
                benchmark: benchmark.benchmarkInfo,
                results: results,
                type: BenchmarkType.CPU
              });
        }
    }
}

readAll().then(() => { }); 