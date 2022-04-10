// import { testTextContains, testTextContainsJS, testTextNotContained, testClassContains, testElementLocatedByXpath, testElementNotLocatedByXPath, testElementLocatedById, clickElementById, clickElementByXPath, getTextByXPath } from './webdriverAccess'

import { Browser, Page, Puppeteer } from "puppeteer-core";
import { TBenchmark, BenchmarkType } from "./benchmarksCommon";
import { config, FrameworkData } from "./common";
import { clickElement, checkElementHasClass, checkElementExists, checkElementNotExists, checkElementContainsText } from "./puppeteerAccess";
import * as benchmarksCommon from "./benchmarksCommon";
import {slowDownFactor, slowDownNote, DurationMeasurementMode} from "./benchmarksCommon";


export abstract class CPUBenchmarkPuppeteer implements benchmarksCommon.BenchmarkImpl {
  type = BenchmarkType.CPU;
  constructor(public benchmarkInfo: benchmarksCommon.CPUBenchmark) {
  }
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;
  after(page: Page, framework: FrameworkData): Promise<any> {
    return null;
  }
}

export abstract class MemBenchmarkPuppeteer implements benchmarksCommon.BenchmarkImpl {
  type = BenchmarkType.MEM;
  constructor(public benchmarkInfo: benchmarksCommon.MemBenchmark) {
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
      super({
        id: benchmarksCommon.BENCHMARK_01,
        label: "create rows",
        description: "creating 1,000 rows" + slowDownNote(benchmarksCommon.BENCHMARK_01),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_01),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT
      });
  }
  async init(page: Page) { 
      await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
      await clickElement(page, "pierce/#add");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
  }
}

export const benchReplaceAll = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super({
        id: benchmarksCommon.BENCHMARK_02,
        label: "replace all rows",
        description: "updating all 1,000 rows (" + config.WARMUP_COUNT +
                    " warmup runs)." + slowDownNote(benchmarksCommon.BENCHMARK_02),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_02),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
      });
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
      super({
        id: benchmarksCommon.BENCHMARK_03,
        label: "partial update",
        description: "updating every 10th row for 1,000 rows (3 warmup runs)." +
                    slowDownNote(benchmarksCommon.BENCHMARK_03),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_03),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
      });
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
      super({
        id: benchmarksCommon.BENCHMARK_04,
        label: "select row",
        description: "highlighting a selected row. (no warmup runs)." +
                    slowDownNote(benchmarksCommon.BENCHMARK_04),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_04),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
      });
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
  }
  async run(page: Page) {
      await clickElement(page, "pierce/tbody>tr:nth-of-type(2)>td:nth-of-type(2)>a");
      await checkElementHasClass(page, "pierce/tbody>tr:nth-of-type(2)", "danger");
  }
}

export const benchSwapRows = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super({
        id: benchmarksCommon.BENCHMARK_05,
        label: "swap rows",
        description: "swap 2 rows for table with 1,000 rows. (" +
                      config.WARMUP_COUNT +" warmup runs)." +
                      slowDownNote(benchmarksCommon.BENCHMARK_05),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_05),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
    });
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
      super({
        id: benchmarksCommon.BENCHMARK_06,
        label: "remove row",
        description: "removing one row. (" +config.WARMUP_COUNT +" warmup runs)." +
                    slowDownNote(benchmarksCommon.BENCHMARK_06),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_06),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
      });
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
    super({
      id: benchmarksCommon.BENCHMARK_07,
        label: "create many rows" + slowDownNote(benchmarksCommon.BENCHMARK_07),
        description: "creating 10,000 rows",
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_07),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT
      });
    }
    async init(page: Page) {
      await checkElementExists(page, "pierce/#runlots");
    }
    async run(page: Page) {
      await clickElement(page, "pierce/#runlots");
      await checkElementExists(page, "pierce/tbody>tr:nth-of-type(10000)>td:nth-of-type(2)>a");
    }
  }
  

  export const benchAppendToManyRows = new class extends CPUBenchmarkPuppeteer {
  constructor() {
      super({
        id: benchmarksCommon.BENCHMARK_08,
        label: "append rows to large table",
        description: "appending 1,000 to a table of 10,000 rows." +
                    slowDownNote(benchmarksCommon.BENCHMARK_08),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_08),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
      });
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
      super({
        id: benchmarksCommon.BENCHMARK_09,
        label: "clear rows",
        description: "clearing a table with 1,000 rows." + slowDownNote(benchmarksCommon.BENCHMARK_09),
        type: BenchmarkType.CPU,
        throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_09),
        allowBatching: true,
        durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
      });
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
  async run(page: Page) {
      await clickElement(page, "pierce/#clear");
      await checkElementNotExists(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)");
  }
}

export const benchReadyMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_21,
      label: "ready memory",
      description: "Memory usage after page load.",
      type: BenchmarkType.MEM,
    });
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {}
  async after(page: Page, framework: FrameworkData) {}
})();

export const benchRunMemory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_22,
      label: "run memory",
      description: "Memory usage after adding 1000 rows.",
      type: BenchmarkType.MEM,
    });
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    await clickElement(page, "pierce/#run");
    await checkElementExists(page, "pierce/tbody>tr:nth-of-type(1)>td:nth-of-type(2)>a");
  }
})();

export const benchUpdate5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_23,
      label: "update every 10th row for 1k rows (5 cycles)",
      description: "Memory usage after clicking update every 10th row 5 times",
      type: BenchmarkType.MEM,
    });
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

export const benchReplace5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_24,
      label: "replace 1k rows (5 cycles)",
      description: "Memory usage after clicking create 1000 rows 5 times",
      type: BenchmarkType.MEM,
    });
  }
  async init(page: Page) {
    await checkElementExists(page, "pierce/#run");
  }
  async run(page: Page) {
    for (let i = 0; i < 5; i++) {
      await clickElement(page, "pierce/#run");
      await checkElementContainsText(page, "pierce/tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", (1000 * (i + 1)).toFixed());
    }
  }
})();

export const benchCreateClear5Memory = new (class extends MemBenchmarkPuppeteer {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_25,
      label: "creating/clearing 1k rows (5 cycles)",
      description: "Memory usage after creating and clearing 1000 rows 5 times",
      type: BenchmarkType.MEM,
    });
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


export function fileNameTrace(framework: FrameworkData, benchmark: TBenchmark, run: number) {
  return `${config.TRACES_DIRECTORY}/${framework.fullNameWithKeyedAndVersion}_${benchmark.id}_${run}.json`;
}