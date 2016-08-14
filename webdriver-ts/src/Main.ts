import * as chrome from 'selenium-webdriver/chrome'
import {By, until, Builder, WebDriver, Locator} from 'selenium-webdriver'
import * as webdriver from 'selenium-webdriver'
import * as Rx from 'rxjs';
import * as fs from 'fs';
import * as yargs from 'yargs'; 
var chromedriver:any = require('chromedriver');
var jStat:any = require('jStat').jStat;

const REPEAT_RUN = 10;
const DROP_WORST_RUN = 4;
const WARMUP_COUNT = 5;
const TIMEOUT = 60 * 1000;
const LOG_PROGRESS = true;
const LOG_DETAILS = true;
const LOG_DEBUG = false;

interface Timingresult {
    type: string;
    ts: number;
    dur?: number;
    end?: number;
    mem?: number;
}

function clearLogs(driver: WebDriver): Rx.Observable<void> {
    return Rx.Observable.create((observer: Rx.Observer<Timingresult>) => {
        driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(entries => {
            if (LOG_DEBUG) {
                let results = entries.forEach(x => 
                {                
                    let e = JSON.parse(x.message).message;
                    console.log(e);
                });
            }
            observer.next(null);
            observer.complete();
        });
    });
}

function readLogs(driver: WebDriver): Rx.Observable<Timingresult[]> {
    return Rx.Observable.create((observer: Rx.Observer<Timingresult[]>) => {
        driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(entries => {
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
            observer.next([click, lastPaint, mem]);
            observer.complete();
        });
    });
}

function to<T>(p : webdriver.promise.Promise<T>) : Rx.Observable<T> {
    return Rx.Observable.create((observer: Rx.Observer<T>) => {
        p.then(res => {observer.next(res); observer.complete();},
                err => {
                    if (LOG_DETAILS) console.log("error waiting for promise",err.toString().split("\n")[0]); 
                    observer.error(err); 
            });
    });
}

enum BenchmarkType { CPU, MEM };

interface Benchmark {
    name: string,
    type: BenchmarkType
    init(driver: WebDriver) : Rx.Observable<any>;
    run(driver: WebDriver) : Rx.Observable<any>;
}

// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error: 
// thus we're using a safer way here:
function testTextContains(driver: WebDriver, xpath: string, text: string) {
    return to(driver.wait(new webdriver.until.Condition<boolean>("wait for text",
        (driver) => driver.findElement(By.xpath(xpath)).getText().then(
                v => v && v.indexOf(text)>-1,
                err => console.log("error in testTextContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )                        
    ), TIMEOUT));        
}
function testClassContainsNot(driver: WebDriver, xpath: string, text: string) {
    return to(driver.wait(new webdriver.until.Condition<boolean>("wait for text",
        (driver) => driver.findElement(By.xpath(xpath)).getText().then(
                v => v && v.indexOf(text)==-1,
                err => console.log("error in testClassContainsNot for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )                        
        ), TIMEOUT));        
}

function testClassContains(driver: WebDriver, xpath: string, text: string) {
    return to(driver.wait(new webdriver.until.Condition<boolean>("wait for class",
            (driver) => driver.findElement(By.xpath(xpath)).getAttribute("class").then(
                v => v && v.indexOf(text)>-1,
                err => console.log("error in testClassContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )
        ), TIMEOUT)); 
}

function testElementLocatedByXpath(driver: WebDriver, xpath: string) {
    return to(driver.wait(until.elementLocated(By.xpath(xpath)), TIMEOUT));
}

function testElementNotLocatedByXPath(driver: WebDriver, xpath: string)
{
    return to(driver.wait(new webdriver.until.Condition<boolean>("wait for not locatable",
        (driver) => driver.isElementPresent(By.xpath(xpath)).then(
                        v => !v,
                        err => console.log("error in testElementNotLocatedByXPath for xpath = "+xpath,err.toString().split("\n")[0])                        
                        )
        ), TIMEOUT));
}

function testElementLocatedById(driver: WebDriver, id: string) {
    console.log("testElementLocatedById", id);
    return to(driver.wait(new webdriver.until.Condition<boolean>("wait for not locatable",
        (driver) => driver.isElementPresent(By.id(id)).then(
                        v => true,
                        err => console.log("error in testElementLocatedById for id = "+id,err.toString().split("\n")[0])                        
                        )
        ), TIMEOUT)).do((v) => console.log("result of testElementLocatedById for id",id,v));
}

// Stale element prevention. For aurelia even after a testElementLocatedById clickElementById for the same id can fail
// No idea how that can be explained
function clickElementById(driver: WebDriver, id: string) {
    let count = 0;
    return Rx.Observable.of([1])
        .concatMap(() => { count++; 
            if (count>1 && LOG_DETAILS) console.log("clickElementById ",id," attempt #",count); 
            return to(driver.findElement(By.id(id)).click()); })
        .retry(5);
    // return to(driver.findElement(By.id(id)).click());
}

function clickElementByXPath(driver: WebDriver, xpath: string) {
    let count = 0;
    return Rx.Observable.of([1])
        .concatMap(() => { count++; 
            if (count>1 && LOG_DETAILS) console.log("clickElementByXPath ",xpath," attempt #",count); 
            return to(driver.findElement(By.xpath(xpath)).click()); })
        .retry(5);
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).click());
}
function getTextByXPath(driver: WebDriver, xpath: string) {
    let count = 0;
    return Rx.Observable.of([1])
        .concatMap(() => { count++; 
            if (count>1 && LOG_DETAILS) console.log("getTextByXPath ",xpath," attempt #",count); 
            return to(driver.findElement(By.xpath(xpath)).getText()); })
        .retry(5);
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).getText());
}

const benchRun: Benchmark = {
    name: "01_run1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) => testElementLocatedById(driver, "add"),
    run: (driver: WebDriver) => 
        clickElementById(driver,"add")
        .concatMap(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
}

const benchReplaceAll: Benchmark = {
    name:"02_replace1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,'run')
            .concatMap(() => Rx.Observable.range(0, WARMUP_COUNT))
            .concatMap(() => clickElementById(driver,'run')),
    run: (driver: WebDriver) => 
            clickElementById(driver,'run')
            .concatMap(() => testTextContains(driver,'//tbody/tr[1]/td[1]','5001'))            
}

const benchUpdate: Benchmark = { 
    name:"03_update10th1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run")
            .concatMap(() => clickElementById(driver,'run'))
            .concatMap(() => Rx.Observable.range(0, WARMUP_COUNT))
            .concatMap(() => clickElementById(driver,'update')),
    run: (driver: WebDriver) => 
            clickElementById(driver,'update')
            .concatMap(() => testTextContains(driver,'//tbody/tr[1]/td[2]/a', ' !!!'.repeat(WARMUP_COUNT+1)))
}

const benchSelect: Benchmark = { 
    name:"04_select1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run")
            .concatMap(() => clickElementById(driver,'run'))
            .concatMap(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
            .concatMap(() => Rx.Observable.range(0, WARMUP_COUNT))
            .concatMap((i) => clickElementByXPath(driver,`//tbody/tr[${i+1}]/td[2]/a`)),
    run: (driver: WebDriver) => 
            clickElementByXPath(driver,"//tbody/tr[2]/td[2]/a")
            .concatMap(() => testClassContains(driver,"//tbody/tr[2]", "danger"))
}

const benchSwapRows: Benchmark = { 
    name:"05_swap1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver,"run")
            .concatMap(() => clickElementById(driver,'run'))
            .concatMap(() => testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a"))
            .concatMap(() => Rx.Observable.range(0, WARMUP_COUNT))
            .concatMap(() => getTextByXPath(driver,"//tbody/tr[5]/td[2]/a"))
            .concatMap(() => clickElementById(driver,'swaprows'), (text, _) => text)
            .concatMap((txt) => testTextContains(driver,"//tbody/tr[10]/td[2]/a", txt)),
    run: (driver: WebDriver) => 
            getTextByXPath(driver,"//tbody/tr[5]/td[2]/a")
            .concatMap(() => clickElementById(driver,'swaprows'), (text, _) => text)
            .concatMap((txt) => testTextContains(driver,"//tbody/tr[10]/td[2]/a", txt))
}

const benchRemove: Benchmark = { 
    name:"06_remove-one-1k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "run")
            .concatMap(() => clickElementById(driver, 'run'))
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a"))
            .concatMap(() => Rx.Observable.range(0, WARMUP_COUNT))
            .concatMap((i) => clickElementByXPath(driver, `//tbody/tr[${WARMUP_COUNT-i+4}]/td[3]/a`)),
    run: (driver: WebDriver) => 
            getTextByXPath(driver, "//tbody/tr[4]/td[2]/a")
            .concatMap((text) => clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a"), (text,_) => text)
            .concatMap((txt) => testClassContainsNot(driver, "//tbody/tr[4]/td[2]/a", txt))
}

const benchRunBig: Benchmark = { 
    name: "07_create10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots"),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'runlots')
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a"))
}

const benchAppendToManyRows: Benchmark = { 
    name: "08_create1k-after10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots")
            .concatMap(() => clickElementById(driver, 'runlots'))
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'add')
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[11000]/td[2]/a"))
}

const benchClear: Benchmark = { 
    name: "09_clear10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots")
            .concatMap(() => clickElementById(driver, 'runlots'))
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'clear')
            .concatMap(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]"))
}

const benchClear2nd: Benchmark = { 
    name: "10_clear-2nd-time10k",
    type: BenchmarkType.CPU,
    init: (driver: WebDriver) =>
            testElementLocatedById(driver, "runlots")
            .concatMap(() => clickElementById(driver, 'runlots'))
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a"))
            .concatMap(() => clickElementById(driver, 'clear'))
            .concatMap(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]")) 
            .concatMap(() => clickElementById(driver, 'runlots'))
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a")),
    run: (driver: WebDriver) => 
            clickElementById(driver, 'clear')
            .concatMap(() =>  testElementNotLocatedByXPath(driver, "//tbody/tr[1]"))
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
            .concatMap(() => testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a"))
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
    "react-v15.3.0",
    "react-v15.3.0-mobX-v2.4.2",
    "react-lite-v0.15.14",
    // "riot-v2.5.0",
    "tsers-v1.0.0",
    "vanillajs",
    "vidom-v0.3.14",
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

function reduceBenchmarkResults(benchmark: Benchmark, results: Rx.Observable<Timingresult[]>): Rx.Observable<number[]> {
        if (benchmark.type === BenchmarkType.CPU) {
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat((val[1].end - val[0].ts)/1000.0), []);
        } else {
            return results.reduce((acc: number[], val: Timingresult[]): number[] => acc.concat([val[2].mem]), []);
        }
}

function runBenchmark(driver: WebDriver, benchmark: Benchmark, framework: string) : Rx.Observable<Timingresult[]> {
    return benchmark.run(driver)
        // eliminate any repeats
        .last()
        .concatMap(() => { 
            if (LOG_PROGRESS) console.log("after run ",benchmark.name, benchmark.type, framework);
            if (benchmark.type === BenchmarkType.MEM) {
                return to(driver.executeScript("window.gc();"));
            } else {
                return Rx.Observable.of(undefined);
        }})
        .concatMap(() => readLogs(driver))
        .do((results) => {if (LOG_PROGRESS) console.log(`result ${framework}_${benchmark.name}`, results)});
}

function initBenchmark(driver: WebDriver, benchmark: Benchmark, framework: string) : Rx.Observable<void> {
    return benchmark.init(driver)
        // eliminate any repeats
        .last()
        .concatMap(() => {
            if (LOG_PROGRESS) console.log("after initialized ",benchmark.name, benchmark.type, framework);                                 
            if (benchmark.type === BenchmarkType.MEM) {
                return to(driver.executeScript("window.gc();"));
            } else {
                return Rx.Observable.of(undefined);
        }})
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

function runBench(frameworkNames: string[], benchmarkNames: string[]): void {
    let runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.indexOf(name)>-1));
    let runBenchmarks = benchmarks.filter(b => benchmarkNames.some(name => b.name.toLowerCase().indexOf(name)>-1));
    console.log("Frameworks that will be benchmarked", runFrameworks);
    console.log("Benchmarks that will be run", runBenchmarks.map(b => b.name));

    Rx.Observable.from(runFrameworks)
    .concatMap(framework => {
        return Rx.Observable.from(runBenchmarks)            
            .concatMap(benchmark => {
                let driver = buildDriver();
                let benches = Rx.Observable.range(0, REPEAT_RUN)
                        .concatMap(() => 
                            Rx.Observable.from(to(driver.get(`http://localhost:8080/${framework}/`)))
                            .do(() => {if (LOG_PROGRESS) console.log("before init ",benchmark.name, benchmark.type, framework); })
                            .concatMap(() => initBenchmark(driver, benchmark, framework))
                            .concatMap(() => clearLogs(driver))
                            .do(() => {if (LOG_PROGRESS) console.log("before running",benchmark.name, benchmark.type, framework);})
                            .concatMap(() => runBenchmark(driver, benchmark, framework)));
                return reduceBenchmarkResults(benchmark, benches)                 
                        .do(() => {console.log("QUIT"); driver.quit();})
                        .map(results => ({framework: framework, results: results, benchmark: benchmark}));
            })
    }).subscribe(
        (res) => writeResult(res),
        (err: any) => { 
            console.log("ERROR", err); 
        },
        () => {
            console.log("finished");   
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

