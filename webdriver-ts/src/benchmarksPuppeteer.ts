// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Page } from "puppeteer-core";
import * as benchmarksCommon from "./benchmarksCommon";
import { BenchmarkType } from "./benchmarksCommon";
import { config, FrameworkData } from "./common";
import { checkElementContainsText, checkElementExists, checkElementHasClass, checkElementNotExists, clickElement } from "./puppeteerAccess";


export abstract class CPUBenchmarkPuppeteer implements benchmarksCommon.BenchmarkImpl {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: benchmarksCommon.CPUBenchmarkInfo) {
  }
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
  after(page: Page, framework: FrameworkData): Promise<any> {
    return null;
  }
}

export abstract class MemBenchmarkPuppeteer implements benchmarksCommon.BenchmarkImpl {
  type = BenchmarkType.MEM;
  constructor(public benchmarkInfo: benchmarksCommon.MemBenchmarkInfo) {
  }
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
  after(page: Page, framework: FrameworkData): Promise<any> {
    return null;
  }
}

export type TBenchmarkPuppeteer = CPUBenchmarkPuppeteer | MemBenchmarkPuppeteer;

export let benchRun = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_01]);
  }
  async init(page: Page) { 
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)", (i*1000+1).toFixed());
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
  }
  async run(page: Page) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", ((config.WARMUP_COUNT+1)*1000).toFixed());
  }

}

export const benchReplaceAll = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_02]);
  }
  async init(page: Page) {
      await checkElementExists(page, "pierce/#run");
      for (let i = 0; i < config.WARMUP_COUNT; i++) {
        await clickElement(page, "pierce/#run");
        await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)", (i*1000+1).toFixed());
      }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)", "5001");
  }
}

export const benchUpdate = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_03]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      for (let i = 0; i < 3; i++) {
        await clickElement(page, "pierce/#update");
        await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a", ' !!!'.repeat(i + 1));
      }
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#update");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(991)>td:nth-of-type(2)>a", ' !!!'.repeat(3 + 1));
  }
}

export const benchSelect = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_04]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
    for (let i = 0; i <= config.WARMUP_COUNT; i++) {
      await clickElement(page, `pierce/tbody>tr:nth-of-type(${i+5})>td:nth-of-type(2)>a`);
      await checkElementHasClass(page, `pierce/tbody>tr:nth-of-type(${i+5})`, "danger");
    }
  }
  async run(page: Page) {
      await clickElement(page, "pierce/tbody>tr:nth-of-type(2)>td:nth-of-type(2)>a");
      await checkElementHasClass(page, "pierce/tbody>tr:nth-of-type(2)", "danger");
  }
}

export const benchSwapRows = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_05]);
  }
  async init(page: Page) {
      await checkElementExists(page, "pierce/#run");
      await clickElement(page, "pierce/#run");
      await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      for (let i = 0; i <= config.WARMUP_COUNT; i++) {
          let text = ((i%2) == 0) ? "2" : "999";
          await clickElement(page, "pierce/#swaprows");
          await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(999)>td:nth-of-type(1)", text);
      }
  }
  async run(page: Page) {
      await clickElement(page, "pierce/#swaprows");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(999)>td:nth-of-type(1)", "2");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(2)>td:nth-of-type(1)", "999");
  }
}

export const benchRemove = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_06]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      for (let i = 0; i < config.WARMUP_COUNT; i++) {
          await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(1)`, (config.WARMUP_COUNT - i + 4).toString());
          await clickElement(page, `pierce/tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(3)>a>span:nth-of-type(1)`);
          await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(${config.WARMUP_COUNT - i + 4})>td:nth-of-type(1)`, "10");
      }
      await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(5)>td:nth-of-type(1)`, "10");
      await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(4)>td:nth-of-type(1)`, "4");

      // Click on a row the second time
      await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(6)>td:nth-of-type(1)`, "11");
      await clickElement(page, `pierce/tbody>tr:nth-of-type(6)>td:nth-of-type(3)>a>span:nth-of-type(1)`);
      await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(6)>td:nth-of-type(1)`, "12");

  }
  async run(page: Page) {
    await clickElement(page, `pierce/tbody>tr:nth-of-type(4)>td:nth-of-type(3)>a>span:nth-of-type(1)`);
    await checkElementContainsText(page, `pierce/tbody>tr:nth-of-type(4)>td:nth-of-type(1)`, "10");
  }
}
export const benchRunBig = new class extends CPUBenchmarkPuppeteer {
  constructor() {
    super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_07]);
    }
    async init(page: Page) {
      await checkElementExists(page, "pierce/#run");
      for (let i = 0; i < config.WARMUP_COUNT; i++) {
        await clickElement(page, "pierce/#run");
        await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)", (i*1000+1).toFixed());
        await clickElement(page, "pierce/#clear");
        await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
      }    
    }
    async run(page: Page) {
      await clickElement(page, "pierce/#runlots");
      await checkElementExists(page, "pierce/tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a");
    }
  }
  

  export const benchAppendToManyRows = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_08]);
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
}

export const benchClear = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super(benchmarksCommon.cpuBenchmarkInfos[benchmarksCommon.BENCHMARK_09]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)", (i*1000+1).toFixed());
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
    }
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(1)", (config.WARMUP_COUNT*1000+1).toFixed());
  }
  async run(page: Page) {
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
}

export const benchReadyMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_21]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {}
  async after(page: Page, framework: FrameworkData) {}
})();

export const benchRunMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_22]);
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
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_26]);
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
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_23]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#update");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a", " !!!".repeat(i));
    }
  }
})();

// export const benchReplace5Memory = new (class extends MemBenchmarkPuppeteer {
//   constructor() {
//     super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_24]);
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
    super(benchmarksCommon.memBenchmarkInfos[benchmarksCommon.BENCHMARK_25]);
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
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
  // benchReplace5Memory, 
  benchCreateClear5Memory,
  benchRun10KMemory
];
