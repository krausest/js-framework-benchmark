// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Browser, Page } from "playwright-core";
import * as benchmarksCommon from "./benchmarksCommon";
import { BenchmarkType } from "./benchmarksCommon";
import { config, FrameworkData } from "./common";
import { checkElementContainsText, checkElementExists, checkElementHasClass, checkElementNotExists, clickElement } from "./playwrightAccess";


export abstract class CPUBenchmarkPlaywright implements benchmarksCommon.BenchmarkImpl {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: benchmarksCommon.CPUBenchmarkInfo) {
  }
  abstract init(browser: Browser, page: Page, framework: FrameworkData): Promise<any>;
  abstract run(browser: Browser, page: Page, framework: FrameworkData): Promise<any>;
  after(page: Page, framework: FrameworkData): Promise<any> {
    return null;
  }
}

export abstract class MemBenchmarkPlaywright implements benchmarksCommon.BenchmarkImpl {
  type = BenchmarkType.MEM;
  constructor(public benchmarkInfo: benchmarksCommon.MemBenchmarkInfo) {
  }
  abstract init(browser: Browser, page: Page, framework: FrameworkData): Promise<any>;
  abstract run(browser: Browser, page: Page, framework: FrameworkData): Promise<any>;
  after(page: Page, framework: FrameworkData): Promise<any> {
    return null;
  }
}

export type TBenchmarkPlaywright = CPUBenchmarkPlaywright | MemBenchmarkPlaywright;

export let benchRun = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_01]);
  }
  async init(browser: Browser, page: Page) { 
      await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
      await clickElement(page, "#add");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
  }
}

export const benchReplaceAll = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_02]);
  }
  async init(browser: Browser, page: Page) {
      await checkElementExists(page, "#run");
      for (let i = 0; i < config.WARMUP_COUNT; i++) {
        await clickElement(page, "#run");
        await checkElementContainsText(page, "tbody>tr:nth-of-type(1)>td:nth-of-type(1)", (i*1000+1).toFixed());
      }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    await checkElementContainsText(page, "tbody>tr:nth-of-type(1)>td:nth-of-type(1)", "5001");
  }
}

export const benchUpdate = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_03]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      for (let i = 0; i < 3; i++) {
        await clickElement(page, "#update");
        await checkElementContainsText(page, "tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a", ' !!!'.repeat(i + 1));
      }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#update");
    await checkElementContainsText(page, "tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a", ' !!!'.repeat(3 + 1));
  }
}

export const benchSelect = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_04]);
  }
  async init(browser: Browser,page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
  }
  async run(browser: Browser,page: Page) {
      await clickElement(page, "tbody>tr:nth-of-type(2)>td:nth-of-type(2)>a");
      await checkElementHasClass(page, "tbody>tr:nth-of-type(2)", "danger");
  }
}

export const benchSwapRows = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_05]);
  }
  async init(browser: Browser,page: Page) {
      await checkElementExists(page, "#run");
      await clickElement(page, "#run");
      await checkElementExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      for (let i = 0; i <= config.WARMUP_COUNT; i++) {
          let text = ((i%2) == 0) ? "2" : "999";
          await clickElement(page, "#swaprows");
          await checkElementContainsText(page, "tbody>tr:nth-of-type(999)>td:nth-of-type(1)", text);
      }
  }
  async run(browser: Browser,page: Page) {
      await clickElement(page, "#swaprows");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(999)>td:nth-of-type(1)", "2");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(2)>td:nth-of-type(1)", "999");
  }
}

export const benchRemove = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_06]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      for (let i = 0; i < config.WARMUP_COUNT; i++) {
          await checkElementContainsText(page, `tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(1)`, (config.WARMUP_COUNT - i + 4).toString());
          await clickElement(page, `tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(3)>a>span:nth-of-type(1)`);
          await checkElementContainsText(page, `tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(1)`, "10");
      }
      await checkElementContainsText(page, `tbody>tr:nth-of-type(5)>td:nth-of-type(1)`, "10");
      await checkElementContainsText(page, `tbody>tr:nth-of-type(4)>td:nth-of-type(1)`, "4");

      // Click on a row the second time
      await checkElementContainsText(page, `tbody>tr:nth-of-type(6)>td:nth-of-type(1)`, "11");
      await clickElement(page, `tbody>tr:nth-of-type(6)>td:nth-of-type(3)>a>span:nth-of-type(1)`);
      await checkElementContainsText(page, `tbody>tr:nth-of-type(6)>td:nth-of-type(1)`, "12");

  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, `tbody>tr:nth-of-type(4)>td:nth-of-type(3)>a>span:nth-of-type(1)`);
    await checkElementContainsText(page, `tbody>tr:nth-of-type(4)>td:nth-of-type(1)`, "10");
  }
}

export const benchRunBig = new class extends CPUBenchmarkPlaywright {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_07]);
    }
    async init(browser: Browser, page: Page) {
      await checkElementExists(page, "#runlots");
    }
    async run(browser: Browser, page: Page) {
      await clickElement(page, "#runlots");
      await checkElementExists(page, "tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a");
    }
  }
  

  export const benchAppendToManyRows = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_08]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#add");
    await checkElementExists(page, "tbody>tr:nth-of-type(2000)>td:nth-of-type(1)");
  }
}

export const benchClear = new class extends CPUBenchmarkPlaywright {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_09]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
  async run(browser: Browser, page: Page) {
      await clickElement(page, "#clear");
      await checkElementNotExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
}

export const benchReadyMemory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_21]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {}
  async after(page: Page, framework: FrameworkData) {}
})();

export const benchRunMemory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_22]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    await checkElementExists(page, "tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a");
  }
})();


export const benchUpdate5Memory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_23]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "#update");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a", " !!!".repeat(i));
    }
  }
})();


export const benchReplace5Memory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_24]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "#run");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
    }
  }
})();

export const benchCreateClear5Memory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_25]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "#run");
      await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
      await clickElement(page, "#clear");
      await checkElementNotExists(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
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
   benchReadyMemory, 
   benchRunMemory, 
   benchUpdate5Memory,
   benchReplace5Memory, 
   benchCreateClear5Memory,
];
