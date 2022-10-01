import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { StartupBenchmarkResult } from "./benchmarksLighthouse";
import { string } from "yargs";

export interface JSONResult {
  framework: string;
  keyed: boolean;
  benchmark: string;
  type: string;
  min: number;
  max: number;
  mean: number;
  geometricMean: number;
  standardDeviation: number;
  median: number;
  values: Array<number>;
}

export type TBenchmarkStatus = "OK" | "TEST_FAILED" | "TECHNICAL_ERROR";

export interface ErrorAndWarning {
  error: string;
  warnings: string[];
  result?: number[] | StartupBenchmarkResult[];
}

export interface BenchmarkDriverOptions {
  headless?: boolean;
  chromeBinaryPath?: string;
  remoteDebuggingPort: number;
  chromePort: number;
}

export interface BenchmarkOptions extends BenchmarkDriverOptions {
  HOST: string;
  port: string;
  batchSize: number;
  numIterationsForCPUBenchmarks: number;
  numIterationsForMemBenchmarks: number;
  numIterationsForStartupBenchmark: number;
}

export enum BENCHMARK_RUNNER { 
  PUPPETEER = "puppeteer", 
  PLAYWRIGHT = "playwright", 
  WEBDRIVER_CDP = "webdrivercdp", 
  WEBDRIVER = "webdriver" 
}

export let config = {
  PORT: 8080,
  REMOTE_DEBUGGING_PORT: 9999,
  CHROME_PORT: 9998,
  NUM_ITERATIONS_FOR_BENCHMARK_CPU: 10,
  NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT: 2, // drop the # of slowest results
  NUM_ITERATIONS_FOR_BENCHMARK_MEM: 1,
  NUM_ITERATIONS_FOR_BENCHMARK_STARTUP: 3,
  WARMUP_COUNT: 5,
  TIMEOUT: 60 * 1000,
  LOG_PROGRESS: true,
  LOG_DETAILS: false,
  LOG_DEBUG: false,
  LOG_TIMELINE: false,
  EXIT_ON_ERROR: null as boolean, // set from command line
  STARTUP_DURATION_FROM_EVENTLOG: true,
  STARTUP_SLEEP_DURATION: 1000,
  WRITE_RESULTS: true,
  RESULTS_DIRECTORY: "results",
  TRACES_DIRECTORY: "traces",
  ALLOW_BATCHING: true,
  HOST: 'localhost',
  BENCHMARK_RUNNER: BENCHMARK_RUNNER.PUPPETEER
};
export type TConfig = typeof config;

export interface FrameworkData {
  name: string;
  fullNameWithKeyedAndVersion: string;
  uri: string;
  keyed: boolean;
  useShadowRoot: boolean;
  useRowShadowRoot: boolean;
  shadowRootName: string | undefined;
  buttonsInShadowRoot: boolean;
  issues: number[];
}

interface Options {
  uri: string;
  useShadowRoot?: boolean;
}

type KeyedType = "keyed" | "non-keyed";

function computeHash(keyedType: KeyedType, directory: string) {
  return keyedType + "/" + directory;
}

export interface FrameworkInformation {
  type: KeyedType;
  directory: string;
  issues: string[];
  customURL?: string;
  useShadowRoot?: boolean;
  useRowShadowRoot?: boolean;
  shadowRootName?: string;
  buttonsInShadowRoot?: boolean;
  versions?: {[key: string]: string};
  frameworkVersionString: string;
}

export interface IMatchPredicate {
  (frameworkDirectory: string): boolean;
}

const matchAll: IMatchPredicate = (frameworkDirectory: string) => true;

export async function initializeFrameworks(matchPredicate: IMatchPredicate = matchAll): Promise<FrameworkData[]> {
  let lsResult ;
  try {
    lsResult = (
    await axios.get(`http://${config.HOST}:${config.PORT}/ls`)
  ).data;
  } catch (err) {
    console.log(`ERROR loading frameworks from http://${config.HOST}:${config.PORT}/ls. Is the server running?`);
    throw new Error(`ERROR loading frameworks from http://${config.HOST}:${config.PORT}/ls. Is the server running?`);
  }

  let frameworks: FrameworkData[] = [];
  for (let ls of lsResult) {
    let frameworkVersionInformation: FrameworkInformation = ls;
    let fullName = frameworkVersionInformation.type + "/" + frameworkVersionInformation.directory;
    if (matchPredicate(fullName)) {
      frameworks.push({
          name: frameworkVersionInformation.directory,
          fullNameWithKeyedAndVersion: frameworkVersionInformation.frameworkVersionString,
          uri: "frameworks/" + fullName + (frameworkVersionInformation.customURL ? frameworkVersionInformation.customURL : ""),
          keyed: frameworkVersionInformation.type === "keyed",
          useShadowRoot: !!frameworkVersionInformation.useShadowRoot,
          useRowShadowRoot: !!frameworkVersionInformation.useRowShadowRoot,
          shadowRootName: frameworkVersionInformation.shadowRootName,
          buttonsInShadowRoot: !!frameworkVersionInformation.buttonsInShadowRoot,
          issues: (frameworkVersionInformation.issues ?? []).map(i => Number(i))
        });
      }
  }
  if (config.LOG_DETAILS) {
    console.log("All available frameworks: ");
    console.log(frameworks.map((fd) => fd.fullNameWithKeyedAndVersion));
  }
  return frameworks;
}
