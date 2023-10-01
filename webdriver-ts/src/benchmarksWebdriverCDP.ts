import { WebDriver } from "selenium-webdriver";
import {
  Benchmark,
  CPUBenchmarkInfo,
  BenchmarkType,
  cpuBenchmarkInfos,
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
const WARMUP_COUNT = config.WARMUP_COUNT;
const TIMEOUT = config.TIMEOUT;

export abstract class CPUBenchmarkWebdriverCDP {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: CPUBenchmarkInfo) {}
  abstract init(driver: WebDriver, framework: FrameworkData): Promise<void>;
  abstract run(driver: WebDriver, framework: FrameworkData): Promise<void>;
}

export const benchRun = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._01]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(
        driver,
        "//tbody/tr[1]/td[1]",
        (i * 1000 + 1).toFixed(),
        TIMEOUT,
        false,
      );
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(
        driver,
        "//tbody/tr[1]",
        TIMEOUT,
        false,
      );
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "run", true);
    await testTextContains(
      driver,
      "//tbody/tr[1]/td[1]",
      (WARMUP_COUNT * 1000 + 1).toFixed(),
      TIMEOUT,
      false,
    );
  }
})();

export const benchReplaceAll = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._02]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(
        driver,
        "//tbody/tr[1]/td[1]",
        (i * 1000 + 1).toFixed(),
        TIMEOUT,
        false,
      );
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "run", true);
    await testTextContains(
      driver,
      "//tbody/tr[1]/td[1]",
      "5001",
      TIMEOUT,
      false,
    );
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._03]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(
      driver,
      "//tbody/tr[1000]/td[2]/a",
      TIMEOUT,
      false,
    );
    for (let i = 0; i < 3; i++) {
      await clickElementById(driver, "update", true);
      await testTextContains(
        driver,
        "//tbody/tr[991]/td[2]/a",
        " !!!".repeat(i + 1),
        TIMEOUT,
        false,
      );
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "update", true);
    await testTextContains(
      driver,
      "//tbody/tr[991]/td[2]/a",
      " !!!".repeat(3 + 1),
      TIMEOUT,
      false,
    );
  }
})();

export const benchSelect = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._04]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(
      driver,
      "//tbody/tr[1]/td[2]/a",
      TIMEOUT,
      false,
    );
  }
  async run(driver: WebDriver) {
    await clickElementByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
    await testClassContains(driver, "//tbody/tr[2]", "danger", TIMEOUT, false);
  }
})();

export const benchSwapRows = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._05]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(
      driver,
      "//tbody/tr[1]/td[2]/a",
      TIMEOUT,
      false,
    );
    for (let i = 0; i <= WARMUP_COUNT; i++) {
      const text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
      await clickElementById(driver, "swaprows", true);
      await testTextContains(
        driver,
        "//tbody/tr[999]/td[2]/a",
        text,
        TIMEOUT,
        false,
      );
    }
  }
  async run(driver: WebDriver) {
    const text = await getTextByXPath(driver, "//tbody/tr[2]/td[2]/a", false);
    await clickElementById(driver, "swaprows", true);
    await testTextContains(
      driver,
      "//tbody/tr[999]/td[2]/a",
      text,
      TIMEOUT,
      false,
    );
  }
})();

export const benchRemove = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._06]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(
      driver,
      "//tbody/tr[1]/td[2]/a",
      TIMEOUT,
      false,
    );
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await testTextContains(
        driver,
        `//tbody/tr[${WARMUP_COUNT - i + 4}]/td[1]`,
        (WARMUP_COUNT - i + 4).toString(),
        TIMEOUT,
        false,
      );
      await clickElementByXPath(
        driver,
        `//tbody/tr[${WARMUP_COUNT - i + 4}]/td[3]/a/span[1]`,
        false,
      );
      await testTextContains(
        driver,
        `//tbody/tr[${WARMUP_COUNT - i + 4}]/td[1]`,
        "10",
        TIMEOUT,
        false,
      );
    }
    await testTextContains(driver, "//tbody/tr[5]/td[1]", "10", TIMEOUT, false);
    await testTextContains(driver, "//tbody/tr[4]/td[1]", "4", TIMEOUT, false);

    // Click on a row the second time
    await testTextContains(driver, `//tbody/tr[6]/td[1]`, "11", TIMEOUT, false);
    await clickElementByXPath(driver, `//tbody/tr[6]/td[3]/a/span[1]`, false);
    await testTextContains(driver, `//tbody/tr[6]/td[1]`, "12", TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a/span[1]", false);
    await testTextContains(driver, "//tbody/tr[4]/td[1]", "10", TIMEOUT, false);
  }
})();

export const benchRunBig = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._07]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testTextContains(
        driver,
        "//tbody/tr[1]/td[1]",
        (i * 1000 + 1).toFixed(),
        TIMEOUT,
        false,
      );
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(
        driver,
        "//tbody/tr[1]",
        TIMEOUT,
        false,
      );
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "runlots", true);
    await testElementLocatedByXpath(
      driver,
      "//tbody/tr[10000]/td[2]/a",
      TIMEOUT,
      false,
    );
  }
})();

export const benchAppendToManyRows =
  new (class extends CPUBenchmarkWebdriverCDP {
    constructor() {
      super(cpuBenchmarkInfos[Benchmark._08]);
    }
    async init(driver: WebDriver) {
      await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
      await clickElementById(driver, "run", true);
      await testElementLocatedByXpath(
        driver,
        "//tbody/tr[1000]/td[2]/a",
        TIMEOUT,
        false,
      );
    }
    async run(driver: WebDriver) {
      await clickElementById(driver, "add", true);
      await testElementLocatedByXpath(
        driver,
        "//tbody/tr[1100]/td[2]/a",
        TIMEOUT,
        false,
      );
    }
  })();

export const benchClear = new (class extends CPUBenchmarkWebdriverCDP {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._09]);
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testElementLocatedByXpath(
        driver,
        "//tbody/tr[1000]/td[2]/a",
        TIMEOUT,
        false,
      );
      await clickElementById(driver, "clear", true);
      await testElementNotLocatedByXPath(
        driver,
        "//tbody/tr[1]",
        TIMEOUT,
        false,
      );
    }
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(
      driver,
      "//tbody/tr[1000]/td[2]/a",
      TIMEOUT,
      false,
    );
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "clear", true);
    await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", TIMEOUT, false);
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
