import { BenchmarkInfo, BenchmarkType } from "./benchmarksGeneric";
import {
  testTextContains,
  testTextNotContained,
  testClassContains,
  testStyle,
  testElementLocatedByXpath,
  testElementNotLocatedByXPath,
  testElementLocatedById,
  clickElementById,
  clickElementByXPath,
  getTextByXPath,
} from "./webdriverAccess";
import { Builder, WebDriver, promise, logging } from "selenium-webdriver";
import { config, FrameworkData } from "./common";

const BENCHMARK_01 = "01_run1k";
const BENCHMARK_02 = "02_replace1k";
const BENCHMARK_03 = "03_update10th1k_x16";
const BENCHMARK_04 = "04_select1k";
const BENCHMARK_05 = "05_swap1k";
const BENCHMARK_06 = "06_remove-one-1k";
const BENCHMARK_07 = "07_create10k";
const BENCHMARK_08 = "08_create1k-after1k_x2";
const BENCHMARK_09 = "09_clear1k_x8";
const BENCHMARK_31 = "31_startup-ci";

type TBenchmarkID =
  | typeof BENCHMARK_01
  | typeof BENCHMARK_02
  | typeof BENCHMARK_03
  | typeof BENCHMARK_04
  | typeof BENCHMARK_05
  | typeof BENCHMARK_06
  | typeof BENCHMARK_07
  | typeof BENCHMARK_08
  | typeof BENCHMARK_09
  | typeof BENCHMARK_31;

type ISlowDowns = {
  [key in TBenchmarkID]?: number;
};

const slowDownsOSX: ISlowDowns = {
  [BENCHMARK_03]: 2,
  [BENCHMARK_04]: 4,
  [BENCHMARK_05]: 2,
  [BENCHMARK_09]: 2,
};

const slowDownsLinux: ISlowDowns = {
  [BENCHMARK_03]: 16,
  [BENCHMARK_04]: 16,
  [BENCHMARK_05]: 4,
  [BENCHMARK_08]: 2,
  [BENCHMARK_09]: 8,
};

const slowDowns: ISlowDowns = process.platform == "darwin" ? slowDownsOSX : slowDownsLinux;

function slowDownNote(benchmark: TBenchmarkID): string {
  return slowDowns[benchmark] ? " " + slowDowns[benchmark] + "x CPU slowdown." : "";
}

function slowDownFactor(benchmark: TBenchmarkID): number | undefined {
  return slowDowns[benchmark] ? slowDowns[benchmark] : undefined;
}

const SHORT_TIMEOUT = 20 * 1000;

export abstract class BenchmarkWebdriver {
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

const benchRun = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_01,
      label: "create rows",
      description: "creating 1,000 rows" + slowDownNote(BENCHMARK_01),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_01),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "add", SHORT_TIMEOUT, true);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "add", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
})();

const benchReplaceAll = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_02,
      label: "replace all rows",
      description: "updating all 1,000 rows (" + config.WARMUP_COUNT + " warmup runs)." + slowDownNote(BENCHMARK_02),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_02),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElementById(driver, "run", true);
      await testElementLocatedByXpath(driver, "//*[position()=1][text()='" + (i * 1000 + 1).toFixed() + "']", config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=1][text()='5001']", config.TIMEOUT, false);
  }
})();

const benchUpdate = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_03,
      label: "partial update",
      description: "updating every 10th row for 1,000 rows (3 warmup runs)." + slowDownNote(BENCHMARK_03),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_03),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
    for (let i = 0; i < 3; i++) {
      await clickElementById(driver, "update", true);
      await testTextContains(driver, "//*[position()=11][*[1]/text()='11']/*[2]", " !!!".repeat(i + 1), config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "update", true);
    await testTextContains(driver, "//*[position()=11][*[1]/text()='11']/*[2]", " !!!".repeat(3 + 1), config.TIMEOUT, false);
  }
})();

const benchSelect = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_04,
      label: "select row",
      description: "highlighting a selected row. (no warmup runs)." + slowDownNote(BENCHMARK_04),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_04),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementByXPath(driver, "//*[position()=7]/*[1][text()='7']/following-sibling::*/descendant-or-self::*", false);
    await testStyle(driver, "//*[position()=7]/*[1][text()='7']", "background-color", "rgba(235, 204, 204, 1)", config.TIMEOUT, false);
  }
})();

const benchSwapRows = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_05,
      label: "swap rows",
      description: "swap 2 rows for table with 1,000 rows. (" + config.WARMUP_COUNT + " warmup runs)." + slowDownNote(BENCHMARK_05),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_05),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
    for (let i = 0; i <= config.WARMUP_COUNT; i++) {
      await testElementLocatedByXpath(driver, "//*[position()=2]/*[position()=1][text()='" + ( i%2 ? 999 : 2 ) + "']", config.TIMEOUT, false);
      await clickElementById(driver, "swaprows", true);
      await testElementLocatedByXpath(driver, "//*[position()=2]/*[position()=1][text()='" + ( i%2 ? 2 : 999 ) + "']", config.TIMEOUT, false);
    }
  }
  async run(driver: WebDriver) {
    await testElementLocatedByXpath(driver, "//*[position()=2]/*[position()=1][text()='2']", config.TIMEOUT, false);
    await clickElementById(driver, "swaprows", true);
    await testElementLocatedByXpath(driver, "//*[position()=2]/*[position()=1][text()='999']", config.TIMEOUT, false);
  }
})();

const benchRemove = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_06,
      label: "remove row",
      description: "removing one row. (" + config.WARMUP_COUNT + " warmup runs)." + slowDownNote(BENCHMARK_06),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_06),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
    for (let i = 0; i < config.WARMUP_COUNT; i++) {
      await clickElementByXPath(driver, `//*[position()=1][text()='${config.WARMUP_COUNT - i + 4}']/../*[3]/*`, false);
      await testElementLocatedByXpath(driver, `//*[position()=${config.WARMUP_COUNT - i + 4}]/*[1][text()='${config.WARMUP_COUNT + 5}']`, config.TIMEOUT, false);
    }
    await testElementLocatedByXpath(driver, `//*[position()=5]/*[1][text()='10']`, config.TIMEOUT, false);
    await testElementLocatedByXpath(driver, `//*[position()=4]/*[1][text()='4']`, config.TIMEOUT, false);
    
    // Click on a row the second time
    await clickElementByXPath(driver, `//*[position()=6]/*[1][text()='11']/../*[3]/*`, false);
    await testElementLocatedByXpath(driver, `//*[position()=6]/*[1][text()='12']`, config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementByXPath(driver, `//*[position()=4]/*[1][text()='4']/../*[3]/*`, false);
    await testElementLocatedByXpath(driver, `//*[position()=4]/*[1][text()='10']`, config.TIMEOUT, false);
  }
})();

const benchRunBig = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_07,
      label: "create many rows" + slowDownNote(BENCHMARK_07),
      description: "creating 10,000 rows",
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_07),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "runlots", SHORT_TIMEOUT, true);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "runlots", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
})();

const benchAppendToManyRows = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_08,
      label: "append rows to table",
      description: "appending 1,000 to a table of 1,000 rows." + slowDownNote(BENCHMARK_08),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_08),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "add", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
})();

const benchClear = new (class extends BenchmarkWebdriver {
  constructor() {
    super({
      id: BENCHMARK_09,
      label: "clear rows",
      description: "clearing a table with 1,000 rows." + slowDownNote(BENCHMARK_09),
      type: BenchmarkType.CPU,
      throttleCPU: slowDownFactor(BENCHMARK_09),
      allowBatching: true,
    });
  }
  async init(driver: WebDriver) {
    await testElementLocatedById(driver, "run", SHORT_TIMEOUT, true);
    await clickElementById(driver, "run", true);
    await testElementLocatedByXpath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
  async run(driver: WebDriver) {
    await clickElementById(driver, "clear", true);
    await testElementNotLocatedByXPath(driver, "//*[position()=7]/*[1][text()='7']", config.TIMEOUT, false);
  }
})();

const benchStartupConsistentlyInteractive: StartupBenchmarkResult = {
  id: BENCHMARK_31,
  label: "consistently interactive",
  description: "a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)",
  type: BenchmarkType.STARTUP,
  property: "TimeToConsistentlyInteractive",
  allowBatching: false,
};

const benchStartupBootup: StartupBenchmarkResult = {
  id: "32_startup-bt",
  label: "script bootup time",
  description: "the total ms required to parse/compile/evaluate all the page's scripts",
  type: BenchmarkType.STARTUP,
  property: "ScriptBootUpTtime",
  allowBatching: false,
};

const benchStartupMainThreadWorkCost: StartupBenchmarkResult = {
  id: "33_startup-mainthreadcost",
  label: "main thread work cost",
  description: "total amount of time spent doing work on the main thread. includes style/layout/etc.",
  type: BenchmarkType.STARTUP,
  property: "MainThreadWorkCost",
  allowBatching: false,
};

const benchStartupTotalBytes: StartupBenchmarkResult = {
  id: "34_startup-totalbytes",
  label: "total kilobyte weight",
  description: "network transfer cost (post-compression) of all the resources loaded into the page.",
  type: BenchmarkType.STARTUP,
  property: "TotalKiloByteWeight",
  allowBatching: false,
};

class BenchStartup extends BenchmarkWebdriver {
  constructor() {
    super({
      id: "30_startup",
      label: "startup time",
      description: "Time for loading, parsing and starting up",
      type: BenchmarkType.STARTUP,
      allowBatching: false,
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
const benchStartup = new BenchStartup();

export let benchmarksWebdriver: Array<BenchmarkWebdriver> = [
  benchRun,
  benchReplaceAll,
  benchUpdate,
  benchSelect,
  benchSwapRows,
  benchRemove,
  benchRunBig,
  benchAppendToManyRows,
  benchClear,
  benchStartup,
];
