import yargs from "yargs";
import { checkElementContainsText, checkElementExists, clickElement, startBrowser } from "./playwrightAccess.js";
import { config, FrameworkData, initializeFrameworks, BenchmarkOptions } from "./common.js";

import * as R from "ramda";
import { ElementHandle, Page } from "playwright";

const args: any = yargs(process.argv)
  .usage(
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
  )
  .help("help")
  .boolean("headless").default("headless", false)
  .array("framework")
  .array("benchmark")
  .string("chromeBinary").argv;

console.log("args", args);

console.log("HEADLESS*** ", args.headless);

const benchmarkOptions: BenchmarkOptions = {
  port: 8080,
  host: 'localhost',
  browser: args.browser,
  remoteDebuggingPort: 9999,
  chromePort: 9998,
  headless: args.headless,
  chromeBinaryPath: args.chromeBinary,
  numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  batchSize: 1,
  resultsDirectory: "results",
  tracesDirectory: "traces",
  allowThrottling: !args.nothrottling
};

const allArgs = args._.length <= 2 ? [] : args._.slice(2, args._.length);
const frameworkArgument = !args.framework ? allArgs : args.framework;
console.log("args", args, "allArgs", allArgs);

const init = (shadowRootName: string) => `
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
  const r = result.tradded >= 1000 && result.trremoved >= 1000;
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
  const r = result.removedStoredTr;
  if (r && !shouldBeKeyed) {
    // console.log(`Note: Non-keyed test for remove is acutally keyed. Expected that the dom node for the 2nd row would NOT be removed, but it was.`);
  } else if (!r && shouldBeKeyed) {
    console.log(`Keyed test for remove failed. Expected that the dom node for the 2nd row would be removed, but it wasn't`);
  }
  return r;
}
function isKeyedSwapRow(result: any, shouldBeKeyed: boolean): boolean {
  const r = result.tradded > 0 && result.trremoved > 0 && result.newNodes == 0;
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
  const elements = await elem.$$("*");
  const allNodes = await Promise.all(elements.map((e) => e.evaluate(e => e.tagName)));
  const toLower = (array: string[]) => array.map(s => s.toLowerCase());
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
  const actualClassNames = (await elem.evaluate(e => e.className)).split(" ");
  if (!expectedClassNames.every((expected) => actualClassNames.includes(expected))) {
    console.log(
      "css class not correct. Expected for " + message + " to be " + expectedClassNames + " but was " + niceEmptyString(actualClassNames)
    );
    return false;
  }
  return true;
}

export async function checkTRcorrect(page: Page): Promise<boolean> {
  const tr = await page.$("tbody>tr:nth-of-type(1000)");
  if (!(await assertChildNodes(tr as ElementHandle<HTMLElement>, ["td", "td", "a", "td", "a", "span", "td"], "tr"))) {
    return false;
  }

  // first td
  const td1 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  if (!(await assertClassesContained(td1 as ElementHandle<HTMLElement>, ["col-md-1"], "first td"))) {
    return false;
  }

  // second td
  const td2 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(2)");
  if (!(await assertClassesContained(td2 as ElementHandle<HTMLElement>, ["col-md-4"], "second td"))) {
    return false;
  }

  // third td
  const td3 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(3)");
  if (!(await assertClassesContained(td3 as ElementHandle<HTMLElement>, ["col-md-1"], "third td"))) {
    return false;
  }

  // span in third td
  const span = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(3)>a>span");
  if (!(await assertClassesContained(span as ElementHandle<HTMLElement>, ["glyphicon", "glyphicon-remove"], "span in a in third td"))) {
    return false;
  }
  // console.log("names", await span.evaluate(e => e.getAttributeNames()));
  const spanAria = await span.evaluate(e => e.getAttribute("aria-hidden"));
  // console.log("aria ", spanAria);
  if ("true" !== spanAria) {
    console.log("Expected to find 'aria-hidden'=true on span in third td, but found ", spanAria);
    return false;
  }

  // // fourth td
  const td4 = await page.$("tbody>tr:nth-of-type(1000)>td:nth-of-type(4)");
  if (!(await assertClassesContained(td4 as ElementHandle<HTMLElement>, ["col-md-6"], "fourth td"))) {
    return false;
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runBench(frameworkNames: string[]) {
  const matchesDirectoryArg = (directoryName: string) =>
    frameworkArgument.length == 0 || frameworkArgument.some((arg: string) => arg == directoryName);
  const runFrameworks = await initializeFrameworks(benchmarkOptions, matchesDirectoryArg);
  console.log("Frameworks that will be checked", runFrameworks.map((f) => f.fullNameWithKeyedAndVersion).join(" "));

  let allCorrect = true;

  console.log("*** headless", benchmarkOptions.headless)

  for (let i = 0; i < runFrameworks.length; i++) {
    const browser = await startBrowser(benchmarkOptions);
    const page = await browser.newPage();
    try {
      const framework: FrameworkData = runFrameworks[i];

      await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`, {waitUntil: "networkidle"});
      await checkElementExists(page, "#add");
      await clickElement(page, "#add");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");

      // check html for tr
      const htmlCorrect = await checkTRcorrect(page);
      if (!htmlCorrect) {
        console.log("ERROR: Framework " + framework.fullNameWithKeyedAndVersion + " html is not correct");
        allCorrect = false;
      }
      const str = init(framework.shadowRootName);
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
      const keyedSwap = isKeyedSwapRow(res, framework.keyed);
      // run
      await page.evaluate("nonKeyedDetector_storeTr()");
      await page.evaluate("window.nonKeyedDetector_reset()");
      await clickElement(page, "#run");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "2000");
      res = await page.evaluate("nonKeyedDetector_result()");
      const keyedRun = isKeyedRun(res, framework.keyed);
      // // remove
      await page.evaluate("nonKeyedDetector_storeTr()");
      await page.evaluate("window.nonKeyedDetector_reset()");
      await checkElementContainsText(page, `tbody>tr:nth-of-type(2)>td:nth-of-type(1)`, "1002");
      await clickElement(page, `tbody>tr:nth-of-type(2)>td:nth-of-type(3)>a>span:nth-of-type(1)`);
      await checkElementContainsText(page, `tbody>tr:nth-of-type(2)>td:nth-of-type(1)`, "1003");
      res = await page.evaluate("nonKeyedDetector_result()");
      const keyedRemove = isKeyedRemove(res, framework.keyed);
      const keyed = keyedRemove && keyedRun && keyedSwap;
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

const runFrameworks = (args.framework && args.framework.length > 0 ? args.framework : [""]).map((v: string) => v.toString());

async function main() {
  if (args.help) {
    // yargs.showHelp();
  } else {
    await runBench(runFrameworks);
  }
}

main().catch(err => {console.log("Error in isKeyed", err)});
