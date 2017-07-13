import * as chrome from 'selenium-webdriver/chrome'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import * as yargs from 'yargs'; 
var chromedriver:any = require('chromedriver');
import {BenchmarkType, Benchmark, benchmarks, fileName} from './benchmarks'
import {setUseShadowRoot, testTextContains, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath, forProm} from './webdriverAccess'
import {JSONResult, config, FrameworkData, frameworks} from './common'

function buildDriver() {
    let logPref = new logging.Preferences();
    logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);

    let options = new chrome.Options();
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.setLoggingPrefs(logPref);
    options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, enableTimeline: false, traceCategories: "browser,devtools.timeline,devtools", bufferUsageReportingInterval: 1000});

    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)    
        .build();
}

let init = `
window.nonKeyedDetector_reset = function() {
    window.nonKeyedDetector_tradded = 0;
    window.nonKeyedDetector_trremoved = 0;
    window.nonKeyedDetector_removedStoredTr = 0;
}

window.nonKeyedDetector_setUseShadowDom = function(useShadowDom ) {
    window.nonKeyedDetector_shadowRoot = useShadowDom;
}

window.nonKeyedDetector_instrument = function() {
    let node = document;
    if (window.nonKeyedDetector_shadowRoot) {
        let main = document.querySelector("main-element");
        if (!main) return;
        node = main.shadowRoot;
    }
    var target = node.querySelector('table.table');
    if (!target) return false;

    function countTRInNodeList(nodeList) {
        let trCount = 0;
        nodeList.forEach(n => {
            if (n.tagName==='TR') {
                trCount += 1 + countTRInNodeList(n.childNodes);
            }
        });
        return trCount;
    }

    function countSelectedTRInNodeList(nodeList) {
        let trFoundCount = 0;
        nodeList.forEach(n => {
            if (n==window.storedTr) {
                trFoundCount +=1;
            }                        
        });       
        return trFoundCount; 
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') { 
                nonKeyedDetector_tradded += countTRInNodeList(mutation.addedNodes);
                nonKeyedDetector_trremoved += countTRInNodeList(mutation.removedNodes);
                nonKeyedDetector_removedStoredTr += countSelectedTRInNodeList(mutation.removedNodes)
            }
            // console.log(mutation.type, mutation.addedNodes.length, mutation.removedNodes.length, mutation);
        });    
    });
    var config = { childList:true, attributes: true, subtree: true, characterData: true };
    
    observer.observe(target, config);
    return true;
}
window.nonKeyedDetector_result = function() {
    return {tradded: nonKeyedDetector_tradded, trremoved: nonKeyedDetector_trremoved, removedStoredTr: nonKeyedDetector_removedStoredTr};
}
window.nonKeyedDetector_storeTr = function() {
    let node = document;
    if (window.nonKeyedDetector_shadowRoot) {
        let main = document.querySelector("main-element");
        if (main) node = main.shadowRoot;
    }
    window.storedTr = node.querySelector('tr:nth-child(2)');
}
window.nonKeyedDetector_reset();
`;

function isNonKeyedRun(result: any): boolean {
    if (result.tradded>0 && result.trremoved>0) return false;
    return true;
}
function isNonKeyedRemove(result: any): boolean {
    if (result.removedStoredTr>0) return false;
    return true;
}
function isNonKeyedSwapRow(result: any): boolean {
    if (result.tradded>0 && result.trremoved>0) return false;
    return true;
}

function runBench(frameworkNames: string[]) {
    let runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.name.indexOf(name)>-1));
    console.log("Frameworks that will be checked", runFrameworks.map(f => f.name));

    let frameworkMap = new Map<String, FrameworkData>();
    frameworks.forEach(f => frameworkMap.set(f.name, f));

    return forProm(0, runFrameworks.length, (i) => {
        let framework = runFrameworks[i];
        let driver = buildDriver();
        let text: string;
        let nonKeyedRun = false, nonKeyedRemove = false, nonKeyedSwap = false;
        setUseShadowRoot(framework.useShadowRoot);
        return driver.get(`http://localhost:8080/${framework.uri}/`)
            .then(() => testElementLocatedById(driver, "add"))
            .then(() => clickElementById(driver,'run'))
            .then(() => testTextContains(driver,'//tbody/tr[1000]/td[1]','1000'))
            .then(() => driver.executeScript(init))
            .then(() => driver.executeScript(`window.nonKeyedDetector_setUseShadowDom(${framework.useShadowRoot});`))
            .then(() => driver.executeScript('window.nonKeyedDetector_instrument()'))
            // swap
            .then(() => clickElementById(driver,'swaprows'))
            .then(() => testTextContains(driver,'//tbody/tr[10]/td[1]','5'))
            .then(() => driver.executeScript('return nonKeyedDetector_result()'))
            .then(res => {nonKeyedSwap =isNonKeyedSwapRow(res); /*console.log(res);*/ })
            // run
            .then(() => driver.executeScript('window.nonKeyedDetector_reset()'))
            .then(() => clickElementById(driver,'run'))
            .then(() => testTextContains(driver,'//tbody/tr[1000]/td[1]','2000'))
            .then(() => driver.executeScript('return nonKeyedDetector_result()'))
            .then(res => {nonKeyedRun =isNonKeyedRun(res); /*console.log(res);*/ })
            // remove
            .then(() => driver.executeScript('nonKeyedDetector_storeTr()'))
            .then(() => getTextByXPath(driver, `//tbody/tr[2]/td[2]/a`))
            .then(val => {text = val;} )
            .then(() => driver.executeScript('window.nonKeyedDetector_reset()'))
            .then(() => clickElementByXPath(driver, `//tbody/tr[2]/td[3]/a/span[1]`))
            .then(() => testTextNotContained(driver, `//tbody/tr[2]/td[2]/a`, text))
            .then(() => driver.executeScript('return nonKeyedDetector_result()'))
            .then(res => {nonKeyedRemove =isNonKeyedRemove(res); /*console.log(res);*/ })
            .then(() => {
                    let nonKeyed = nonKeyedRemove || nonKeyedRun || nonKeyedSwap;
                    console.log(framework.name +" is "+(nonKeyedRun ? "non-keyed" : "keyed")+" for 'run benchmark' and " 
                    + (nonKeyedRemove ? "non-keyed" : "keyed") + " for 'remove row benchmark' "
                    + (nonKeyedSwap ? "non-keyed" : "keyed") + " for 'swap rows benchmark' "
                    +". It'll appear as "+(nonKeyed ? "non-keyed" : "keyed")+" in the results");
                    if (frameworkMap.get(framework.name).keyed === nonKeyed) {
                        console.log("ERROR: Framework "+framework.name+" is not correctly categorized in commons.ts");
                    }
            })        
            .then(() => {driver.quit();}, () => {driver.quit();})
    })
}

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...]")
.help('help')
.default('check','false')
.array("framework").array("benchmark").argv;

let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks);
}
// console.log(promise.Promise);
//         let driver = buildDriver();
// forProm(1, 10, (idx) => {
//     return new promise.Promise((resolve, reject) => {
//         console.log("starting ",idx);
//         setTimeout(() => {
//             console.log("resolve ",idx);            
//             resolve(idx);
//         }, Math.random()*1000);
//     })
// }).then(val => {    
//     console.log(val);
// })
