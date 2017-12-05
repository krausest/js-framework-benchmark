import {testTextContains, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath} from './webdriverAccess'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import {config, FrameworkData} from './common'

export enum BenchmarkType { CPU, MEM, STARTUP };

const SHORT_TIMEOUT = 20 * 1000;

export interface BenchmarkInfo {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
}

export interface BenchmarkResult {
    benchmarkInfo: BenchmarkInfo;
    results: number[];
}

export interface Benchmark extends BenchmarkInfo {
    init(driver: WebDriver, framework: FrameworkData) : Promise<any>;
    run(driver: WebDriver, framework: FrameworkData) : Promise<any>;
    after?(driver: WebDriver, framework: FrameworkData) : Promise<any>;
    extractResults(results: any) : Array<BenchmarkResult>;
    results : Array<BenchmarkInfo>;
}

export interface LighthouseData {
    FirstContentfulPaint: number;
    FirstMeaningfulPaint: number;
    Onload: number;
    FirstInteractive: number;
    TimeToConsistentlyInteractive: number;
    ScriptBootUpTtime: number;
    MainThreadWorkCost: number;
    EstimatedInputLatency: number;
    TotalByteWeight: number;
    [propName: string]: number;
}

export interface StartupBenchmarkResult extends BenchmarkInfo {
    property: keyof LighthouseData;
}

const benchRun: Benchmark= {
    id: "01_run1k",
    label: "create rows",
    description: "Duration for creating 1000 rows after the page loaded.",
    type: BenchmarkType.CPU,
    init: async function(driver: WebDriver) { await testElementLocatedById(driver, "add", SHORT_TIMEOUT); },
    run: async function(driver: WebDriver) {
        await clickElementById(driver,"add");
        await testElementLocatedByXpath(driver,"//tbody/tr[1000]/td[2]/a");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo: this, results: results}]; },
    results: null
}

const benchReplaceAll: Benchmark= {
    id:"02_replace1k",
    label: "replace all rows",
    description: "Duration for updating all 1000 rows of the table (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: async function (driver: WebDriver) {
        await testElementLocatedById(driver,'run', SHORT_TIMEOUT);
        for (let i=0; i<config.WARMUP_COUNT; i++) {
            await clickElementById(driver,'run');
        }
    },
    run: async function (driver: WebDriver) {
        await clickElementById(driver,'run');
        await testTextContains(driver,'//tbody/tr[1]/td[1]','5001');
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchUpdate: Benchmark= { 
    id:"03_update10th1k",   // FIXME rename to now 03_update10th10k
    label: "partial update",
    description: "Time to update the text of every 10th row (with "+config.WARMUP_COUNT+" warmup iterations) for a table with 10k rows.",
    type: BenchmarkType.CPU,
    init: async function (driver: WebDriver) {
            await testElementLocatedById(driver,"runlots", SHORT_TIMEOUT);
            await clickElementById(driver,'runlots');
            for (let i=0; i<config.WARMUP_COUNT; i++) {
                await clickElementById(driver,'update');
            }
    },
    run: async function (driver: WebDriver) {
            await clickElementById(driver,'update');
            await testTextContains(driver,'//tbody/tr[1]/td[2]/a', ' !!!'.repeat(config.WARMUP_COUNT+1));
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchSelect: Benchmark= {
    id:"04_select1k",
    label: "select row",
    description: "Duration to highlight a row in response to a click on the row. (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: async function(driver: WebDriver) {
            await testElementLocatedById(driver,"run", SHORT_TIMEOUT);
            await clickElementById(driver,'run');
            await testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a");
            for (let i=0; i<=config.WARMUP_COUNT; i++) {
                await clickElementByXPath(driver,`//tbody/tr[${i+1}]/td[2]/a`);
            }
    },
    run: async function(driver: WebDriver) {
        await clickElementByXPath(driver,"//tbody/tr[2]/td[2]/a");
        await testClassContains(driver,"//tbody/tr[2]", "danger");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchSwapRows: Benchmark= {
    id:"05_swap1k",
    label: "swap rows",
    description: "Time to swap 2 rows on a 1K table. (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: async function (driver: WebDriver) {
        await testElementLocatedById(driver,"run", SHORT_TIMEOUT);
        await clickElementById(driver,'run');
        await testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a");
        for (let i=0; i<=config.WARMUP_COUNT; i++) {
            let text = await getTextByXPath(driver,"//tbody/tr[2]/td[2]/a")
            await clickElementById(driver,'swaprows');
            await testTextContains(driver,"//tbody/tr[999]/td[2]/a", text);
        }
    },
    run: async function(driver: WebDriver) {
        let text = await getTextByXPath(driver,"//tbody/tr[2]/td[2]/a");
        await clickElementById(driver,'swaprows');
        await testTextContains(driver,"//tbody/tr[999]/td[2]/a", text);
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchRemove: Benchmark= {
    id:"06_remove-one-1k",
    label: "remove row",
    description: "Duration to remove a row. (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT);
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
        for (let i=0; i<config.WARMUP_COUNT; i++) {
            await testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT-i+4}]/td[1]`, (config.WARMUP_COUNT-i+4).toString());
            await clickElementByXPath(driver, `//tbody/tr[${config.WARMUP_COUNT-i+4}]/td[3]/a/span[1]`);
            await testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT-i+4}]/td[1]`, '10');
        }
        await testTextContains(driver, '//tbody/tr[5]/td[1]', '10');
        await testTextContains(driver, '//tbody/tr[4]/td[1]', '4');
    },
    run: async function(driver: WebDriver) {
        await clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]");
        await testTextContains(driver, '//tbody/tr[4]/td[1]', '10');
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchRunBig: Benchmark= {
    id: "07_create10k",
    label: "create many rows",
    description: "Duration to create 10,000 rows",
    type: BenchmarkType.CPU,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
    },
    run: async function(driver: WebDriver) {
        await clickElementById(driver, 'runlots');
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchAppendToManyRows: Benchmark= {
    id: "08_create1k-after10k",
    label: "append rows to large table",
    description: "Duration for adding 1000 rows on a table of 10,000 rows.",
    type: BenchmarkType.CPU,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
        await clickElementById(driver, 'runlots');
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
    },
    run: async function(driver: WebDriver) {
        await clickElementById(driver, 'add');
        await testElementLocatedByXpath(driver, "//tbody/tr[11000]/td[2]/a");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchClear: Benchmark= {
    id: "09_clear10k",
    label: "clear rows",
    description: "Duration to clear the table filled with 10.000 rows.",
    type: BenchmarkType.CPU,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
        await clickElementById(driver, 'runlots');
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
    },
    run: async function(driver: WebDriver) {
        await clickElementById(driver, 'clear');
        await testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchReadyMemory: Benchmark= {
    id: "21_ready-memory",
    label: "ready memory",
    description: "Memory usage after page load.",
    type: BenchmarkType.MEM,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    },
    run: async function(driver: WebDriver) {
        await testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
    },
    after: async function(driver: WebDriver, framework: FrameworkData) {
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchRunMemory: Benchmark= {
    id: "22_run-memory",
    label: "run memory",
    description: "Memory usage after adding 1000 rows.",
    type: BenchmarkType.MEM,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    },
    run: async function(driver: WebDriver) {
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchUpdate5Memory: Benchmark= {
    id: "23_update5-memory",
    label: "update eatch 10th row for 1k rows (5 cycles)",
    description: "Memory usage after clicking update every 10th row 5 times",
    type: BenchmarkType.MEM,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    },
    run: async function(driver: WebDriver) {
        await clickElementById(driver, 'run');
        for (let i=0; i<5; i++) {
            await clickElementById(driver,'update');
            await testTextContains(driver,'//tbody/tr[1]/td[2]/a', ' !!!'.repeat(i));
        }
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchReplace5Memory: Benchmark= {
    id: "24_run5-memory",
    label: "replace 1k rows (5 cycles)",
    description: "Memory usage after clicking create 1000 rows 5 times",
    type: BenchmarkType.MEM,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    },
    run: async function(driver: WebDriver) {
        for (let i=0;i<5;i++) {
            await clickElementById(driver, 'run');
            await testTextContains(driver, "//tbody/tr[1000]/td[1]", (1000*(i+1)).toFixed());
        }
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

const benchCreateClear5Memory: Benchmark= {
    id: "25_run-clear-memory",
    label: "creating/clearing 1k rows (5 cycles)",
    description: "Memory usage after creating and clearing 1000 rows 5 times",
    type: BenchmarkType.MEM,
    init: async function(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    },
    run: async function(driver: WebDriver) {
        for (let i=0;i<5;i++) {
            await clickElementById(driver, 'run');
            await testTextContains(driver, "//tbody/tr[1000]/td[1]", (1000*(i+1)).toFixed());
            await clickElementById(driver, 'clear');
            await testElementNotLocatedByXPath(driver, "//tbody/tr[1000]/td[1]");
        }
    },
    extractResults: (results: number[]) => { return [{benchmarkInfo:this, results: results}]; },
    results: null
}

function createResult(benchmarkInfo: StartupBenchmarkResult, results: LighthouseData[]) : BenchmarkResult {
    return {benchmarkInfo, results:  results.reduce((a,v) => {a.push(v[benchmarkInfo.property]); return a;}, new Array<number>())}
}


const benchStartupFcp: StartupBenchmarkResult = {
    id: "30_startup-fcp",
    label: "first contentful paint",
    description: "",
    type: BenchmarkType.STARTUP,
    property: "FirstContentfulPaint"
}

const benchStartupFmp: StartupBenchmarkResult = {
    id: "30_startup-fmp",
    label: "first meaningful paint",
    description: "The paint following the most significant layout during load.",
    type: BenchmarkType.STARTUP,
    property: "FirstMeaningfulPaint"
}

const benchStartupOnload: StartupBenchmarkResult = {
    id: "30_startup-onload",
    label: "onload",
    description: "Page onload",
    type: BenchmarkType.STARTUP,
    property: "Onload"
}

const benchStartupFirstInteractive: StartupBenchmarkResult = {
    id: "30_startup-fi",
    label: "first interactive",
    description: "an optimistic TTI - the first moment the main thread stays idle for a little bit.",
    type: BenchmarkType.STARTUP,
    property: "FirstInteractive"
}

const benchStartupConsistentlyInteractive: StartupBenchmarkResult = {
    id: "30_startup-ci",
    label: "consistently interactive",
    description: "a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)",
    type: BenchmarkType.STARTUP,
    property: "TimeToConsistentlyInteractive"
}

const benchStartupBootup: StartupBenchmarkResult = {
    id: "30_startup-bt",
    label: "script bootup time",
    description: "the total ms required to parse/compile/evaluate all the page's scripts",
    type: BenchmarkType.STARTUP,
    property: "ScriptBootUpTtime"
}

const benchStartupMainThreadWorkCost: StartupBenchmarkResult = {
    id: "30_startup-mainthreadcost",
    label: "main thread work cost",
    description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
    type: BenchmarkType.STARTUP,
    property: "MainThreadWorkCost"
}

const benchStartupEstimatedInputLatency: StartupBenchmarkResult = {
    id: "30_startup-eil",
    label: "estimated input latency",
    description: "kind of represents how slammed the main thread was. higher numbers are bad.",
    type: BenchmarkType.STARTUP,
    property: "EstimatedInputLatency"
}

const benchStartupTotalBytes: StartupBenchmarkResult = {
    id: "30_startup-totalbytes",
    label: "total byte weight",
    description: "network transfer cost (post-compression) of all the resources loaded into the page.",
    type: BenchmarkType.STARTUP,
    property: "TotalByteWeight"
}

const benchStartup: Benchmark = {
    id: "30_startup",
    label: "startup time",
    description: "Time for loading, parsing and starting up",
    type: BenchmarkType.STARTUP,
    init: async function(driver: WebDriver) {
        await driver.get(`http://localhost:8080/`);
    },
    run: async function(driver: WebDriver, framework: FrameworkData) {
        await driver.get(`http://localhost:8080/${framework.uri}/`);
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT);
        return driver.sleep(config.STARTUP_SLEEP_DURATION);
    },
    extractResults: function(results: LighthouseData[]): BenchmarkResult[] {
        return [
            createResult(benchStartupFcp, results),
            createResult(benchStartupFmp, results),
            createResult(benchStartupOnload, results),
            createResult(benchStartupFirstInteractive, results),
            createResult(benchStartupConsistentlyInteractive, results),
            createResult(benchStartupBootup, results),
            createResult(benchStartupMainThreadWorkCost, results),
            createResult(benchStartupEstimatedInputLatency, results),
            createResult(benchStartupTotalBytes, results),
        ]
    },
    results: [
            benchStartupFcp,
            benchStartupFmp,
            benchStartupOnload,
            benchStartupFirstInteractive,
            benchStartupConsistentlyInteractive,
            benchStartupBootup,
            benchStartupMainThreadWorkCost,
            benchStartupEstimatedInputLatency,
            benchStartupTotalBytes,            
        ]    
}


export let benchmarks : [ Benchmark ] = [
    benchRun,
    benchReplaceAll,
    benchUpdate,
    benchSelect,
    benchSwapRows,
    benchRemove,
    benchRunBig,
    benchAppendToManyRows,
    benchClear,
    benchReadyMemory,
    benchRunMemory,
    benchUpdate5Memory,
    benchReplace5Memory,
    benchCreateClear5Memory,
    benchStartup,
    ];

    // benchStartupFcp,
    // benchStartupFmp,
    // benchStartupOnload,
    // benchStartupFirstInteractive,
    // benchStartupConsistentlyInteractive,
    // benchStartupBootup,
    // benchStartupMainThreadWorkCost,
    // benchStartupEstimatedInputLatency,
    // benchStartupTotalBytes,



export function fileName(framework :FrameworkData, benchmark: BenchmarkInfo) {
    return `${framework.name}_${benchmark.id}.json`;
}