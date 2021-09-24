import * as yargs from 'yargs';
import {setUseShadowRoot, waitForTextContains, waitForElementLocatedByXpath, waitForElementLocatedById, clickElementById, clickElementByXPath, setUseRowShadowRoot, setShadowRootName, setButtonsInShadowRoot, getElementByXPath, startBrowser, waitForTextNotContained} from './webdriverAccess'
import {config, FrameworkData, initializeFrameworks, BenchmarkOptions} from './common'
import * as R from 'ramda';
import { valid } from 'semver';
import { ElementHandle, Page } from 'puppeteer-core';


let args: any = yargs(process.argv)
    .usage("$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...]")
    .help('help')
    .default('port', config.PORT)
    .string('chromeBinary')
    .string('chromeDriver')
    .boolean('headless')
    .array("framework").argv;

let allArgs = args._.length<=2 ? [] : args._.slice(2,args._.length);

console.log("args.framework", args.framework, !args.framework);
let runBenchmarksFromDirectoryNamesArgs = !args.framework;

let init = `
window.nonKeyedDetector_reset = function() {
    window.nonKeyedDetector_tradded = [];
    window.nonKeyedDetector_trremoved = [];
    window.nonKeyedDetector_removedStoredTr = [];
}

window.nonKeyedDetector_setUseShadowDom = function(useShadowDom ) {
    window.nonKeyedDetector_shadowRoot = useShadowDom;
}

function countDiff(list1, list2) {
    let s = new Set(list1);
    for (let o of list2) {
        s.delete(o);
    }
    return s.size;
}

window.nonKeyedDetector_instrument = function() {
    let node = document;
    if (window.nonKeyedDetector_shadowRoot) {
        let main = document.querySelector(nonKeyedDetector_shadowRoot);
        if (!main) return;
        node = main.shadowRoot;
    }
    var target = node.querySelector('table.table');
    if (!target) return false;

    function filterTRInNodeList(nodeList) {
        let trs = [];
        nodeList.forEach(n => {
            if (n.tagName==='TR') {
                trs.push(n);
                trs = trs.concat(filterTRInNodeList(n.childNodes));
            }
        });
        return trs;
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
                nonKeyedDetector_tradded = nonKeyedDetector_tradded.concat(filterTRInNodeList(mutation.addedNodes));
                nonKeyedDetector_trremoved = nonKeyedDetector_trremoved.concat(filterTRInNodeList(mutation.removedNodes));
                nonKeyedDetector_removedStoredTr = nonKeyedDetector_removedStoredTr.concat(filterTRInNodeList(mutation.removedNodes));
            }
            // console.log(mutation.type, mutation.addedNodes.length, mutation.removedNodes.length, mutation);
        });
    });
    var config = { childList:true, attributes: true, subtree: true, characterData: true };

    observer.observe(target, config);
    return true;
}
window.nonKeyedDetector_result = function() {
    return {tradded: nonKeyedDetector_tradded.length, trremoved: nonKeyedDetector_trremoved.length, removedStoredTr: nonKeyedDetector_removedStoredTr.length, newNodes: countDiff(window.nonKeyedDetector_tradded, window.nonKeyedDetector_trremoved),
    traddedDebug: JSON.stringify(nonKeyedDetector_tradded.map(d => d.innerHTML))};
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

function isKeyedRun(result: any, shouldBeKeyed:boolean): boolean {
    let r = result.tradded>=1000 && result.trremoved>=1000;
    if ((r && !shouldBeKeyed)) {
        console.log(`Non-keyed test for create rows failed. Expected that TRs should be recycled, but there were ${result.tradded} added TRs and ${result.trremoved} were removed`);
    } else if (!r && shouldBeKeyed) {
        console.log(`Keyed test for create rows failed. Expected that 1000 TRs should be removed and added, but there were ${result.tradded} added TRs and ${result.trremoved} were removed`);
    }
    return r;
}
function isKeyedRemove(result: any, shouldBeKeyed:boolean): boolean {
    let r = result.removedStoredTr>0;
    if ((r && !shouldBeKeyed)) {
        console.log(`Non-keyed test for remove failed. Expected that the dom node for the 2nd row would NOT be removed, but it was.`);
    } else if (!r && shouldBeKeyed) {
        console.log(`Keyed test for remove failed. Expected that the dom node for the 2nd row would be removed, but it wasn't`);
    }
    return r;
}
function isKeyedSwapRow(result: any, shouldBeKeyed:boolean): boolean {
  //  console.log("isKeyedSwapRow", result);
    let r = result.tradded>0 && result.trremoved>0 && (!shouldBeKeyed || result.newNodes == 0);
    if ((r && !shouldBeKeyed)) {
        console.log(`Non-keyed test for swap failed. Expected than no TRs are added or removed, but there were ${result.tradded} added and ${result.trremoved} removed`);
    } else if (!r && shouldBeKeyed) {
        if (result.newNodes > 0) {
            console.log(`Keyed test for swap failed. Swap must add the TRs that it removed, but there were ${result.newNodes} new nodes`);
        } else {
            console.log(`Keyed test for swap failed. Expected at least 1 added and 1 removed TR, but there were ${result.tradded} added and ${result.trremoved} removed`);
        }
    }
    return r;
}

function niceEmptyString(val: string[]): string {
    if (!val || val.length===0) return "[empty]";
    if (val.every(v => v.length===0)) return "[empty]";
    return val.toString();
}

async function assertChildNodes(elem: ElementHandle<Element>, expectedNodes: string[], message: string) {
    let allNodes = await elem.evaluate(node => {
        let rec = (node: Element): String[] => {
            let ret = [];
            let nodeList = node.children;
            for(let i = 0; i < nodeList.length; i++) {
                ret.push(nodeList[i].tagName);
                ret.push(...rec(nodeList[i]));
             }
             return ret;
        }
         return rec(node);
    });
    let allNodesLower = allNodes.map(n => n.toLowerCase());
    if (!R.equals(allNodesLower,expectedNodes)) {
        console.log("ERROR in html structure for "+message);
        console.log("  expected:", expectedNodes);
        console.log("  actual  :", allNodes);
        return false;
    }
    return true;
}

async function assertClassesContained(elem: ElementHandle<Element>, expectedClassNames: string[], message: string) {
    let actualClassNames = await (await elem.evaluate(node => node.getAttribute("class"))).split(" ");
    if (!expectedClassNames.every(expected => actualClassNames.includes(expected))) {
        console.log("css class not correct. Expected for "+ message+ " to be "+expectedClassNames+" but was "+niceEmptyString(actualClassNames));
        return false;
    }
    return true;
}

async function findByXPath(page: Page, xpath: string, isInButtonArea: boolean) {
    await waitForElementLocatedByXpath(page, xpath, isInButtonArea);
    let elem = await getElementByXPath(page, xpath, isInButtonArea);
    return elem.asElement();
}

async function getTextByXPath(page: Page, xpath: string, isInButtonArea: boolean) {
    await waitForElementLocatedByXpath(page, xpath, isInButtonArea);
    let elem = await getElementByXPath(page, xpath, isInButtonArea);
    return await elem.evaluate(node => node.textContent);
}




export async function checkTRcorrect(page: Page, timeout = config.TIMEOUT): Promise<boolean> {
    let tr = await findByXPath(page, '//tbody/tr[1000]', false);
    if (!await assertChildNodes(tr, [ 'td', 'td', 'a', 'td', 'a', 'span', 'td' ], "tr")) {
        return false;
    }

    // first td
    let td1 = await findByXPath(page, '//tbody/tr[1000]/td[1]', false);
    if (!await assertClassesContained(td1, ["col-md-1"], "first td")) {
        return false;
    }


    // second td
    let td2 = await findByXPath(page, '//tbody/tr[1000]/td[2]', false);
    if (!await assertClassesContained(td2, ["col-md-4"], "second td")) {
        return false;
    }

    // third td
    let td3 = await findByXPath(page, '//tbody/tr[1000]/td[3]', false);
    if (!await assertClassesContained(td3, ["col-md-1"], "third td")) {
        return false;
    }

    // span in third td
    let span = await findByXPath(page, '//tbody/tr[1000]/td[3]/a/span', false);
    if (!await assertClassesContained(span, ["glyphicon","glyphicon-remove"], "span in a in third td")) {
        return false;
    }
    let spanAria = await span.evaluate(node => node.getAttribute('aria-hidden'));
    if ("true"!=spanAria) {
        console.log("Expected to find 'aria-hidden'=true on span in third td, but found ", spanAria);
        return false;
    }


    // fourth td
    let td4 = await findByXPath(page, '//tbody/tr[1000]/td[4]', false);
    if (!await assertClassesContained(td4, ["col-md-6"], "fourth td")) {
        return false;
    }


    return true;
}

export async function getInnerHTML(page: Page, xpath: string, timeout = config.TIMEOUT): Promise<string> {
    let elem = await findByXPath(page, xpath, false);
    return await elem.evaluate(node => node.innerHTML);
}

async function runBench(frameworkNames: string[]) {
    let runFrameworks;
    if (!runBenchmarksFromDirectoryNamesArgs) {
        let frameworks = await initializeFrameworks();
        runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.fullNameWithKeyedAndVersion.indexOf(name)>-1));
    } else {
        let matchesDirectoryArg = (directoryName: string) => allArgs.length==0 || allArgs.some((arg:string) => arg==directoryName)
        runFrameworks = await initializeFrameworks(matchesDirectoryArg);
    }
    console.log("Frameworks that will be checked", runFrameworks.map(f => f.fullNameWithKeyedAndVersion).join(' '));

    let frameworkMap = new Map<String, FrameworkData>();

    let allCorrect = true;

    for (let i=0;i<runFrameworks.length;i++) {
        let browser = await startBrowser(benchmarkOptions);
        try {
            let framework: FrameworkData = runFrameworks[i];
            setUseShadowRoot(framework.useShadowRoot);
            setUseRowShadowRoot(framework.useRowShadowRoot);
            setShadowRootName(framework.shadowRootName);
            setButtonsInShadowRoot(framework.buttonsInShadowRoot);
    
            const page = await browser.newPage();
            await page.goto(`http://localhost:${benchmarkOptions.port}/${framework.uri}/index.html`);
            await waitForElementLocatedById(page, "add", true);
            await clickElementById(page,'run', true);
            await waitForTextContains(page,'//tbody/tr[1000]/td[1]','1000', false);

            // check html for tr
            let htmlCorrect = await checkTRcorrect(page);
            if (!htmlCorrect) {
                console.log("ERROR: Framework "+framework.fullNameWithKeyedAndVersion+" html is not correct");
                allCorrect = false;
            }

            await page.addScriptTag({content: init});
            if (framework.useShadowRoot) {
              await page.evaluate(`window.nonKeyedDetector_setUseShadowDom("${framework.shadowRootName}");`);
            } else {
              await page.evaluate(`window.nonKeyedDetector_setUseShadowDom(undefined);`);
            }
            await page.evaluate('window.nonKeyedDetector_instrument()');
            // swap
            await page.evaluate('nonKeyedDetector_storeTr()');
            await clickElementById(page,'swaprows', true);
            await waitForTextContains(page,'//tbody/tr[2]/td[1]','999', false);
            let res = await page.evaluate('nonKeyedDetector_result()');
            let keyedSwap = isKeyedSwapRow(res, framework.keyed);
            // run
            await page.evaluate('nonKeyedDetector_storeTr()');
            await page.evaluate('window.nonKeyedDetector_reset()');
            await clickElementById(page,'run', true);
            await waitForTextContains(page,'//tbody/tr[1000]/td[1]','2000', false);
            res = await page.evaluate('nonKeyedDetector_result()');
            let keyedRun =isKeyedRun(res, framework.keyed);
            // remove
            await page.evaluate('nonKeyedDetector_storeTr()');
            let text = await getTextByXPath(page, `//tbody/tr[2]/td[2]/a`, false);
            await page.evaluate('window.nonKeyedDetector_reset()');
            await clickElementByXPath(page, `//tbody/tr[2]/td[3]/a/span[1]`,false);
            await waitForTextNotContained(page, `//tbody/tr[2]/td[2]/a`, text, false);
            res = await page.evaluate('nonKeyedDetector_result()');
            let keyedRemove = isKeyedRemove(res, framework.keyed);
            let keyed = keyedRemove && keyedRun && keyedSwap;
            console.log(framework.fullNameWithKeyedAndVersion +" is "+(keyedRun ? "keyed" : "non-keyed")+" for 'run benchmark' and "
            + (keyedRemove ? "keyed" : "non-keyed") + " for 'remove row benchmark' and "
            + (keyedSwap ? "keyed" : "non-keyed") + " for 'swap rows benchmark' "
            +". It'll appear as "+(keyed ? "keyed" : "non-keyed")+" in the results");
            if (framework.keyed !== keyed) {
                console.log("ERROR: Framework "+framework.fullNameWithKeyedAndVersion+" is not correctly categorized");
                allCorrect = false;
            }
        } catch(e) {
            console.log("ERROR running "+runFrameworks[i].fullNameWithKeyedAndVersion, e);
            allCorrect = false;
        } finally {
            try {
                await browser.close();
            } catch (e) {
                console.log("error calling driver.quit - ignoring this exception");
            }
        }
    }
    if (!allCorrect) process.exit(1)
}

config.PORT = Number(args.port);

let runFrameworks = (args.framework && args.framework.length>0 ? args.framework : [""]).map((v:string) => v.toString());

let benchmarkOptions: BenchmarkOptions = {
    port: config.PORT.toFixed(),
    headless: args.headless,
    numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU,
    numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
    numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
    batchSize: 1
}
async function main() {
    if (args.help) {
        yargs.showHelp();
    } else {
        runBench(runFrameworks);
    }
}

main();
