// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Browser, Page } from "puppeteer-core";
import { BenchmarkInfo, BenchmarkType } from "./benchmarksGeneric";
import { config, FrameworkData } from "./common";
import {
  clickElementById,
  clickElementByXPath,
  waitForClassContained,
  waitForElementLocatedById,
  waitForElementLocatedByXpath,
  waitForElementNotLocatedByXPath,
  waitForTextContains,
} from "./puppeteerAccess";

const BENCHMARK_21 = "21_ready-memory";
const BENCHMARK_22 = "22_run-memory";
const BENCHMARK_23 = "23_update5-memory";
const BENCHMARK_24 = "24_run5-memory";
const BENCHMARK_25 = "25_run-clear-memory";
const BENCHMARK_31 = "31_startup-ci";

type TBenchmarkID = typeof BENCHMARK_21 | typeof BENCHMARK_22 | typeof BENCHMARK_23 | typeof BENCHMARK_25 | typeof BENCHMARK_31;

export abstract class BenchmarkPuppeteer {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
  throttleCPU?: number;
  allowBatching: boolean;

  constructor(public benchmarkInfo: BenchmarkInfo) {
    this.id = benchmarkInfo.id;
    this.type = benchmarkInfo.type;
    this.label = benchmarkInfo.label;
    this.description = benchmarkInfo.description;
    this.throttleCPU = benchmarkInfo.throttleCPU;
    this.allowBatching = benchmarkInfo.allowBatching;
  }
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
  after(page: Page, framework: FrameworkData): Promise<any> {
    return null;
  }
  // Good fit for a single result creating Benchmark
  resultKinds(): Array<BenchmarkInfo> {
    return [this.benchmarkInfo];
  }
  extractResult(results: any[], resultKind: BenchmarkInfo): number[] {
    return results;
  }
}

const benchReadyMemory = new (class extends BenchmarkPuppeteer {
  constructor() {
    super({
      id: BENCHMARK_21,
      label: "ready memory",
      description: "Memory usage after page load.",
      type: BenchmarkType.MEM,
      allowBatching: false,
    });
  }
  async init(page: Page) {
    await waitForElementLocatedById(page, "add", true);
  }
  async run(page: Page) {
    await waitForElementNotLocatedByXPath(page, "//tbody/tr[1]", false);
  }
  async after(page: Page, framework: FrameworkData) {
    await clickElementById(page, "run", true);
    await waitForElementLocatedByXpath(page, "//tbody/tr[1]/td[2]/a", false);
  }
})();

const benchRunMemory = new (class extends BenchmarkPuppeteer {
  constructor() {
    super({
      id: BENCHMARK_22,
      label: "run memory",
      description: "Memory usage after adding 1000 rows.",
      type: BenchmarkType.MEM,
      allowBatching: false,
    });
  }
  async init(page: Page) {
    await waitForElementLocatedById(page, "add", true);
  }
  async run(page: Page) {
    await clickElementById(page, "run", true);
    await waitForElementLocatedByXpath(page, "//tbody/tr[1]/td[2]/a", false);
  }
})();

const benchUpdate5Memory = new (class extends BenchmarkPuppeteer {
  constructor() {
    super({
      id: BENCHMARK_23,
      label: "update eatch 10th row for 1k rows (5 cycles)",
      description: "Memory usage after clicking update every 10th row 5 times",
      type: BenchmarkType.MEM,
      allowBatching: false,
    });
  }
  async init(page: Page) {
    await waitForElementLocatedById(page, "add", true);
  }
  async run(page: Page) {
    await clickElementById(page, "run", true);
    for (let i = 0; i < 5; i++) {
      await clickElementById(page, "update", true);
      await waitForTextContains(page, "//tbody/tr[1]/td[2]/a", " !!!".repeat(i), false);
    }
  }
})();

const benchReplace5Memory = new (class extends BenchmarkPuppeteer {
  constructor() {
    super({
      id: BENCHMARK_24,
      label: "replace 1k rows (5 cycles)",
      description: "Memory usage after clicking create 1000 rows 5 times",
      type: BenchmarkType.MEM,
      allowBatching: false,
    });
  }
  async init(page: Page) {
    await waitForElementLocatedById(page, "add", true);
  }
  async run(page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElementById(page, "run", true);
      await waitForTextContains(page, "//tbody/tr[1000]/td[1]", (1000 * (i + 1)).toFixed(), false);
    }
  }
})();

const benchCreateClear5Memory = new (class extends BenchmarkPuppeteer {
  constructor() {
    super({
      id: BENCHMARK_25,
      label: "creating/clearing 1k rows (5 cycles)",
      description: "Memory usage after creating and clearing 1000 rows 5 times",
      type: BenchmarkType.MEM,
      allowBatching: false,
    });
  }
  async init(page: Page) {
    await waitForElementLocatedById(page, "add", true);
  }
  async run(page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElementById(page, "run", true);
      await waitForTextContains(page, "//tbody/tr[1000]/td[1]", (1000 * (i + 1)).toFixed(), false);
      await clickElementById(page, "clear", true);
      await waitForElementNotLocatedByXPath(page, "//tbody/tr[1000]/td[1]", false);
    }
  }
})();

export let benchmarksPuppeteer: Array<BenchmarkPuppeteer> = [
  benchReadyMemory,
  benchRunMemory,
  benchUpdate5Memory,
  benchReplace5Memory,
  benchCreateClear5Memory,
];
