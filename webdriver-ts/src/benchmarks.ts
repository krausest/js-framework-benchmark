import {testTextContains, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath, forProm} from './webdriverAccess'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import {config, FrameworkData} from './common'

export enum BenchmarkType { CPU, MEM, STARTUP };

const SHORT_TIMEOUT = 1000;

export interface Benchmark {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
    init(driver: WebDriver, framework: FrameworkData) : promise.Promise<any>;
    run(driver: WebDriver, framework: FrameworkData) : promise.Promise<any>;
}

const benchRun: Benchmark = {
    id: "01_run1k",
    label: "create rows",
    description: "Duration for creating 1000 rows after the page loaded.",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) => testElementLocatedById(driver, "add", SHORT_TIMEOUT),    
    run: (driver: WebDriver) => 
        clickElementById(driver,"add")
        .then(() => testElementLocatedByXpath(driver,"//tbody/tr[1000]/td[2]/a")),
}

const benchReplaceAll: Benchmark = {
    id:"02_replace1k",
    label: "replace all rows",
    description: "Duration for updating all 1000 rows of the table (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,'run', SHORT_TIMEOUT)
            .then(() => forProm(0, config.WARMUP_COUNT, () => clickElementById(driver,'run'))),
    run: (driver: WebDriver) => 
            clickElementById(driver,'run')
            .then(() => testTextContains(driver,'//tbody/tr[1]/td[1]','5001'))            
}

const benchUpdate: Benchmark = { 
    id:"03_update10th1k",
    label: "partial update",
    description: "Time to update the text of every 10th row (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run", SHORT_TIMEOUT)
            .then(() => clickElementById(driver,'run'))
            .then(() => forProm(0, config.WARMUP_COUNT, () => clickElementById(driver,'update'))),
    run: (driver: WebDriver) => 
            clickElementById(driver,'update')
            .then(() => testTextContains(driver,'//tbody/tr[1]/td[2]/a', ' !!!'.repeat(config.WARMUP_COUNT+1)))
}

const benchSelect: Benchmark = { 
    id:"04_select1k",
    label: "select row",
    description: "Duration to highlight a row in response to a click on the row. (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run", SHORT_TIMEOUT)
            .then(() => clickElementById(driver,'run'))
            .then(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
            .then(() =>forProm(0, config.WARMUP_COUNT, (i) => clickElementByXPath(driver,`//tbody/tr[${i+1}]/td[2]/a`))),
    run: (driver: WebDriver) => 
            clickElementByXPath(driver,"//tbody/tr[2]/td[2]/a")
            .then(() => testClassContains(driver,"//tbody/tr[2]", "danger"))
}

const benchSwapRows: Benchmark = { 
    id:"05_swap1k",
    label: "swap rows",
    description: "Time to swap 2 rows on a 1K table. (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) => {
            let text = '';
            return testElementLocatedById(driver,"run", SHORT_TIMEOUT)
            .then(() => clickElementById(driver,'run'))
            .then(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
            .then(() => forProm(0, config.WARMUP_COUNT, () => 
                getTextByXPath(driver,"//tbody/tr[5]/td[2]/a")
                .then(val => text = val)
                .then(() => clickElementById(driver,'swaprows'))
                .then(() => testTextContains(driver,"//tbody/tr[10]/td[2]/a", text))));
            },
    run: (driver: WebDriver) => {
            let text = '';
            return getTextByXPath(driver,"//tbody/tr[5]/td[2]/a")
            .then(val => text = val)
            .then(() => clickElementById(driver,'swaprows'))
            .then(() => testTextContains(driver,"//tbody/tr[10]/td[2]/a", text))
    }
}

const benchRemove: Benchmark = { 
    id:"06_remove-one-1k",
    label: "remove row",
    description: "Duration to remove a row. (with "+config.WARMUP_COUNT+" warmup iterations).",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "run", SHORT_TIMEOUT)
            .then(() => clickElementById(driver, 'run'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a"))
            .then(() => forProm(0, config.WARMUP_COUNT, (i) => {
                return testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT-i+4}]/td[1]`, (config.WARMUP_COUNT-i+4).toString())
                .then(() => clickElementByXPath(driver, `//tbody/tr[${config.WARMUP_COUNT-i+4}]/td[3]/a/span[1]`))
                .then(() => testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT-i+4}]/td[1]`, '10'));
            }))             
            .then(() => 
                testTextContains(driver, '//tbody/tr[5]/td[1]', '10')
                .then(() => testTextContains(driver, '//tbody/tr[4]/td[1]', '4'))
            ),
    run: (driver: WebDriver) => {
            let text = '';            
            return clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]")
            .then(() => testTextContains(driver, '//tbody/tr[4]/td[1]', '10'));
    }
}

const benchRunBig: Benchmark = { 
    id: "07_create10k",
    label: "create many rows",
    description: "Duration to create 10,000 rows",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots", SHORT_TIMEOUT),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'runlots')
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a"))
}

const benchAppendToManyRows: Benchmark = { 
    id: "08_create1k-after10k",
    label: "append rows to large table",
    description: "Duration for adding 1000 rows on a table of 10,000 rows.",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots", SHORT_TIMEOUT)
            .then(() => clickElementById(driver, 'runlots'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'add')
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[11000]/td[2]/a"))
}

const benchClear: Benchmark = { 
    id: "09_clear10k",
    label: "clear rows",
    description: "Duration to clear the table filled with 10.000 rows.",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots", SHORT_TIMEOUT)
            .then(() => clickElementById(driver, 'runlots'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'clear')
            .then(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]"))
}

const benchReadyMemory: Benchmark = { 
    id: "21_ready-memory",
    label: "ready memory",
    description: "Memory usage after page load.",
    type: BenchmarkType.MEM,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "add", SHORT_TIMEOUT),
    run: (driver: WebDriver) =>  
            testElementNotLocatedByXPath(driver, "//tbody/tr[1]")
}

const benchRunMemory: Benchmark = { 
    id: "22_run-memory",
    label: "run memory",
    description: "Memory usage after adding 1000 rows.",
    type: BenchmarkType.MEM,
    init: (driver: WebDriver) =>
           testElementLocatedById(driver, "add", SHORT_TIMEOUT),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'run')
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a"))
}

const benchStartup: Benchmark = { 
    id: "30_startup",
    label: "startup time",
    description: "Time for loading, parsing and starting up",
    type: BenchmarkType.STARTUP,
    init: (driver: WebDriver) =>
           driver.get(`http://localhost:8080/`),
    run: (driver: WebDriver, framework: FrameworkData) => 
            driver.get(`http://localhost:8080/${framework.uri}/`)
            .then(() => testElementLocatedById(driver, "run", SHORT_TIMEOUT))
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
    benchStartup
    ];

export function fileName(framework :FrameworkData, benchmark: Benchmark) {
    return `${framework.name}_${benchmark.id}.json`;
}    