import * as yargs from "yargs";
import { checkElementContainsText, checkElementExists, clickElement, startBrowser } from "./playwrightAccess";
import { config, FrameworkData, initializeFrameworks, BenchmarkOptions } from "./common";
import { WebDriver, By, WebElement, logging } from "selenium-webdriver";

import * as R from "ramda";
import { valid } from "semver";
import { ElementHandle, Page } from "playwright";

let args: any = yargs(process.argv)
  .usage("$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...]")
  .help("help")
  .default("port", config.PORT)
  .string("chromeBinary")
  .string("chromeDriver")
  .boolean("headless")
  .array("framework").argv;

let allArgs = args._.length <= 2 ? [] : args._.slice(2, args._.length);

console.log("args.framework", args.framework, !args.framework);

// necessary to launch without specifiying a path
var chromedriver: any = require("chromedriver");

let init = (shadowRootName: string) => `
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
    return {tradded: nonKeyedDetector_tradded.length, trremoved: nonKeyedDetector_trremoved.length, removedStoredTr: nonKeyedDetector_trremoved.indexOf(window.storedTr)>-1, newNodes: countDiff(window.nonKeyedDetector_tradded, window.nonKeyedDetector_trremoved),
//      storedTr_debug: window.storedTr.innerText, trremoved_debug: nonKeyedDetector_trremoved.map(t => t.innerText).join(","),
//      traddedDebug: JSON.stringify(nonKeyedDetector_tradded.map(d => d.innerHTML))
    };
}
window.nonKeyedDetector_storeTr = function() {
    let node = document;
    if (window.nonKeyedDetector_shadowRoot) {
        let main = document.querySelector('${shadowRootName}');
        if (main) node = main.shadowRoot;
    }
    // Workaround: alpine adds a template with a tr inside the tbody. tr:nth-child(1) seems to be the tr from the template and returns null here.
    let index = node.querySelector('tr:nth-child(1)') ? 2 : 3;
    window.storedTr = node.querySelector('tr:nth-child('+index+')');
}
window.nonKeyedDetector_reset();
`;

function isKeyedRun(result: any, shouldBeKeyed: boolean): boolean {
  let r = result.tradded >= 1000 && result.trremoved >= 1000;
  if (r && !shouldBeKeyed) {
    // console.log(
    //   `Non-keyed test for create rows failed. Expected that TRs should be recycled, but there were ${result.tradded} added TRs and ${result.trremoved} were removed`
    // );
  } else if (!r && shouldBeKeyed) {
    console.log(
      `Keyed test for create rows failed. Expected that 1000 TRs should be removed and added, but there were ${result.tradded} added TRs and ${result.trremoved} were removed`
    );
  }
  return r;
}
function isKeyedRemove(result: any, shouldBeKeyed: boolean): boolean {
  let r = result.removedStoredTr;
  if (r && !shouldBeKeyed) {
    // console.log(`Note: Non-keyed test for remove is acutally keyed. Expected that the dom node for the 2nd row would NOT be removed, but it was.`);
  } else if (!r && shouldBeKeyed) {
    console.log(`Keyed test for remove failed. Expected that the dom node for the 2nd row would be removed, but it wasn't`);
  }
  return r;
}
function isKeyedSwapRow(result: any, shouldBeKeyed: boolean): boolean {
  let r = result.tradded > 0 && result.trremoved > 0 && result.newNodes == 0;
  if (r && !shouldBeKeyed) {
    // console.log(
    //   `Non-keyed test for swap failed. Expected than no TRs are added or removed, but there were ${result.tradded} added and ${result.trremoved} removed`
    // );
  } else if (!r && shouldBeKeyed) {
    if (result.newNodes > 0) {
      console.log(`Keyed test for swap failed. Swap must add the TRs that it removed, but there were ${result.newNodes} new nodes`);
    } else {
      console.log(
        `Keyed test for swap failed. Expected at least 1 added and 1 removed TR, but there were ${result.tradded} added and ${result.trremoved} removed`
      );
    }
  }
  return r;
}

async function assertChildNodes(elem: ElementHandle<HTMLElement>, expectedNodes: string[], message: string) {
  let elements = await elem.$$("*");
  let allNodes = await Promise.all(elements.map((e) => e.evaluate(e => e.tagName)));
  let toLower = (array: string[]) => array.map(s => s.toLowerCase());
  if (!R.equals(toLower(allNodes), toLower(expectedNodes))) {
    console.log("ERROR in html structure for " + message);
    console.log("  expected:", expectedNodes);
    console.log("  actual  :", allNodes);
    return false;
  }
  return true;
}

function niceEmptyString(val: string[]): string {
  if (!val || val.length === 0) return "[empty]";
  if (val.every((v) => v.length === 0)) return "[empty]";
  return val.toString();
}

async function assertClassesContained(elem: ElementHandle<HTMLElement>, expectedClassNames: string[], message: string) {
  let actualClassNames = (await elem.evaluate(e => e.className)).split(" ");
  if (!expectedClassNames.every((expected) => actualClassNames.includes(expected))) {
    console.log(
      "css class not correct. Expected for " + message + " to be " + expectedClassNames + " but was " + niceEmptyString(actualClassNames)
    );
    return false;
  }
  return true;
}

export async function checkTRcorrect(page: Page): Promise<boolean> {
  let tr = await page.$("tbody>tr:nth-of-type(1000)");
  if (!(await assertChildNodes(tr as ElementHandle<HTMLElement>, ["td", "td", "a", "td", "a", "span", "td"], "tr"))) {
    return false;
  }

  // first td
  let td1 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  if (!(await assertClassesContained(td1 as ElementHandle<HTMLElement>, ["col-md-1"], "first td"))) {
    return false;
  }

  // second td
  let td2 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(2)");
  if (!(await assertClassesContained(td2 as ElementHandle<HTMLElement>, ["col-md-4"], "second td"))) {
    return false;
  }

  // third td
  let td3 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(3)");
  if (!(await assertClassesContained(td3 as ElementHandle<HTMLElement>, ["col-md-1"], "third td"))) {
    return false;
  }

  // span in third td
  let span = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(3)>a>span");
  if (!(await assertClassesContained(span as ElementHandle<HTMLElement>, ["glyphicon", "glyphicon-remove"], "span in a in third td"))) {
    return false;
  }
  // console.log("names", await span.evaluate(e => e.getAttributeNames()));
  let spanAria = await span.evaluate(e => e.getAttribute("aria-hidden"));
  // console.log("aria ", spanAria);
  if ("true" !== spanAria) {
    console.log("Expected to find 'aria-hidden'=true on span in third td, but found ", spanAria);
    return false;
  }

  // // fourth td
  let td4 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(4)");
  if (!(await assertClassesContained(td4 as ElementHandle<HTMLElement>, ["col-md-6"], "fourth td"))) {
    return false;
  }

  return true;
}

async function runBench(frameworkNames: string[]) {
  let runFrameworks;
  let matchesDirectoryArg = (directoryName: string) => allArgs.length == 0 || allArgs.some((arg: string) => arg == directoryName);
  runFrameworks = await initializeFrameworks(matchesDirectoryArg);
  console.log("Frameworks that will be checked", runFrameworks.map((f) => f.fullNameWithKeyedAndVersion).join(" "));

  let frameworkMap = new Map<String, FrameworkData>();

  let allCorrect = true;

  for (let i = 0; i < runFrameworks.length; i++) {
    let browser = await startBrowser(benchmarkOptions);
    let page = await browser.newPage();
    try {
      let framework: FrameworkData = runFrameworks[i];

      await page.goto(`http://${config.HOST}:${config.PORT}/${framework.uri}/index.html`, {waitUntil: "networkidle"});
      await checkElementExists(page, "#add");
      await clickElement(page, "#add");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");

      // check html for tr
      let htmlCorrect = await checkTRcorrect(page);
      if (!htmlCorrect) {
        console.log("ERROR: Framework " + framework.fullNameWithKeyedAndVersion + " html is not correct");
        allCorrect = false;
      }
      let str = init(framework.shadowRootName);
      await page.evaluate(str);
      if (framework.useShadowRoot) {
        await page.evaluate(`window.nonKeyedDetector_setUseShadowDom("${framework.shadowRootName}");`);
      } else {
        await page.evaluate(`window.nonKeyedDetector_setUseShadowDom(undefined);`);
      }
      await page.evaluate("window.nonKeyedDetector_instrument()");
      // swap
      await page.evaluate("nonKeyedDetector_storeTr()");
      await clickElement(page, "#swaprows");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(2)>td:nth-of-type(1)", "999");
      let res = await page.evaluate("nonKeyedDetector_result()");
      let keyedSwap = isKeyedSwapRow(res, framework.keyed);
      // run
      await page.evaluate("nonKeyedDetector_storeTr()");
      await page.evaluate("window.nonKeyedDetector_reset()");
      await clickElement(page, "#run");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "2000");
      res = await page.evaluate("nonKeyedDetector_result()");
      let keyedRun = isKeyedRun(res, framework.keyed);
      // // remove
      await page.evaluate("nonKeyedDetector_storeTr()");
      await page.evaluate("window.nonKeyedDetector_reset()");
      await checkElementContainsText(page, `tbody>tr:nth-of-type(2)>td:nth-of-type(1)`, "1002");
      await clickElement(page, `tbody>tr:nth-of-type(2)>td:nth-of-type(3)>a>span:nth-of-type(1)`);
      await checkElementContainsText(page, `tbody>tr:nth-of-type(2)>td:nth-of-type(1)`, "1003");
      res = await page.evaluate("nonKeyedDetector_result()");
      let keyedRemove = isKeyedRemove(res, framework.keyed);
      let keyed = keyedRemove && keyedRun && keyedSwap;
      console.log(
        framework.fullNameWithKeyedAndVersion +
          " is " +
          (keyedRun ? "keyed" : "non-keyed") +
          " for 'run benchmark' and " +
          (keyedRemove ? "keyed" : "non-keyed") +
          " for 'remove row benchmark' and " +
          (keyedSwap ? "keyed" : "non-keyed") +
          " for 'swap rows benchmark' " +
          ". It'll appear as " +
          (keyed ? "keyed" : "non-keyed") +
          " in the results"
      );
      if (framework.keyed !== keyed) {
        console.log("ERROR: Framework " + framework.fullNameWithKeyedAndVersion + " is not correctly categorized");
        allCorrect = false;
      }
    } catch (e) {
      console.log("ERROR running " + runFrameworks[i].fullNameWithKeyedAndVersion, e);
      allCorrect = false;
    } finally {
      try {
        await page.close();
        await browser.close();
      } catch (e) {
        console.log("error calling driver.quit - ignoring this exception");
      }
    }
  }
  if (!allCorrect) process.exit(1);
}

config.PORT = Number(args.port);

if (process.env.HOST) {
  config.HOST = process.env.HOST;
  console.log(`INFO: Using host ${config.HOST} instead of localhost`);
}

let runFrameworks = (args.framework && args.framework.length > 0 ? args.framework : [""]).map((v: string) => v.toString());

let benchmarkOptions: BenchmarkOptions = {
  HOST: config.HOST,
  port: config.PORT.toFixed(),
  remoteDebuggingPort: config.REMOTE_DEBUGGING_PORT,
  chromePort: config.CHROME_PORT,
  headless: false, //args.headless,
  chromeBinaryPath: args.chromeBinary,
  numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  batchSize: 1,
};
async function main() {
  if (args.help) {
    yargs.showHelp();
  } else {
    runBench(runFrameworks);
  }
}

main();
