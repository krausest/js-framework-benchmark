// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Browser, Page } from "playwright-core";
import {
  Benchmark,
  BenchmarkType,
  BenchmarkImpl,
  CPUBenchmarkInfo,
  MemBenchmarkInfo,
  cpuBenchmarkInfos,
  memBenchmarkInfos,
} from "./benchmarksCommon.js";
import { config, FrameworkData } from "./common.js";
import {
  checkCountForSelector,
  checkElementContainsText,
  checkElementExists,
  checkElementHasClass,
  checkElementNotExists,
  clickElement,
} from "./playwrightAccess.js";

const WARMUP_COUNT = config.WARMUP_COUNT;

export abstract class CPUBenchmarkPlaywright implements BenchmarkImpl {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: CPUBenchmarkInfo) {}
  abstract init(
    browser: Browser,
    page: Page,
    framework: FrameworkData,
  ): Promise<void>;
  abstract run(
    browser: Browser,
    page: Page,
    framework: FrameworkData,
  ): Promise<void>;
}

export abstract class MemBenchmarkPlaywright implements BenchmarkImpl {
  type = BenchmarkType.MEM;
  constructor(public benchmarkInfo: MemBenchmarkInfo) {}
  abstract init(
    browser: Browser,
    page: Page,
    framework: FrameworkData,
  ): Promise<void>;
  abstract run(
    browser: Browser,
    page: Page,
    framework: FrameworkData,
  ): Promise<void>;
}

export type TBenchmarkPlaywright =
  | CPUBenchmarkPlaywright
  | MemBenchmarkPlaywright;

export const benchRun = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._01]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElement(page, "#run");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed(),
      );
      await clickElement(page, "#clear");
      await checkElementNotExists(
        page,
        "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      );
    }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      ((WARMUP_COUNT + 1) * 1000).toFixed(),
    );
  }
})();

export const benchReplaceAll = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._02]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElement(page, "#run");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed(),
      );
    }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
      "5001",
    );
  }
})();

export const benchUpdate = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._03]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
    );
    for (let i = 0; i < 3; i++) {
      await clickElement(page, "#update");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a",
        " !!!".repeat(i + 1),
      );
    }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#update");
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a",
      " !!!".repeat(3 + 1),
    );
  }
})();

export const benchSelect = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._04]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      "1000",
    );
    for (let i = 0; i <= WARMUP_COUNT; i++) {
      await clickElement(
        page,
        `tbody>tr:nth-of-type(${i + 5})>td:nth-of-type(2)>a`,
      );
      await checkElementHasClass(
        page,
        `tbody>tr:nth-of-type(${i + 5})`,
        "danger",
      );
      await checkCountForSelector(page, "tbody>tr.danger", 1);
    }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "tbody>tr:nth-of-type(2)>td:nth-of-type(2)>a");
    await checkElementHasClass(page, "tbody>tr:nth-of-type(2)", "danger");
  }
})();

export const benchSwapRows = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._05]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
    );
    for (let i = 0; i <= WARMUP_COUNT; i++) {
      const text = i % 2 == 0 ? "2" : "999";
      await clickElement(page, "#swaprows");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(999)>td:nth-of-type(1)",
        text,
      );
    }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#swaprows");
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(999)>td:nth-of-type(1)",
      "2",
    );
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(2)>td:nth-of-type(1)",
      "999",
    );
  }
})();

export const benchRemove = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._06]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
    );
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await checkElementContainsText(
        page,
        `tbody>tr:nth-of-type(${WARMUP_COUNT - i + 4})>td:nth-of-type(1)`,
        (WARMUP_COUNT - i + 4).toString(),
      );
      await clickElement(
        page,
        `tbody>tr:nth-of-type(${
          WARMUP_COUNT - i + 4
        })>td:nth-of-type(3)>a>span:nth-of-type(1)`,
      );
      await checkElementContainsText(
        page,
        `tbody>tr:nth-of-type(${WARMUP_COUNT - i + 4})>td:nth-of-type(1)`,
        "10",
      );
    }
    await checkElementContainsText(
      page,
      `tbody>tr:nth-of-type(5)>td:nth-of-type(1)`,
      "10",
    );
    await checkElementContainsText(
      page,
      `tbody>tr:nth-of-type(4)>td:nth-of-type(1)`,
      "4",
    );

    // Click on a row the second time
    await checkElementContainsText(
      page,
      `tbody>tr:nth-of-type(6)>td:nth-of-type(1)`,
      "11",
    );
    await clickElement(
      page,
      `tbody>tr:nth-of-type(6)>td:nth-of-type(3)>a>span:nth-of-type(1)`,
    );
    await checkElementContainsText(
      page,
      `tbody>tr:nth-of-type(6)>td:nth-of-type(1)`,
      "12",
    );
  }
  async run(browser: Browser, page: Page) {
    await clickElement(
      page,
      `tbody>tr:nth-of-type(4)>td:nth-of-type(3)>a>span:nth-of-type(1)`,
    );
    await checkElementContainsText(
      page,
      `tbody>tr:nth-of-type(4)>td:nth-of-type(1)`,
      "10",
    );
  }
})();

export const benchRunBig = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._07]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElement(page, "#run");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed(),
      );
      await clickElement(page, "#clear");
      await checkElementNotExists(
        page,
        "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      );
    }
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#runlots");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a",
    );
  }
})();

export const benchAppendToManyRows = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._08]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    await clickElement(page, "#run");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
    );
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#add");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(2000)>td:nth-of-type(1)",
    );
  }
})();

export const benchClear = new (class extends CPUBenchmarkPlaywright {
  constructor() {
    super(cpuBenchmarkInfos[Benchmark._09]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
    for (let i = 0; i < WARMUP_COUNT; i++) {
      await clickElement(page, "#run");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
        (i * 1000 + 1).toFixed(),
      );
      await clickElement(page, "#clear");
      await checkElementNotExists(
        page,
        "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
      );
    }
    await clickElement(page, "#run");
    await checkElementContainsText(
      page,
      "tbody>tr:nth-of-type(1)>td:nth-of-type(1)",
      (WARMUP_COUNT * 1000 + 1).toFixed(),
    );
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#clear");
    await checkElementNotExists(
      page,
      "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
    );
  }
})();

export const benchReadyMemory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(memBenchmarkInfos[Benchmark._21]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(browser: Browser, page: Page) {
    return await Promise.resolve(null);
  }
})();

export const benchRunMemory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(memBenchmarkInfos[Benchmark._22]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a",
    );
  }
})();

export const benchRun10KMemory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(memBenchmarkInfos[Benchmark._26]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#runlots");
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#runlots");
    await checkElementExists(
      page,
      "tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a",
    );
  }
})();

export const benchUpdate5Memory = new (class extends MemBenchmarkPlaywright {
  constructor() {
    super(memBenchmarkInfos[Benchmark._23]);
  }
  async init(browser: Browser, page: Page) {
    await checkElementExists(page, "#run");
  }
  async run(browser: Browser, page: Page) {
    await clickElement(page, "#run");
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "#update");
      await checkElementContainsText(
        page,
        "tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a",
        " !!!".repeat(i),
      );
    }
  }
})();

// export const benchReplace5Memory = new (class extends MemBenchmarkPlaywright {
//   constructor() {
//     super(memBenchmarkInfos[Benchmark._24]);
//   }
//   async init(browser: Browser, page: Page) {
//     await checkElementExists(page, "#run");
//   }
//   async run(browser: Browser, page: Page) {
//     for (let i = 0; i < 5; i++) {
//       await clickElement(page, "#run");
//       await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
//     }
//   }
// })();

export const benchCreateClear5Memory =
  new (class extends MemBenchmarkPlaywright {
    constructor() {
      super(memBenchmarkInfos[Benchmark._25]);
    }
    async init(browser: Browser, page: Page) {
      await checkElementExists(page, "#run");
    }
    async run(browser: Browser, page: Page) {
      for (let i = 0; i < 5; i++) {
        await clickElement(page, "#run");
        await checkElementContainsText(
          page,
          "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
          (1000 * (i + 1)).toFixed(),
        );
        await clickElement(page, "#clear");
        await checkElementNotExists(
          page,
          "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)",
        );
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
  benchRun10KMemory,
  benchUpdate5Memory,
  benchCreateClear5Memory,
];
