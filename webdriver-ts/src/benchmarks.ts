import { testTextContains, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'
import { Builder, WebDriver, promise, logging } from 'selenium-webdriver'
import { config, FrameworkData } from './common'

export enum BenchmarkType { CPU, MEM, STARTUP };

const SHORT_TIMEOUT = 20 * 1000;

export interface BenchmarkInfo {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
}

export abstract class Benchmark {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
    constructor(public benchmarkInfo: BenchmarkInfo) {
        this.id = benchmarkInfo.id;
        this.type = benchmarkInfo.type;
        this.label = benchmarkInfo.label;
        this.description = benchmarkInfo.description;
    }
    abstract init(driver: WebDriver, framework: FrameworkData, port: number): Promise<any>;
    abstract run(driver: WebDriver, framework: FrameworkData, port: number): Promise<any>;
    after(driver: WebDriver, framework: FrameworkData): Promise<any> { return null; }
    // Good fit for a single result creating Benchmark
    resultKinds(): Array<BenchmarkInfo> { return [this.benchmarkInfo]; }
    extractResult(results: any[], resultKind: BenchmarkInfo): number[] { return results; };
}

export interface LighthouseData {
    TimeToConsistentlyInteractive: number;
    ScriptBootUpTtime: number;
    MainThreadWorkCost: number;
    TotalByteWeight: number;
    [propName: string]: number;
}

export interface StartupBenchmarkResult extends BenchmarkInfo {
    property: keyof LighthouseData;
}

const benchRun = new class extends Benchmark {
    constructor() {
        super({
            id: "01_run1k",
            label: "create rows",
            description: "Duration for creating 1000 rows after the page loaded.",
            type: BenchmarkType.CPU
        })
    }
    async init(driver: WebDriver) { await testElementLocatedById(driver, "add", SHORT_TIMEOUT); }
    async run(driver: WebDriver) {
        await clickElementById(driver, "add");
        await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a");
    }
}

const benchReplaceAll = new class extends Benchmark {
    constructor() {
        super({
            id: "02_replace1k",
            label: "replace all rows",
            description: "Duration for updating all 1000 rows of the table (with " + config.WARMUP_COUNT + " warmup iterations).",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, 'run', SHORT_TIMEOUT);
        for (let i = 0; i < config.WARMUP_COUNT; i++) {
            await clickElementById(driver, 'run');
        }
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'run');
        await testTextContains(driver, '//tbody/tr[1]/td[1]', '5001');
    }
}

const benchUpdate = new class extends Benchmark {
    constructor() {
        super({
            id: "03_update10th1k",   // FIXME rename to now 03_update10th10k
            label: "partial update",
            description: "Time to update the text of every 10th row (with " + config.WARMUP_COUNT + " warmup iterations) for a table with 10k rows.",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
        await clickElementById(driver, 'runlots');
        for (let i = 0; i < config.WARMUP_COUNT; i++) {
            await clickElementById(driver, 'update');
        }
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'update');
        await testTextContains(driver, '//tbody/tr[1]/td[2]/a', ' !!!'.repeat(config.WARMUP_COUNT + 1));
    }
}

const benchSelect = new class extends Benchmark {
    constructor() {
        super({
            id: "04_select1k",
            label: "select row",
            description: "Duration to highlight a row in response to a click on the row. (with " + config.WARMUP_COUNT + " warmup iterations).",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT);
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
        for (let i = 0; i <= config.WARMUP_COUNT; i++) {
            await clickElementByXPath(driver, `//tbody/tr[${i + 1}]/td[2]/a`);
        }
    }
    async run(driver: WebDriver) {
        await clickElementByXPath(driver, "//tbody/tr[2]/td[2]/a");
        await testClassContains(driver, "//tbody/tr[2]", "danger");
    }
}

const benchSwapRows = new class extends Benchmark {
    constructor() {
        super({
            id: "05_swap1k",
            label: "swap rows",
            description: "Time to swap 2 rows on a 1K table. (with " + config.WARMUP_COUNT + " warmup iterations).",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT);
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
        for (let i = 0; i <= config.WARMUP_COUNT; i++) {
            let text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a")
            await clickElementById(driver, 'swaprows');
            await testTextContains(driver, "//tbody/tr[999]/td[2]/a", text);
        }
    }
    async run(driver: WebDriver) {
        let text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a");
        await clickElementById(driver, 'swaprows');
        await testTextContains(driver, "//tbody/tr[999]/td[2]/a", text);
    }
}

const benchRemove = new class extends Benchmark {
    constructor() {
        super({
            id: "06_remove-one-1k",
            label: "remove row",
            description: "Duration to remove a row. (with " + config.WARMUP_COUNT + " warmup iterations).",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT);
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
        for (let i = 0; i < config.WARMUP_COUNT; i++) {
            await testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[1]`, (config.WARMUP_COUNT - i + 4).toString());
            await clickElementByXPath(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[3]/a/span[1]`);
            await testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[1]`, '10');
        }
        await testTextContains(driver, '//tbody/tr[5]/td[1]', '10');
        await testTextContains(driver, '//tbody/tr[4]/td[1]', '4');
    }
    async run(driver: WebDriver) {
        await clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]");
        await testTextContains(driver, '//tbody/tr[4]/td[1]', '10');
    }
}

const benchRunBig = new class extends Benchmark {
    constructor() {
        super({
            id: "07_create10k",
            label: "create many rows",
            description: "Duration to create 10,000 rows",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'runlots');
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
    }
}

const benchAppendToManyRows = new class extends Benchmark {
    constructor() {
        super({
            id: "08_create1k-after10k",
            label: "append rows to large table",
            description: "Duration for adding 1000 rows on a table of 10,000 rows.",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
        await clickElementById(driver, 'runlots');
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'add');
        await testElementLocatedByXpath(driver, "//tbody/tr[11000]/td[2]/a");
    }
}

const benchClear = new class extends Benchmark {
    constructor() {
        super({
            id: "09_clear10k",
            label: "clear rows",
            description: "Duration to clear the table filled with 10.000 rows.",
            type: BenchmarkType.CPU,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT);
        await clickElementById(driver, 'runlots');
        await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'clear');
        await testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
    }
}

const benchReadyMemory = new class extends Benchmark {
    constructor() {
        super({
            id: "21_ready-memory",
            label: "ready memory",
            description: "Memory usage after page load.",
            type: BenchmarkType.MEM,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    }
    async run(driver: WebDriver) {
        await testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
    }
    async after(driver: WebDriver, framework: FrameworkData) {
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
    }
}

const benchRunMemory = new class extends Benchmark {
    constructor() {
        super({
            id: "22_run-memory",
            label: "run memory",
            description: "Memory usage after adding 1000 rows.",
            type: BenchmarkType.MEM,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'run');
        await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
    }
}

const benchUpdate5Memory = new class extends Benchmark {
    constructor() {
        super({
            id: "23_update5-memory",
            label: "update eatch 10th row for 1k rows (5 cycles)",
            description: "Memory usage after clicking update every 10th row 5 times",
            type: BenchmarkType.MEM,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    }
    async run(driver: WebDriver) {
        await clickElementById(driver, 'run');
        for (let i = 0; i < 5; i++) {
            await clickElementById(driver, 'update');
            await testTextContains(driver, '//tbody/tr[1]/td[2]/a', ' !!!'.repeat(i));
        }
    }
}

const benchReplace5Memory = new class extends Benchmark {
    constructor() {
        super({
            id: "24_run5-memory",
            label: "replace 1k rows (5 cycles)",
            description: "Memory usage after clicking create 1000 rows 5 times",
            type: BenchmarkType.MEM,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    }
    async run(driver: WebDriver) {
        for (let i = 0; i < 5; i++) {
            await clickElementById(driver, 'run');
            await testTextContains(driver, "//tbody/tr[1000]/td[1]", (1000 * (i + 1)).toFixed());
        }
    }
}

const benchCreateClear5Memory = new class extends Benchmark {
    constructor() {
        super({
            id: "25_run-clear-memory",
            label: "creating/clearing 1k rows (5 cycles)",
            description: "Memory usage after creating and clearing 1000 rows 5 times",
            type: BenchmarkType.MEM,
        })
    }
    async init(driver: WebDriver) {
        await testElementLocatedById(driver, "add", SHORT_TIMEOUT);
    }
    async run(driver: WebDriver) {
        for (let i = 0; i < 5; i++) {
            await clickElementById(driver, 'run');
            await testTextContains(driver, "//tbody/tr[1000]/td[1]", (1000 * (i + 1)).toFixed());
            await clickElementById(driver, 'clear');
            await testElementNotLocatedByXPath(driver, "//tbody/tr[1000]/td[1]");
        }
    }
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

const benchStartupTotalBytes: StartupBenchmarkResult = {
    id: "30_startup-totalbytes",
    label: "total byte weight",
    description: "network transfer cost (post-compression) of all the resources loaded into the page.",
    type: BenchmarkType.STARTUP,
    property: "TotalByteWeight"
}

class BenchStartup extends Benchmark {
    constructor() {
        super({
            id: "30_startup",
            label: "startup time",
            description: "Time for loading, parsing and starting up",
            type: BenchmarkType.STARTUP,
        })
    }
    async init(driver: WebDriver, framework: FrameworkData, port: number) { await driver.get(`http://localhost:` + port + `/`); }
    async run(driver: WebDriver, framework: FrameworkData, port: number) {
        await driver.get(`http://localhost:` + port + `/${framework.uri}/`);
        await testElementLocatedById(driver, "run", SHORT_TIMEOUT);
        return driver.sleep(config.STARTUP_SLEEP_DURATION);
    }
    extractResult(results: LighthouseData[], resultKind: BenchmarkInfo): number[] {
        return results.reduce((a, v) => { a.push(v[(resultKind as StartupBenchmarkResult).property]); return a; }, new Array<number>());
    }
    resultKinds() {
        return [
            benchStartupConsistentlyInteractive,
            benchStartupBootup,
            benchStartupMainThreadWorkCost,
            benchStartupTotalBytes,
        ];
    }
}
const benchStartup = new BenchStartup();

export let benchmarks: [Benchmark] = [
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

export function fileName(framework: FrameworkData, benchmark: BenchmarkInfo) {
    return `${framework.name}_${benchmark.id}.json`;
}
