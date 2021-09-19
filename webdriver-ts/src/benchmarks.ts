// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Browser, Page } from 'puppeteer-core';
import { Builder, WebDriver, promise, logging } from 'selenium-webdriver'
import { config, FrameworkData } from './common'
import { clickElementById, testElementLocatedById, testElementLocatedByXpath } from './webdriverAccess';

export enum BenchmarkType { CPU, MEM, STARTUP };

const BENCHMARK_01 = "01_run1k";
const BENCHMARK_02 = "02_replace1k";
const BENCHMARK_03 = "03_update10th1k_x16";
const BENCHMARK_04 = "04_select1k";
const BENCHMARK_05 = "05_swap1k";
const BENCHMARK_06 = "06_remove-one-1k";
const BENCHMARK_07 = "07_create10k";
const BENCHMARK_08 = "08_create1k-after1k_x2";
const BENCHMARK_09 = "09_clear1k_x8";
const BENCHMARK_21 = "21_ready-memory";
const BENCHMARK_22 = "22_run-memory";
const BENCHMARK_23 = "23_update5-memory";
const BENCHMARK_24 = "24_run5-memory";
const BENCHMARK_25 = "25_run-clear-memory";
const BENCHMARK_31 = "31_startup-ci";

type TBenchmarkID =
  | typeof BENCHMARK_01
  | typeof BENCHMARK_02
  | typeof BENCHMARK_03
  | typeof BENCHMARK_04
  | typeof BENCHMARK_05
  | typeof BENCHMARK_06
  | typeof BENCHMARK_07
  | typeof BENCHMARK_08
  | typeof BENCHMARK_09
  | typeof BENCHMARK_21
  | typeof BENCHMARK_22
  | typeof BENCHMARK_23
  | typeof BENCHMARK_25
  | typeof BENCHMARK_31;

type ISlowDowns = {
  [key in TBenchmarkID]?: number;
};

const slowDownsOSX: ISlowDowns = {
  [BENCHMARK_03]: 2,
  [BENCHMARK_04]: 8,
  [BENCHMARK_05]: 2,
  [BENCHMARK_09]: 2,
};

const slowDownsLinux: ISlowDowns = {
  [BENCHMARK_03]: 16,
  [BENCHMARK_04]: 16,
  [BENCHMARK_05]: 4,
  [BENCHMARK_08]: 2,
  [BENCHMARK_09]: 8,
};

const slowDowns: ISlowDowns = process.platform == "darwin" ? slowDownsOSX : slowDownsLinux;

function slowDownNote(benchmark: TBenchmarkID): string {
  return slowDowns[benchmark] ? " " + slowDowns[benchmark] + "x CPU slowdown." : "";
}

function slowDownFactor(benchmark: TBenchmarkID): number | undefined {
  return slowDowns[benchmark] ? slowDowns[benchmark] : undefined;
}

const SHORT_TIMEOUT = 20 * 1000;

export interface BenchmarkInfo {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
    throttleCPU?: number;
    allowBatching: boolean;
}

export abstract class Benchmark {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
    throttleCPU?: number;
    allowBatching: boolean;

    constructor(public benchmarkInfo: BenchmarkInfo) {
        this.id = benchmarkInfo.id;
        this.type = benchmarkInfo.type;
        this.label = benchmarkInfo.label;
        this.description = benchmarkInfo.description;
        this.throttleCPU = benchmarkInfo.throttleCPU;
        this.allowBatching = benchmarkInfo.allowBatching;
    }
    abstract init(page: Page, framework: FrameworkData): Promise<any>;
    abstract run(page: Page, framework: FrameworkData): Promise<any>;
    after(page: Page, framework: FrameworkData): Promise<any> { return null; }
    // Good fit for a single result creating Benchmark
    resultKinds(): Array<BenchmarkInfo> { return [this.benchmarkInfo]; }
    extractResult(results: any[], resultKind: BenchmarkInfo): number[] { return results; };
}

export interface LighthouseData {
    TimeToConsistentlyInteractive: number;
    ScriptBootUpTtime: number;
    MainThreadWorkCost: number;
    TotalKiloByteWeight: number;
    [propName: string]: number;
}

export interface StartupBenchmarkResult extends BenchmarkInfo {
    property: keyof LighthouseData;
}

const benchRun = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_01,
          label: "create rows",
          description: "creating 1,000 rows" + slowDownNote(BENCHMARK_01),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_01),
          allowBatching: true,
        });
    }
    async init(page: Page) { 
        await testElementLocatedById(page, "add", SHORT_TIMEOUT, true); 
    }
    async run(page: Page) {
        await clickElementById(page, "add", true);
        await testElementLocatedByXpath(page, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
    }
}
/*
const benchReplaceAll = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_02,
          label: "replace all rows",
          description: "updating all 1,000 rows (" + config.WARMUP_COUNT +
                      " warmup runs)." + slowDownNote(BENCHMARK_02),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_02),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, 'run', SHORT_TIMEOUT, true);
        for (let i = 0; i < config.WARMUP_COUNT; i++) {
            await clickElementById(driver, 'run', true);
            await testTextContainsJS(driver, '//tbody/tr[1]/td[1]', (i*1000+1).toFixed(), config.TIMEOUT, false);
        }
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'run', true);
        await testTextContains(driver, '//tbody/tr[1]/td[1]', '5001', config.TIMEOUT, false);
    }
}

const benchUpdate = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_03,
          label: "partial update",
          description: "updating every 10th row for 1,000 rows (3 warmup runs)." +
                      slowDownNote(BENCHMARK_03),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_03),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT,false);
        for (let i = 0; i < 3; i++) {
            await clickElementById(driver, 'update', true);
            await testTextContainsJS(driver, '//tbody/tr[991]/td[2]/a', ' !!!'.repeat(i + 1), config.TIMEOUT, false);
        }
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'update', true);
        await testTextContains(driver, '//tbody/tr[991]/td[2]/a', ' !!!'.repeat(3 + 1), config.TIMEOUT, false);
    }
}

const benchSelect = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_04,
          label: "select row",
          description: "highlighting a selected row. (no warmup runs)." +
                      slowDownNote(BENCHMARK_04),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_04),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
    }
    async run(driver: WebDriver) {
        await clickElementByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
        await testClassContains(driver, "//tbody/tr[2]", "danger", config.TIMEOUT, false);
    }
}

const benchSwapRows = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_05,
          label: "swap rows",
          description: "swap 2 rows for table with 1,000 rows. (" +
                        config.WARMUP_COUNT +" warmup runs)." +
                        slowDownNote(BENCHMARK_05),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_05),
          allowBatching: true,
      });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[1]", config.TIMEOUT, false);
        for (let i = 0; i <= config.WARMUP_COUNT; i++) {
            let text = ((i%2) == 0) ? "2" : "999";
            await clickElementById(driver, 'swaprows', true);
            await testTextContainsJS(driver, "//tbody/tr[999]/td[1]", text, config.TIMEOUT, false);
        }
    }
    async run(driver: WebDriver) {
        let text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
        await clickElementById(driver, 'swaprows', true);
        await testTextContains(driver, "//tbody/tr[999]/td[2]/a", text, config.TIMEOUT, false);
    }
}

const benchRemove = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_06,
          label: "remove row",
          description: "removing one row. (" +config.WARMUP_COUNT +" warmup runs)." +
                      slowDownNote(BENCHMARK_06),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_06),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
        for (let i = 0; i < config.WARMUP_COUNT; i++) {
            await testTextContainsJS(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[1]`, (config.WARMUP_COUNT - i + 4).toString(), config.TIMEOUT, false);
            await clickElementByXPath(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[3]/a/span[1]`, false);
            await testTextContainsJS(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[1]`, '10', config.TIMEOUT, false);
        }
        await testTextContainsJS(driver, '//tbody/tr[5]/td[1]', '10', config.TIMEOUT, false);
        await testTextContainsJS(driver, '//tbody/tr[4]/td[1]', '4', config.TIMEOUT, false);

        // Click on a row the second time
        await testTextContainsJS(driver, `//tbody/tr[6]/td[1]`, '11', config.TIMEOUT, false);
        await clickElementByXPath(driver, `//tbody/tr[6]/td[3]/a/span[1]`, false);
        await testTextContainsJS(driver, `//tbody/tr[6]/td[1]`, '12', config.TIMEOUT, false);

    }
    async run(driver: WebDriver) {
        await clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]", false);
        await testTextContains(driver, '//tbody/tr[4]/td[1]', '10', config.TIMEOUT, false);
    }
}

const benchRunBig = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_07,
          label: "create many rows" + slowDownNote(BENCHMARK_07),
          description: "creating 10,000 rows",
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_07),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT, true);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'runlots', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a", config.TIMEOUT, false);
    }
}

const benchAppendToManyRows = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_08,
          label: "append rows to large table",
          description: "appending 1,000 to a table of 10,000 rows." +
                      slowDownNote(BENCHMARK_08),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_08),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'add', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1100]/td[2]/a", config.TIMEOUT, false);
    }
}

const benchClear = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_09,
          label: "clear rows",
          description: "clearing a table with 1,000 rows." + slowDownNote(BENCHMARK_09),
          type: BenchmarkType.CPU,
          throttleCPU: slowDownFactor(BENCHMARK_09),
          allowBatching: true,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'clear', true);
        await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
}

const benchReadyMemory = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_21,
          label: "ready memory",
          description: "Memory usage after page load.",
          type: BenchmarkType.MEM,
        allowBatching: false,
      });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
    }
    async run(driver: WebDriver) {
        await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
    async after(driver: WebDriver, framework: FrameworkData) {
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
    }
}

const benchRunMemory = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_22,
          label: "run memory",
          description: "Memory usage after adding 1000 rows.",
          type: BenchmarkType.MEM,
          allowBatching: false,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'run', true);
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
    }
}

const benchUpdate5Memory = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_23,
          label: "update eatch 10th row for 1k rows (5 cycles)",
          description: "Memory usage after clicking update every 10th row 5 times",
          type: BenchmarkType.MEM,
          allowBatching: false,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'run', true);
        for (let i = 0; i < 5; i++) {
            await clickElementById(driver, 'update', true);
            await testTextContainsJS(driver, '//tbody/tr[1]/td[2]/a', ' !!!'.repeat(i), config.TIMEOUT, false);
        }
    }
}

const benchReplace5Memory = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_24,
          label: "replace 1k rows (5 cycles)",
          description: "Memory usage after clicking create 1000 rows 5 times",
          type: BenchmarkType.MEM,
          allowBatching: false,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
    }
    async run(driver: WebDriver) {
        for (let i = 0; i < 5; i++) {
            await clickElementById(driver, 'run', true);
            await testTextContainsJS(driver, "//tbody/tr[1000]/td[1]", (1000 * (i + 1)).toFixed(), config.TIMEOUT, false);
        }
    }
}

const benchCreateClear5Memory = new class extends Benchmark {
    constructor() {
        super({
          id: BENCHMARK_25,
          label: "creating/clearing 1k rows (5 cycles)",
          description: "Memory usage after creating and clearing 1000 rows 5 times",
          type: BenchmarkType.MEM,
          allowBatching: false,
        });
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
    }
    async run(driver: WebDriver) {
        for (let i = 0; i < 5; i++) {
            await clickElementById(driver, 'run', true);
            await testTextContainsJS(driver, "//tbody/tr[1000]/td[1]", (1000 * (i + 1)).toFixed(), config.TIMEOUT, false);
            await clickElementById(driver, 'clear', true);
            await testElementNotLocatedByXPath(driver, "//tbody/tr[1000]/td[1]", config.TIMEOUT, false);
        }
    }
}

const benchStartupConsistentlyInteractive: StartupBenchmarkResult = {
    id: BENCHMARK_31,
    label: "consistently interactive",
    description: "a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)",
    type: BenchmarkType.STARTUP,
    property: "TimeToConsistentlyInteractive",
    allowBatching: false
}

const benchStartupBootup: StartupBenchmarkResult = {
    id: "32_startup-bt",
    label: "script bootup time",
    description: "the total ms required to parse/compile/evaluate all the page's scripts",
    type: BenchmarkType.STARTUP,
    property: "ScriptBootUpTtime",
    allowBatching: false
  }

const benchStartupMainThreadWorkCost: StartupBenchmarkResult = {
    id: "33_startup-mainthreadcost",
    label: "main thread work cost",
    description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
    type: BenchmarkType.STARTUP,
    property: "MainThreadWorkCost",
    allowBatching: false
}

const benchStartupTotalBytes: StartupBenchmarkResult = {
    id: "34_startup-totalbytes",
    label: "total kilobyte weight",
    description: "network transfer cost (post-compression) of all the resources loaded into the page.",
    type: BenchmarkType.STARTUP,
    property: "TotalKiloByteWeight",
    allowBatching: false
}

class BenchStartup extends Benchmark {
    constructor() {
        super({
            id: "30_startup",
            label: "startup time",
            description: "Time for loading, parsing and starting up",
            type: BenchmarkType.STARTUP,
            allowBatching: false
        })
    }
    async init(driver: WebDriver) { // not used with lighthouse
    }
    async run(driver: WebDriver, framework: FrameworkData) {
        // not used with lighthouse
    }
    extractResult(results: LighthouseData[], resultKind: BenchmarkInfo): number[] {
        return results.reduce((a, v) => { a.push(v[(resultKind as StartupBenchmarkResult).property]); return a; }, new Array<number>());
    }
    resultKinds() {
        return [
            benchStartupConsistentlyInteractive,
            benchStartupBootup,
            benchStartupTotalBytes,
        ];
    }
}
const benchStartup = new BenchStartup();
*/
export let benchmarks : Array<Benchmark> = [
    benchRun,
    // benchReplaceAll,
    // benchUpdate,
    // benchSelect,
    // benchSwapRows,
    // benchRemove,
    // benchRunBig,
    // benchAppendToManyRows,
    // benchClear,
    // benchReadyMemory,
    // benchRunMemory,
    // benchUpdate5Memory,
    // benchReplace5Memory,
    // benchCreateClear5Memory,
    // benchStartup,
];

export function fileName(framework: FrameworkData, benchmark: BenchmarkInfo) {
    return `${framework.fullNameWithKeyedAndVersion}_${benchmark.id}.json`;
}

export function fileNameTrace(framework: FrameworkData, benchmark: BenchmarkInfo, run: number) {
    return `${config.TRACES_DIRECTORY}/${framework.fullNameWithKeyedAndVersion}_${benchmark.id}_${run}.json`;
}