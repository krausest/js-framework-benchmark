import { WebDriver } from "selenium-webdriver";
import {
  BenchmarkType,
  Benchmark,
  cpuBenchmarkInfos,
  CPUBenchmarkInfo,
} from "./benchmarksCommon.js";
import { config, FrameworkData } from "./common.js";
import {
  clickElementById,
  clickElementByXPath,
  getTextByXPath,
  testClassContains,
  testElementLocatedById,
  testElementLocatedByXpath,
  testElementNotLocatedByXPath,
  testTextContains,
} from "./webdriverCDPAccess.js";

const SHORT_TIMEOUT = 20 * 1000;

export abstract class CPUBenchmarkWebdriverCDP {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: CPUBenchmarkInfo) {}
  abstract init(driver: WebDriver, framework: FrameworkData): Promise<any>;
  abstract run(driver: WebDriver, framework: FrameworkData): Promise<any>;
}

export const benchRun = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._01]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "run", true);
    await testTextContains(driver, "//tbody/tr[1]/td[1]", (this.benchmarkInfo.warmupCount * 1000 + 1).toFixed(), config.TIMEOUT, false);
  }
})();

export const benchReplaceAll = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._02]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "run", true);
    await testTextContains(driver, "//tbody/tr[1]/td[1]", `${this.benchmarkInfo.warmupCount * 1000 + 1}`, config.TIMEOUT, false);
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._03]);
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
    await clickElementById(driver, "update", true);
    await testTextContains(driver, "//tbody/tr[991]/td[2]/a", " !!!".repeat(3 + 1), config.TIMEOUT, false);
  }
})();

export const benchSelect = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._04]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
    await testClassContains(driver, "//tbody/tr[2]", "danger", config.TIMEOUT, false);
  }
})();

export const benchSwapRows = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._05]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1]/td[1]", config.TIMEOUT, false);
    for (let i = 0; i <= this.benchmarkInfo.warmupCount; i++) {
      let text = i % 2 == 0 ? "2" : "999";
      await clickElementById(driver, "swaprows", true);
      await testTextContains(driver, "//tbody/tr[999]/td[1]", text, config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "swaprows", true);
    let text999 = this.benchmarkInfo.warmupCount % 2 == 0 ? "999" : "2";
    let text2 = this.benchmarkInfo.warmupCount % 2 == 0 ? "2" : "999";
    await testTextContains(driver, "//tbody/tr[999]/td[1]", text999, config.TIMEOUT, false);
    await testTextContains(driver, "//tbody/tr[2]/td[1]", text2, config.TIMEOUT, false);
  }
})();

export const benchRemove = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._06]);
  }
  rowsToSkip = 4;
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[1]", config.TIMEOUT, false);
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      const rowToClick = this.benchmarkInfo.warmupCount - i + this.rowsToSkip;
      await testTextContains(
        driver,
        `//tbody/tr[${rowToClick}]/td[1]`,
        rowToClick.toString(),
        config.TIMEOUT,
        false
      );
      await clickElementByXPath(driver, `//tbody/tr[${rowToClick}]/td[3]/a/span[1]`, false);
      await testTextContains(driver, `//tbody/tr[${rowToClick}]/td[1]`, `${this.rowsToSkip + this.benchmarkInfo.warmupCount + 1}`, config.TIMEOUT, false);
    }
    await testTextContains(driver, `//tbody/tr[${this.rowsToSkip + 1}]/td[1]`, `${this.rowsToSkip + this.benchmarkInfo.warmupCount + 1}`, config.TIMEOUT, false);
    await testTextContains(driver, `//tbody/tr[${this.rowsToSkip}]/td[1]`, `${this.rowsToSkip}`, config.TIMEOUT, false);

    // Click on a row the second time
    await testTextContains(driver, `//tbody/tr[${this.rowsToSkip + 2}]/td[1]`, `${this.rowsToSkip + this.benchmarkInfo.warmupCount + 2}`, config.TIMEOUT, false);
    await clickElementByXPath(driver, `//tbody/tr[${this.rowsToSkip + 2}]/td[3]/a/span[1]`, false);
    await testTextContains(driver, `//tbody/tr[${this.rowsToSkip + 2}]/td[1]`, `${this.rowsToSkip + this.benchmarkInfo.warmupCount + 3}`, config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementByXPath(driver, `//tbody/tr[${this.rowsToSkip}]/td[3]/a/span[1]`, false);
    await testTextContains(driver, `//tbody/tr[${this.rowsToSkip}]/td[1]`, `${this.rowsToSkip + this.benchmarkInfo.warmupCount + 1}`, config.TIMEOUT, false);
  }
})();

export const benchRunBig = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._07]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "runlots", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchAppendToManyRows = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._08]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(driver, "//tbody/tr[1]/td[1]", (i * 1000 + 1).toFixed(), config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "add", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[2000]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchClear = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._09]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < this.benchmarkInfo.warmupCount; i++) {
      await clickElementById(driver, "run", true);
      await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
    }
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "clear", true);
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
