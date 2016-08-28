import * as chrome from 'selenium-webdriver/chrome'
import {By, until, Builder, WebDriver, Locator} from 'selenium-webdriver'
import * as webdriver from 'selenium-webdriver'
import * as fs from 'fs';
import * as yargs from 'yargs'; 
var chromedriver:any = require('chromedriver');
var jStat:any = require('jstat').jStat;

const REPEAT_RUN = 10;
const DROP_WORST_RUN = 4;
const WARMUP_COUNT = 5;
const TIMEOUT = 60 * 1000;
const LOG_PROGRESS = true;
const LOG_DETAILS = false;
const LOG_DEBUG = false;

interface Timingresult {
    type: string;
    ts: number;
    dur?: number;
    end?: number;
    mem?: number;
}

function clearLogs(driver: WebDriver): webdriver.promise.Promise<void> {
    return driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(entries => {
        if (LOG_DEBUG) {
            let results = entries.forEach(x => 
            {                
                let e = JSON.parse(x.message).message;
                console.log(e);
            });
        }
    });
}

function readLogs(driver: WebDriver): webdriver.promise.Promise<Timingresult[]> {
    return driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(entries => {
        let click : Timingresult = null;
        let lastPaint : Timingresult = null;
        let mem : Timingresult = null;
        let results = entries.forEach(x => 
        {
            let e = JSON.parse(x.message).message;
            if (LOG_DEBUG) console.log(e);
            if (e.params.name==='EventDispatch') {
                if (e.params.args.data.type==="click") {
                    let end = +e.params.ts+e.params.dur;
                    click = {type:'click', ts: +e.params.ts, dur: +e.params.dur, end: end};
                }
            } else if (e.params.name==='Paint') {
                if (click && e.params.ts > click.end) {
                    lastPaint = {type:'paint', ts: +e.params.ts, dur: +e.params.dur, end: +e.params.ts+e.params.dur};
                }
            } else if (e.params.name==='MajorGC' && e.params.args.usedHeapSizeAfter) {
                mem = {type:'gc', ts: +e.params.ts, mem: Number(e.params.args.usedHeapSizeAfter)/1024/1024};
            }
        });
        return [click, lastPaint, mem];
    });
}

enum BenchmarkType { CPU, MEM };

interface Benchmark {
    name: string,
    type: BenchmarkType
    init(driver: WebDriver) : webdriver.promise.Promise<any>;
    run(driver: WebDriver) : webdriver.promise.Promise<any>;
}

// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error: 
// thus we're using a safer way here:
function testTextContains(driver: WebDriver, xpath: string, text: string) {
    return driver.wait(new webdriver.until.Condition<boolean>(`testTextContains ${xpath} ${text}`,
        (driver) => driver.findElement(By.xpath(xpath)).getText().then(
                v => v && v.indexOf(text)>-1,
                err => console.log("ignoring error in testTextContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )                        
    ), TIMEOUT);        
}
function testClassContainsNot(driver: WebDriver, xpath: string, text: string) {
    return driver.wait(new webdriver.until.Condition<boolean>(`testClassContainsNot ${xpath} ${text}`,
        (driver) => driver.findElement(By.xpath(xpath)).getText().then(
                v => v && v.indexOf(text)==-1,
                err => console.log("ignoring error in testClassContainsNot for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )                        
        ), TIMEOUT);        
}

function testClassContains(driver: WebDriver, xpath: string, text: string) {
    return driver.wait(new webdriver.until.Condition<boolean>(`testClassContains ${xpath} ${text}`,
            (driver) => driver.findElement(By.xpath(xpath)).getAttribute("class").then(
            v => v && v.indexOf(text)>-1,
            err => console.log("ignoring error in testClassContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
        )), TIMEOUT); 
}

function testElementLocatedByXpath(driver: WebDriver, xpath: string) {
    return driver.wait(until.elementLocated(By.xpath(xpath)), 3000);
}

function testElementNotLocatedByXPath(driver: WebDriver, xpath: string)
{
    return driver.wait(new webdriver.until.Condition<boolean>(`testElementNotLocatedByXPath ${xpath}`,
        (driver) => driver.isElementPresent(By.xpath(xpath)).then(
            v => !v,
            err => console.log("ignoring error in testElementNotLocatedByXPath for xpath = "+xpath,err.toString().split("\n")[0]))
        ), TIMEOUT);
}

function testElementLocatedById(driver: WebDriver, id: string) {
    return driver.wait(new webdriver.until.Condition<boolean>(`testElementLocatedById ${id}`,
        (driver) => driver.isElementPresent(By.id(id)).then(
            v => v,
            err => console.log("ignoring error in testElementLocatedById for id = "+id,err.toString().split("\n")[0]))
        )
        , TIMEOUT);
}

function retry<T>(retryCount: number, driver: WebDriver, fun : (driver:  WebDriver) => webdriver.promise.Promise<T>):  webdriver.promise.Promise<T> {
    return fun(driver).then(
        val => { return val;},
        err => { console.log("retry failed"); 
            if (retryCount>0) {
                retry(retryCount-1, driver, fun);
            } else {
                throw "Retrying failed"; 
            }
        }
    );
}

function forProm(from: number, to: number, fun : (idx: number) => webdriver.promise.Promise<any>):  webdriver.promise.Promise<any[]> {
    let res: any[] = []; 
    let p = fun(from);
    for (let i=from+1; i<to; i++) {
        p = p.then(val => { res.push(val); return fun(i) });
    }
    return p.then(
        (val) => {
            res.push(val);
            return res;
        }
    );
}

// Stale element prevention. For aurelia even after a testElementLocatedById clickElementById for the same id can fail
// No idea how that can be explained
function clickElementById(driver: WebDriver, id: string) {
    let count = 0;
    return retry(5, driver, (driver) => driver.findElement(By.id(id)).click() );
    // return to(driver.findElement(By.id(id)).click());
}

function clickElementByXPath(driver: WebDriver, xpath: string) {
    let count = 0;
    return retry(5, driver, (driver)=> { count++; 
            if (count>1 && LOG_DETAILS) console.log("clickElementByXPath ",xpath," attempt #",count); 
            return driver.findElement(By.xpath(xpath)).click(); });
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).click());
}
function getTextByXPath(driver: WebDriver, xpath: string): webdriver.promise.Promise<string> {
    let count = 0;
    return retry(5, driver, (driver) => { count++; 
            if (count>1 && LOG_DETAILS) console.log("getTextByXPath ",xpath," attempt #",count); 
            return driver.findElement(By.xpath(xpath)).getText(); });
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).getText());
}

const benchRun: Benchmark = {
    name: "01_run1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) => testElementLocatedById(driver, "add"),
    run: (driver: WebDriver) => 
        clickElementById(driver,"add")
        .then(() => testElementLocatedByXpath(driver,"//tbody/tr[1000]/td[2]/a"))
}

const benchReplaceAll: Benchmark = {
    name:"02_replace1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,'run')
            .then(() => forProm(0, WARMUP_COUNT, () => clickElementById(driver,'run'))),
    run: (driver: WebDriver) => 
            clickElementById(driver,'run')
            .then(() => testTextContains(driver,'//tbody/tr[1]/td[1]','5001'))            
}

const benchUpdate: Benchmark = { 
    name:"03_update10th1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run")
            .then(() => clickElementById(driver,'run'))
            .then(() => forProm(0, WARMUP_COUNT, () => clickElementById(driver,'update'))),
    run: (driver: WebDriver) => 
            clickElementById(driver,'update')
            .then(() => testTextContains(driver,'//tbody/tr[1]/td[2]/a', ' !!!'.repeat(WARMUP_COUNT+1)))
}

const benchSelect: Benchmark = { 
    name:"04_select1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run")
            .then(() => clickElementById(driver,'run'))
            .then(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
            .then(() =>forProm(0, WARMUP_COUNT, (i) => clickElementByXPath(driver,`//tbody/tr[${i+1}]/td[2]/a`))),
    run: (driver: WebDriver) => 
            clickElementByXPath(driver,"//tbody/tr[2]/td[2]/a")
            .then(() => testClassContains(driver,"//tbody/tr[2]", "danger"))
}

const benchSwapRows: Benchmark = { 
    name:"05_swap1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) => {
            let text = '';
            return testElementLocatedById(driver,"run")
            .then(() => clickElementById(driver,'run'))
            .then(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
            .then(() => forProm(0, WARMUP_COUNT, () => 
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
    name:"06_remove-one-1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "run")
            .then(() => clickElementById(driver, 'run'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a"))
            .then(() => forProm(0, WARMUP_COUNT, (i) => clickElementByXPath(driver, `//tbody/tr[${WARMUP_COUNT-i+4}]/td[3]/a`))),
    run: (driver: WebDriver) => {
            let text = '';
            return getTextByXPath(driver, "//tbody/tr[4]/td[2]/a")
            .then(val => text = val)
            .then(() => clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a"))
            .then(() => testClassContainsNot(driver, "//tbody/tr[4]/td[2]/a", text));
    }
}

const benchRunBig: Benchmark = { 
    name: "07_create10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots"),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'runlots')
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a"))
}

const benchAppendToManyRows: Benchmark = { 
    name: "08_create1k-after10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots")
            .then(() => clickElementById(driver, 'runlots'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'add')
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[11000]/td[2]/a"))
}

const benchClear: Benchmark = { 
    name: "09_clear10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots")
            .then(() => clickElementById(driver, 'runlots'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'clear')
            .then(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]"))
}

const benchClear2nd: Benchmark = { 
    name: "10_clear-2nd-time10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots")
            .then(() => clickElementById(driver, 'runlots'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a"))
            .then(() => clickElementById(driver, 'clear'))
            .then(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]")) 
            .then(() => clickElementById(driver, 'runlots'))
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'clear')
            .then(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]"))
}

const benchReadyMemory: Benchmark = { 
    name: "21_ready-memory",
    type: BenchmarkType.MEM,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "add"),
    run: (driver: WebDriver) =>  
            testElementNotLocatedByXPath(driver, "//tbody/tr[1]/td[2]/a")
}

const benchRunMemory: Benchmark = { 
    name: "22_run-memory",
    type: BenchmarkType.MEM,
    init: (driver: WebDriver) =>
           testElementLocatedById(driver, "add"),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'run')
            .then(() => testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a"))
}

let frameworks = [
    "angular-v1.5.7",
    "angular-v2.0.0-rc4",
    "aurelia-v1.0.0-rc1.0.0",
    "bobril-v4.43.0",
    "cyclejs-v7.0.0",
    "domvm-v1.2.9",
    "inferno-v0.7.13",
    "kivi-v1.0.0-rc0",
    "mithril-v0.2.5",
    "mithril-v1.0.0-alpha",
    "mithril-v0.2.5",
    "plastiq-v1.30.1",
    "preact-v4.8.0",
    "ractive-v0.7.3",
    "react-lite-v0.15.14",
    "react-v15.3.0",
    "react-v15.3.0-mobX-v2.4.2",
    "riot-v2.5.0",
    "tsers-v1.0.0",
    "vanillajs",
    "vidom-v0.3.18",
    "vue-v1.0.26",
    "vue-v2.0.0-beta1"        
];

let benchmarks : [ Benchmark ] = [
    benchRun,
    benchReplaceAll,
    benchUpdate,
    benchSelect,
    benchSwapRows,
    benchRemove,
    benchRunBig,
    benchAppendToManyRows,
    benchClear,
    benchClear2nd,
    benchReadyMemory,
    benchRunMemory
    ];

function buildDriver() {
    let logPref = new webdriver.logging.Preferences();
    logPref.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
    // logPref.setLevel(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL);

    let options = new chrome.Options();
    // options = options.setChromeBinaryPath("/Applications/Chromium.app/Contents/MacOS/Chromium");
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.setLoggingPrefs(logPref);
    options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, enableTimeline: false, traceCategories: "browser,devtools.timeline,devtools", bufferUsageReportingInterval: 1000});

    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)    
        .build();
}

function reduceBenchmarkResults(benchmark: Benchmark, results: Timingresult[][]): number[] {
    if (LOG_DEBUG) console.log("data for reduceBenchmarkResults", results);
        if (benchmark.type === BenchmarkType.CPU) {
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat((val[1].end - val[0].ts)/1000.0), []);
        } else {
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat([val[2].mem]), []);
        }
}

function runBenchmark(driver: WebDriver, benchmark: Benchmark, framework: string) : webdriver.promise.Promise<any> {
    return benchmark.run(driver)
        .then(() => {
            if (LOG_PROGRESS) console.log("after run ",benchmark.name, benchmark.type, framework);
            if (benchmark.type === BenchmarkType.MEM) {
                return driver.executeScript("window.gc();");
            }            
        })
        .then(() => readLogs(driver))
        .then((results) => {if (LOG_PROGRESS) console.log(`result ${framework}_${benchmark.name}`, results); return results});
}

function initBenchmark(driver: WebDriver, benchmark: Benchmark, framework: string) : webdriver.promise.Promise<any> {
    return benchmark.init(driver)
    .then(() => {
        if (LOG_PROGRESS) console.log("after initialized ",benchmark.name, benchmark.type, framework);                                 
        if (benchmark.type === BenchmarkType.MEM) {
            return driver.executeScript("window.gc();");
        }
    })
    .thenCatch( (err) => {
        console.log(`error in initBenchmark ${framework} ${benchmark.name}`);
        throw err;
    });
}

interface Result {
    framework: string;
    results: number[];
    benchmark: Benchmark    
}

function writeResult(res: Result) {
    let benchmark = res.benchmark;
        let framework = res.framework;
        let data = res.results;
        data = data.splice(0).sort((a:number,b:number) => a-b);
        data = data.slice(0, REPEAT_RUN - DROP_WORST_RUN);
        let s = jStat(data);
        console.log(`result ${framework}_${benchmark.name}`, s.min(), s.max(), s.mean(), s.stdev());
        let result = {
            "framework": framework,
            "benchmark": benchmark.name,
            "type": benchmark.type === BenchmarkType.CPU ? "cpu" : "memory",
            "min": s.min(),
            "max": s.max(),
            "mean": s.mean(),
            "geometricMean": s.geomean(),
            "standardDeviation": s.stdev()
        }
        fs.writeFileSync(`results/${framework}_${benchmark.name}.json`, JSON.stringify(result), {encoding: "utf8"});
}

function runBench(frameworkNames: string[], benchmarkNames: string[]): webdriver.promise.Promise<any> {
    let runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.indexOf(name)>-1));
    let runBenchmarks = benchmarks.filter(b => benchmarkNames.some(name => b.name.toLowerCase().indexOf(name)>-1));
    console.log("Frameworks that will be benchmarked", runFrameworks);
    console.log("Benchmarks that will be run", runBenchmarks.map(b => b.name));

    let data : [[string,Benchmark]] = <any>[];
    for (let i=0;i<runFrameworks.length;i++) {
       for (let j=0;j<runBenchmarks.length;j++) {
           data.push( [runFrameworks[i], runBenchmarks[j]] );
       }
    }

    return forProm(0, data.length, (i) => {
        let framework = data[i][0];
        let benchmark = data[i][1];
        console.log("benchmarking ", framework, benchmark.name);
        let driver = buildDriver();
        return forProm(0, REPEAT_RUN, () => {
            return driver.get(`http://localhost:8080/${framework}/`)
            .then(() => initBenchmark(driver, benchmark, framework))
            .then(() => clearLogs(driver))
            .then(() => runBenchmark(driver, benchmark, framework))
        })
        .then(results => reduceBenchmarkResults(benchmark, results))
        .then(results => {  
            writeResult({framework: framework, results: results, benchmark: benchmark});
        })
        .thenFinally(() => {console.log("QUIT"); driver.quit();})
    });
}

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...] [--benchmark Benchmark1,Benchmark2,...]")
.help('help')
.array("framework").array("benchmark").argv;

let runBenchmarks = args.benchmark && args.benchmark.length>0 ? args.benchmark : [""];
let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];

if (!fs.existsSync("results"))
    fs.mkdirSync("results");

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks, runBenchmarks);
}

