// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Page } from "puppeteer-core";
import {
  BenchmarkType,
  Benchmark,
  memBenchmarkInfos,
  cpuBenchmarkInfos,
  CPUBenchmarkInfo,
  BenchmarkImpl,
  MemBenchmarkInfo,
} from "./benchmarksCommon.js";
import { config, FrameworkData } from "./common.js";
import {
  checkCountForSelector,
  checkElementContainsText,
  checkElementExists,
  checkElementHasClass,
  checkElementNotExists,
  clickElement,
} from "./puppeteerAccess.js";

export abstract class CPUBenchmarkPuppeteer implements BenchmarkImpl {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: CPUBenchmarkInfo) {}
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
}

export abstract class MemBenchmarkPuppeteer implements BenchmarkImpl {
  type = BenchmarkType.MEM;
  constructor(public benchmarkInfo: MemBenchmarkInfo) {}
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
}

export type BenchmarkPuppeteer = CPUBenchmarkPuppeteer | MemBenchmarkPuppeteer;

export const benchRun = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._01]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed()
      );
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(
      page,
      "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      ((config.WARMUP_COUNT + 1) * 1000).toFixed()
    );
  }
})();

export const benchReplaceAll = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._02]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed()
      );
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(
      page,
      "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
      "5001"
    );
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._03]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    for (let i = 0; i < 3; i++) {
      await clickElement(page, "pierce/#update");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a",
        " !!!".repeat(i + 1)
      );
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#update");
    await checkElementContainsText(
      page,
      "pierce/tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a",
      " !!!".repeat(3 + 1)
    );
  }
})();

export const benchSelect = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._04]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(
      page,
      "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      "1000"
    );
    for (let i = 0; i <= config.WARMUP_COUNT; i++) {
      await clickElement(page, `pierce/tbody>tr:nth-of-type(${i + 5})>td:nth-of-type(2)>a`);
      await checkElementHasClass(page, `pierce/tbody>tr:nth-of-type(${i + 5})`, "danger");
      await checkCountForSelector(page, "pierce/tbody>tr.danger", 1);
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/tbody>tr:nth-of-type(2)>td:nth-of-type(2)>a");
    await checkElementHasClass(page, "pierce/tbody>tr:nth-of-type(2)", "danger");
  }
})();

export const benchSwapRows = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._05]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    for (let i = 0; i <= config.WARMUP_COUNT; i++) {
      const text = i % 2 == 0 ? "2" : "999";
      await clickElement(page, "pierce/#swaprows");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(999)>td:nth-of-type(1)",
        text
      );
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#swaprows");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(999)>td:nth-of-type(1)", "2");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(2)>td:nth-of-type(1)", "999");
  }
})();

export const benchRemove = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._06]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await checkElementContainsText(
        page,
        `pierce/tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(1)`,
        (config.WARMUP_COUNT - i + 4).toString()
      );
      await clickElement(
        page,
        `pierce/tbody>tr:nth-of-type(${
          config.WARMUP_COUNT - i + 4
        })>td:nth-of-type(3)>a>span:nth-of-type(1)`
      );
      await checkElementContainsText(
        page,
        `pierce/tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(1)`,
        "10"
      );
    }
    await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(5)>td:nth-of-type(1)`, "10");
    await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(4)>td:nth-of-type(1)`, "4");

    // Click on a row the second time
    await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(6)>td:nth-of-type(1)`, "11");
    await clickElement(
      page,
      `pierce/tbody>tr:nth-of-type(6)>td:nth-of-type(3)>a>span:nth-of-type(1)`
    );
    await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(6)>td:nth-of-type(1)`, "12");
  }
  async run(page: Page) {
    await clickElement(
      page,
      `pierce/tbody>tr:nth-of-type(4)>td:nth-of-type(3)>a>span:nth-of-type(1)`
    );
    await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(4)>td:nth-of-type(1)`, "10");
  }
})();
export const benchRunBig = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._07]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed()
      );
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#runlots");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a");
  }
})();

export const benchAppendToManyRows = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._08]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#add");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(2000)>td:nth-of-type(1)");
  }
})();

export const benchClear = new (class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._09]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed()
      );
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(
      page,
      "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
      (config.WARMUP_COUNT * 1000 + 1).toFixed()
    );
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#clear");
    await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
})();

export const benchReadyMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._21]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run() {
    return await Promise.resolve(null);
  }
})();

export const benchRunMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._22]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a");
  }
})();

export const benchRun10KMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._26]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#runlots");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#runlots");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a");
  }
})();

export const benchUpdate5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._23]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(2)>a");
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#update");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a",
        " !!!".repeat(i)
      );
    }
  }
})();

// export const benchReplace5Memory = new (class extends MemBenchmarkPuppeteer {
//   constructor() {
//     super(memBenchmarkInfos[Benchmark._24]);
//   }
//   async init(page: Page) {
//     await checkElementExists(page, "pierce/#run");
//   }
//   async run(page: Page) {
//     for (let i = 0; i < 5; i++) {
//       await clickElement(page, "pierce/#run");
//       await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
//     }
//   }
// })();

export const benchCreateClear5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(memBenchmarkInfos[Benchmark._25]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(
        page,
        "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
        (1000 * (i + 1)).toFixed()
      );
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
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
  benchReadyMemory,
  benchRunMemory,
  benchUpdate5Memory,
  // benchReplace5Memory,
  benchCreateClear5Memory,
  benchRun10KMemory,
];
