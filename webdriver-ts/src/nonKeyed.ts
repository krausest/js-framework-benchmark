import * as chrome from 'selenium-webdriver/chrome'
import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import * as yargs from 'yargs';
var chromedriver:any = require('chromedriver');
import {BenchmarkType, Benchmark, benchmarks, fileName} from './benchmarks'
import {setUseShadowRoot, testTextContains, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath} from './webdriverAccess'
import {JSONResult, config, FrameworkData, initializeFrameworks} from './common'

let frameworks = initializeFrameworks();

function buildDriver() {
    let logPref = new logging.Preferences();
    logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    logPref.setLevel(logging.Type.BROWSER, logging.Level.ALL);

    let options = new chrome.Options();
    options = options.addArguments("--js-flags=--expose-gc");
    options = options.addArguments("--disable-infobars");
    options = options.addArguments("--disable-background-networking");
    options = options.addArguments("--disable-cache");
    options = options.addArguments("--disable-extensions");
    options = options.setLoggingPrefs(logPref);
    options = options.setPerfLoggingPrefs(<any>{enableNetwork: false, enablePage: false, traceCategories: "devtools.timeline,blink.user_timing", bufferUsageReportingInterval: 20000});
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

async function runBench(frameworkNames: string[]) {
    let runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.name.indexOf(name)>-1));
    console.log("Frameworks that will be checked", runFrameworks.map(f => f.resultFileName));

    let frameworkMap = new Map<String, FrameworkData>();
    frameworks.forEach(f => frameworkMap.set(f.resultFileName, f));

    for (let i=0;i<runFrameworks.length;i++) {
        let driver = await buildDriver();
        try {
            let framework = runFrameworks[i];
            setUseShadowRoot(framework.useShadowRoot);
            await driver.get(`http://localhost:${config.PORT}/${framework.uri}/`);
            await testElementLocatedById(driver, "add");
            await clickElementById(driver,'run');
            await testTextContains(driver,'//tbody/tr[1000]/td[1]','1000');
            await driver.executeScript(init);
            await driver.executeScript(`window.nonKeyedDetector_setUseShadowDom(${framework.useShadowRoot});`);
            await driver.executeScript('window.nonKeyedDetector_instrument()');
            // swap
            await clickElementById(driver,'swaprows');
            await testTextContains(driver,'//tbody/tr[2]/td[1]','999');
            let res = await driver.executeScript('return nonKeyedDetector_result()');
            let nonKeyedSwap = isNonKeyedSwapRow(res);
            // run
            await driver.executeScript('window.nonKeyedDetector_reset()');
            await clickElementById(driver,'run');
            await testTextContains(driver,'//tbody/tr[1000]/td[1]','2000');
            res = await driver.executeScript('return nonKeyedDetector_result()');
            let nonKeyedRun =isNonKeyedRun(res);
            // remove
            await driver.executeScript('nonKeyedDetector_storeTr()');
            let text = await getTextByXPath(driver, `//tbody/tr[2]/td[2]/a`);
            await driver.executeScript('window.nonKeyedDetector_reset()');
            await clickElementByXPath(driver, `//tbody/tr[2]/td[3]/a/span[1]`);
            await testTextNotContained(driver, `//tbody/tr[2]/td[2]/a`, text);
            res = await driver.executeScript('return nonKeyedDetector_result()');
            let nonKeyedRemove =isNonKeyedRemove(res);
            let nonKeyed = nonKeyedRemove || nonKeyedRun || nonKeyedSwap;
            console.log(framework.resultFileName +" is "+(nonKeyedRun ? "non-keyed" : "keyed")+" for 'run benchmark' and "
            + (nonKeyedRemove ? "non-keyed" : "keyed") + " for 'remove row benchmark' "
            + (nonKeyedSwap ? "non-keyed" : "keyed") + " for 'swap rows benchmark' "
            +". It'll appear as "+(nonKeyed ? "non-keyed" : "keyed")+" in the results");
            if (frameworkMap.get(framework.resultFileName).keyed === nonKeyed) {
                console.log("ERROR: Framework "+framework.resultFileName+" is not correctly categorized in commons.ts");
            }
        } finally {
            await driver.quit();
        }
    }
}

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...]")
.help('help')
.default('check','false')
.default('port', config.PORT)
.array("framework").array("benchmark").argv;

config.PORT = Number(args.port);

let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks);
}

