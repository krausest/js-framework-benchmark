import { WebDriver } from "selenium-webdriver";
import * as benchmarksCommon from "./benchmarksCommon";
import { BenchmarkType } from "./benchmarksCommon";
import { config, FrameworkData } from "./common";
import {
  clickElementById,
  clickElementByXPath,
  getTextByXPath, testClassContains, testElementLocatedById, testElementLocatedByXpath,
  testElementNotLocatedByXPath, testTextContains
} from "./webdriverCDPAccess";


const SHORT_TIMEOUT = 20 * 1000;

export abstract class CPUBenchmarkWebdriverCDP {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: benchmarksCommon.CPUBenchmarkInfo) {
  }
  abstract init(driver: WebDriver, framework: FrameworkData): Promise<any>;
  abstract run(driver: WebDriver, framework: FrameworkData): Promise<any>;
}

export const benchRun = new (class extends CPUBenchmarkWebdriverCDP {
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
    await clickElementById(driver, "run", true);
    await testTextContains(driver, "//tbody/tr[1]/td[1]", (config.WARMUP_COUNT * 1000 + 1).toFixed(), config.TIMEOUT, false);
  }
})();

export const benchReplaceAll = new (class extends CPUBenchmarkWebdriverCDP {
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
    await clickElementById(driver, "run", true);
    await testTextContains(driver, "//tbody/tr[1]/td[1]", "5001", config.TIMEOUT, false);
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkWebdriverCDP {
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
    await clickElementById(driver, "update", true);
    await testTextContains(driver, "//tbody/tr[991]/td[2]/a", " !!!".repeat(3 + 1), config.TIMEOUT, false);
  }
})();

export const benchSelect = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_04]);
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
    await clickElementById(driver, "swaprows", true);
    await testTextContains(driver, "//tbody/tr[999]/td[2]/a", text, config.TIMEOUT, false);
  }
})();

export const benchRemove = new (class extends CPUBenchmarkWebdriverCDP {
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
    await clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]", false);
    await testTextContains(driver, "//tbody/tr[4]/td[1]", "10", config.TIMEOUT, false);
  }
})();

export const benchRunBig = new (class extends CPUBenchmarkWebdriverCDP {
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
    }  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "runlots", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchAppendToManyRows = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_08]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "add", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1100]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchClear = new (class extends CPUBenchmarkWebdriverCDP {
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
    await clickElementById(driver, "clear", true);
    await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
  }
})();


export function fileNameTrace(framework: FrameworkData, benchmark: benchmarksCommon.BenchmarkInfo, run: number) {
  return `${config.TRACES_DIRECTORY}/${framework.fullNameWithKeyedAndVersion}_${benchmark.id}_${run}.json`;
}

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
