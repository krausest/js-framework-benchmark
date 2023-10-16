export interface JSONResultData {
  min: number;
  max: number;
  mean: number;
  stddev: number;
  median: number;
  values: Array<number>;
}

export interface JSONResultMap {
  [key:string]: JSONResultData
}
export interface JSONResult {
  framework: string;
  keyed: boolean;
  benchmark: string;
  type: string;
  values: JSONResultMap;
}

export type TBenchmarkStatus = "OK" | "TEST_FAILED" | "TECHNICAL_ERROR";

export interface ErrorAndWarning<T> {
  error: string;
  warnings: string[];
  result?: T[];
}

export interface BenchmarkOptions {
  host: string;
  port: number;
  headless?: boolean;
  chromeBinaryPath?: string;
  remoteDebuggingPort: number;
  chromePort: number;
  batchSize: number;
  browser: string;
  numIterationsForCPUBenchmarks: number;
  numIterationsForMemBenchmarks: number;
  numIterationsForStartupBenchmark: number;

  allowThrottling: boolean;
  resultsDirectory:string,
  tracesDirectory: string,
}

/*
  RESULTS_DIRECTORY: "results",
  TRACES_DIRECTORY: "traces",
  BROWSER: "chrome",
  HOST: 'localhost',
*/

export enum BENCHMARK_RUNNER {
  PUPPETEER = "puppeteer",
  PLAYWRIGHT = "playwright",
  WEBDRIVER_CDP = "webdrivercdp",
  WEBDRIVER = "webdriver",
  WEBDRIVER_AFTERFRAME = "webdriver-afterframe"
}

export let config = {
  NUM_ITERATIONS_FOR_BENCHMARK_CPU: 15, 
  NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT: 0, // drop the # of slowest results
  NUM_ITERATIONS_FOR_BENCHMARK_MEM: 1,
  NUM_ITERATIONS_FOR_BENCHMARK_STARTUP: 1,
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
  ALLOW_BATCHING: true,
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
  frameworkHomeURL: string;
}

type KeyedType = "keyed" | "non-keyed";

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
  frameworkHomeURL: string;
}

export interface IMatchPredicate {
  (frameworkDirectory: string): boolean;
}

const matchAll: IMatchPredicate = () => true;

async function fetchFrameworks(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function initializeFrameworks(
  benchmarkOptions: BenchmarkOptions,
  matchPredicate: IMatchPredicate = matchAll,
): Promise<FrameworkData[]> {
  let lsResult;
  const lsUrl = `http://${benchmarkOptions.host}:${benchmarkOptions.port}/ls`;

  try {
    lsResult = await fetchFrameworks(lsUrl);
  } catch (error) {
    throw new Error(error);
  }

  let frameworks: FrameworkData[] = [];
  for (let ls of lsResult) {
    let frameworkVersionInformation: FrameworkInformation = ls;
    let fullName =
      frameworkVersionInformation.type +
      "/" +
      frameworkVersionInformation.directory;
    if (matchPredicate(fullName)) {
      frameworks.push({
        name: frameworkVersionInformation.directory,
        fullNameWithKeyedAndVersion:
          frameworkVersionInformation.frameworkVersionString,
        uri:
          "frameworks/" +
          fullName +
          (frameworkVersionInformation.customURL
            ? frameworkVersionInformation.customURL
            : ""),
        keyed: frameworkVersionInformation.type === "keyed",
        useShadowRoot: !!frameworkVersionInformation.useShadowRoot,
        useRowShadowRoot: !!frameworkVersionInformation.useRowShadowRoot,
        shadowRootName: frameworkVersionInformation.shadowRootName,
        buttonsInShadowRoot: !!frameworkVersionInformation.buttonsInShadowRoot,
        issues: (frameworkVersionInformation.issues ?? []).map((i) =>
          Number(i),
        ),
        frameworkHomeURL: frameworkVersionInformation.frameworkHomeURL ?? "",
      });
    }
  }
  if (config.LOG_DETAILS) {
    console.log("All available frameworks: ");
    console.log(frameworks.map((fd) => fd.fullNameWithKeyedAndVersion));
  }
  return frameworks;
}
