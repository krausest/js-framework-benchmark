import { BenchmarkInfo, BenchmarkType } from "./benchmarksCommon";
import {
  testTextContains,
  testTextNotContained,
  testClassContains,
  testElementLocatedByXpath,
  testElementNotLocatedByXPath,
  testElementLocatedById,
  clickElementById,
  clickElementByXPath,
  getTextByXPath,
} from "./webdriverAccess";
import { Builder, WebDriver, promise, logging } from "selenium-webdriver";
import { config, FrameworkData } from "./common";
import * as benchmarksCommon from "./benchmarksCommon";
import {slowDownFactor, slowDownNote, DurationMeasurementMode} from "./benchmarksCommon";


const SHORT_TIMEOUT = 20 * 1000;

export abstract class BenchmarkWebdriver {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
  throttleCPU?: number;
  allowBatching: boolean;
  durationMeasurementMode: DurationMeasurementMode;

  constructor(public benchmarkInfo: BenchmarkInfo) {
    this.id = benchmarkInfo.id;
    this.type = benchmarkInfo.type;
    this.label = benchmarkInfo.label;
    this.description = benchmarkInfo.description;
    this.throttleCPU = benchmarkInfo.throttleCPU;
    this.allowBatching = benchmarkInfo.allowBatching;
    this.durationMeasurementMode = benchmarkInfo.durationMeasurementMode;
  }
  abstract init(driver: WebDriver, framework: FrameworkData): Promise<any>;
  abstract run(driver: WebDriver, framework: FrameworkData): Promise<any>;
  after(driver: WebDriver, framework: FrameworkData): Promise<any> {
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

export interface LighthouseData {
  TimeToConsistentlyInteractive: number;
  ScriptBootUpTtime: number;
  MainThreadWorkCost: number;
  TotalKiloByteWeight: number;
  [propName: string]: number;
}

export interface StartupBenchmarkResult extends BenchmarkInfo {
  property: keyof LighthouseData;
}

export const benchRun = new (class extends BenchmarkWebdriver {
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
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "add", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchReplaceAll = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_02,
      label: "replace all rows",
      description: "updating all 1,000 rows (" + config.WARMUP_COUNT + " warmup runs)." + slowDownNote(benchmarksCommon.BENCHMARK_02),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_02),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT
    });
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

export const benchUpdate = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_03,
      label: "partial update",
      description: "updating every 10th row for 1,000 rows (3 warmup runs)." + slowDownNote(benchmarksCommon.BENCHMARK_03),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_03),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT
    });
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

export const benchSelect = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_04,
      label: "select row",
      description: "highlighting a selected row. (no warmup runs)." + slowDownNote(benchmarksCommon.BENCHMARK_04),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_04),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
    });
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

export const benchSwapRows = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_05,
      label: "swap rows",
      description: "swap 2 rows for table with 1,000 rows. (" + config.WARMUP_COUNT + " warmup runs)." + slowDownNote(benchmarksCommon.BENCHMARK_05),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_05),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
    });
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

export const benchRemove = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_06,
      label: "remove row",
      description: "removing one row. (" + config.WARMUP_COUNT + " warmup runs)." + slowDownNote(benchmarksCommon.BENCHMARK_06),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_06),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
    });
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

export const benchRunBig = new (class extends BenchmarkWebdriver {
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
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT, true);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "runlots", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a", config.TIMEOUT, false);
  }
})();

export const benchAppendToManyRows = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_08,
      label: "append rows to table",
      description: "appending 1,000 to a table of 1,000 rows." + slowDownNote(benchmarksCommon.BENCHMARK_08),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_08),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT
    });
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

export const benchClear = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: benchmarksCommon.BENCHMARK_09,
      label: "clear rows",
      description: "clearing a table with 1,000 rows." + slowDownNote(benchmarksCommon.BENCHMARK_09),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(benchmarksCommon.BENCHMARK_09),
      allowBatching: true,
      durationMeasurementMode: DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//tbody/tr[1000]/td[2]/a", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "clear", true);
    await testElementNotLocatedByXPath(driver, "//tbody/tr[1]", config.TIMEOUT, false);
  }
})();

export const benchStartupConsistentlyInteractive: StartupBenchmarkResult = {
  id: benchmarksCommon.BENCHMARK_31,
  label: "consistently interactive",
  description: "a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)",
  type: BenchmarkType.STARTUP,
  property: "TimeToConsistentlyInteractive",
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export const benchStartupBootup: StartupBenchmarkResult = {
  id: "32_startup-bt",
  label: "script bootup time",
  description: "the total ms required to parse/compile/evaluate all the page's scripts",
  type: BenchmarkType.STARTUP,
  property: "ScriptBootUpTtime",
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export const benchStartupMainThreadWorkCost: StartupBenchmarkResult = {
  id: "33_startup-mainthreadcost",
  label: "main thread work cost",
  description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
  type: BenchmarkType.STARTUP,
  property: "MainThreadWorkCost",
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

export const benchStartupTotalBytes: StartupBenchmarkResult = {
  id: "34_startup-totalbytes",
  label: "total kilobyte weight",
  description: "network transfer cost (post-compression) of all the resources loaded into the page.",
  type: BenchmarkType.STARTUP,
  property: "TotalKiloByteWeight",
  allowBatching: false,
  durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
};

class BenchStartup extends BenchmarkWebdriver {
  constructor() {
    super({
      id: "30_startup",
      label: "startup time",
      description: "Time for loading, parsing and starting up",
      type: BenchmarkType.STARTUP,
      allowBatching: false,
      durationMeasurementMode: DurationMeasurementMode.LAST_PAINT
    });
  }
  async init(driver: WebDriver) {
    // not used with lighthouse
  }
  async run(driver: WebDriver, framework: FrameworkData) {
    // not used with lighthouse
  }
  extractResult(results: LighthouseData[], resultKind: BenchmarkInfo): number[] {
    return results.reduce((a, v) => {
      a.push(v[(resultKind as StartupBenchmarkResult).property]);
      return a;
    }, new Array<number>());
  }
  resultKinds() {
    return [benchStartupConsistentlyInteractive, benchStartupBootup, benchStartupTotalBytes];
  }
}
export const benchStartup = new BenchStartup();
