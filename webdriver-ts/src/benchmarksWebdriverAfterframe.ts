import { By, WebDriver, WebElement } from "selenium-webdriver";
import * as benchmarksCommon from "./benchmarksCommon.js";
import { BenchmarkType } from "./benchmarksCommon.js";
import { config, FrameworkData } from "./common.js";
import {
  clickElementById,
  clickElementByXPath,
  findById,
  findByXPath,
  getTextByXPath, mainRoot, retry, testClassContains, testElementLocatedById, testElementLocatedByXpath,
  testElementNotLocatedByXPath, testTextContains
} from "./webdriverAccess.js";


const SHORT_TIMEOUT = 20 * 1000;


let durations: Array<number> = [];

export function getAfterframeDurations() {
  return durations;
}

export async  function initMeasurement(driver: WebDriver) {
  // From https://github.com/andrewiggins/afterframe, MIT licensed
  const afterFrame = `
  /**
   * Queue of functions to invoke
   * @type {Array<(time: number) => void>}
   */
  let callbacks = [];
  
  let channel = new MessageChannel();
  
  let postMessage = (function() {
    this.postMessage(undefined);
  }).bind(channel.port2);
  
  // Flush the callback queue when a message is posted to the message channel
  channel.port1.onmessage = () => {
    // Reset the callback queue to an empty list in case callbacks call
    // afterFrame. These nested calls to afterFrame should queue up a new
    // callback to be flushed in the following frame and should not impact the
    // current queue being flushed
    let toFlush = callbacks;
    callbacks = [];
    let time = performance.now();
    for (let i = 0; i < toFlush.length; i++) {
      // Call all callbacks with the time the flush began, similar to requestAnimationFrame
      // TODO: Error handling?
      toFlush[i](time);
    }
  };
  
  // If the onmessage handler closes over the MessageChannel, the MessageChannel never gets GC'd:
  channel = null;
  
  /**
   * Invoke the given callback after the browser renders the next frame
   * @param {(time: number) => void} callback The function to call after the browser renders
   * the next frame. The callback function is passed one argument, a DOMHighResTimeStamp
   * similar to the one returned by performance.now(), indicating the point in time when
   * afterFrame() starts to execute callback functions.
   */
  window.afterFrame = function(callback) {
    if (callbacks.push(callback) === 1) {
      requestAnimationFrame(postMessage);
    }
  }
  `;
  await driver.executeScript(afterFrame);
  durations = [];
}

async function measureClickForElement(driver: WebDriver, elem: WebElement) {
  if (!elem) throw `measureClickForElement failed. Element was not found.`;
  let duration = await driver.executeAsyncScript(`
      let callback = arguments[arguments.length - 1];
      let elem = arguments[0];
      let base = document;
      let t0 = performance.now(); 
      elem.click();
      window.afterFrame(() => 
      {
        let t = performance.now()-t0;
        // @ts-ignore
        window.lastDuration = t;
        callback(t);
      })
    `, elem) as number;
  durations.push(duration);
  console.log("computed duration ", duration);
}

async function measureClickElementById(driver: WebDriver, id: string, isInButtonArea: boolean) {
  let elem = await findById(driver, id, isInButtonArea);
  console.log("measureClickElementById: ", elem);
  await measureClickForElement(driver, elem);
}

async function measureClickElementByXPath(driver: WebDriver, xpath: string, isInButtonArea: boolean) {
  let elem = await findByXPath(driver, xpath, isInButtonArea);
  if (!elem) throw `measureClickElementById ${xpath} failed. Element was not found.`;
  await measureClickForElement(driver, elem);
}


export abstract class CPUBenchmarkWebdriver {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: benchmarksCommon.CPUBenchmarkInfo) {
  }
  abstract init(driver: WebDriver, framework: FrameworkData): Promise<any>;
  abstract run(driver: WebDriver, framework: FrameworkData): Promise<any>;
}

export const benchRun = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_01]);
  } 
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await measureClickElementById(driver, "run", true);
    await testTextContains(driver, "//tbody/tr[1]/td[1]", (config.WARMUP_COUNT * 1000 + 1).toFixed(), config.TIMEOUT, false);
  }
})();

export const benchReplaceAll = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_02]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await measureClickElementById(driver, "run", true);
    await testTextContains(driver, "//tbody/tr[1]/td[1]", "5001", config.TIMEOUT, false);
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_03]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
    for (let i = 0; i < 3; i++) {
      await clickElementById(driver, "update", true);
      await testTextContains(driver, "//tbody/tr[991]/td[2]/a", " !!!".repeat(i + 1), config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await measureClickElementById(driver, "update", true);
    await testTextContains(driver, "//tbody/tr[991]/td[2]/a", " !!!".repeat(3 + 1), config.TIMEOUT, false);
  }
})();

export const benchSelect = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_04]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await measureClickElementByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
    await testClassContains(driver, "//tbody/tr[2]", "danger", config.TIMEOUT, false);
  }
})();

export const benchSwapRows = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_05]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
    for (let i = 0; i <= config.WARMUP_COUNT; i++) {
      let text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
      await clickElementById(driver, "swaprows", true);
      await testTextContains(driver, "//tbody/tr[999]/td[2]/a", text, config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    let text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
    await measureClickElementById(driver, "swaprows", true);
    await testTextContains(driver, "//tbody/tr[999]/td[2]/a", text, config.TIMEOUT, false);
  }
})();

export const benchRemove = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_06]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await testTextContains(
        driver,
        `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[1]`,
        (config.WARMUP_COUNT - i + 4).toString(),
        config.TIMEOUT,
        false
      );
      await clickElementByXPath(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[3]/a/span[1]`, false);
      await testTextContains(driver, `//tbody/tr[${config.WARMUP_COUNT - i + 4}]/td[1]`, "10", config.TIMEOUT, false);
    }
    await testTextContains(driver, "//tbody/tr[5]/td[1]", "10", config.TIMEOUT, false);
    await testTextContains(driver, "//tbody/tr[4]/td[1]", "4", config.TIMEOUT, false);

    // Click on a row the second time
    await testTextContains(driver, `//tbody/tr[6]/td[1]`, "11", config.TIMEOUT, false);
    await clickElementByXPath(driver, `//tbody/tr[6]/td[3]/a/span[1]`, false);
    await testTextContains(driver, `//tbody/tr[6]/td[1]`, "12", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await measureClickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]", false);
    await testTextContains(driver, "//tbody/tr[4]/td[1]", "10", config.TIMEOUT, false);
  }
})();

export const benchRunBig = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_07]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await measureClickElementById(driver, "runlots", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchAppendToManyRows = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_08]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await measureClickElementById(driver, "add", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1100]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchClear = new (class extends CPUBenchmarkWebdriver {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_09]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await measureClickElementById(driver, "clear", true);
    await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
  }
})();

export const benchmarks = [
  benchRun, 
  benchReplaceAll,
  benchUpdate, 
  benchSelect, 
  benchSwapRows, 
  benchRemove, 
  benchRunBig, 
  benchAppendToManyRows, 
  benchClear, 
];
