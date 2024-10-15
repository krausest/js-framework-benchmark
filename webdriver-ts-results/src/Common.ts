import { jStat } from "jstat";
import { formatEn } from "@/utils";
import { knownIssues } from "@/helpers/issues";

export enum StatisticResult {
  SLOWER,
  UNDECIDED,
  FASTER,
}
export enum DisplayMode {
  DISPLAY_MEAN,
  DISPLAY_MEDIAN,
  BOX_PLOT,
}
export enum CpuDurationMode {
  TOTAL = "total",
  SCRIPT = "script",
  RENDER = "paint",
} // Do not change the case of the values. They match the case of the `results` keys from `results.ts`.

export enum FrameworkType {
  KEYED,
  NON_KEYED,
}

export interface Framework {
  name: string;
  dir: string;
  type: FrameworkType;
  issues: number[];
  frameworkHomeURL: string;
  displayname: string;
}

const DEFAULT_RESULTS_KEY = "DEFAULT";

export enum BenchmarkType {
  CPU,
  MEM,
  STARTUP = 3,
  SIZE = 5,
}

const benchmarkTypes = [BenchmarkType.CPU, BenchmarkType.MEM, BenchmarkType.STARTUP, BenchmarkType.SIZE];

export interface Benchmark {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
}

export interface RawResult {
  f: number;
  b: {
    b: number;
    v: { [k: string]: number[] };
  }[];
}

export interface ResultValues {
  values: number[];
  mean: number;
  median: number;
  standardDeviation: number;
}
export interface Result {
  framework: string;
  benchmark: string;
  results: { [key: string]: ResultValues };
}

interface ResultData {
  benchmarks: Array<Benchmark>;
  results: Array<Array<TableResultValueEntry | null>>;
  geomMean: Array<TableResultGeommeanEntry | null>;
  comparison: Array<TableResultComparisonEntry | null>;
}

export const SORT_BY_NAME = "SORT_BY_NAME";
export const SORT_BY_GEOMMEAN_CPU = "SORT_BY_GEOMMEAN_CPU";
export const SORT_BY_GEOMMEAN_MEM = "SORT_BY_GEOMMEAN_MEM";
export const SORT_BY_GEOMMEAN_SIZE = "SORT_BY_GEOMMEAN_SIZE";
export const SORT_BY_GEOMMEAN_STARTUP = "SORT_BY_GEOMMEAN_STARTUP";
export type T_SORT_BY_GEOMMEAN =
  | typeof SORT_BY_GEOMMEAN_CPU
  | typeof SORT_BY_GEOMMEAN_MEM
  | typeof SORT_BY_GEOMMEAN_SIZE
  | typeof SORT_BY_GEOMMEAN_STARTUP;

const computeColor = function (factor: number): string {
  if (factor < 2.0) {
    const a = factor - 1.0;
    const r = (1.0 - a) * 99 + a * 255;
    const g = (1.0 - a) * 191 + a * 236;
    const b = (1.0 - a) * 124 + a * 132;
    return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
  } else {
    const a = Math.min((factor - 2.0) / 2.0, 1.0);
    const r = (1.0 - a) * 255 + a * 249;
    const g = (1.0 - a) * 236 + a * 105;
    const b = (1.0 - a) * 132 + a * 108;
    return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
  }
};

export class TableResultValueEntry {
  constructor(
    public key: string,
    public value: number,
    public formattedValue: string,
    public deviation: string | null,
    public factor: number,
    public formattedFactor: string,
    public bgColor: string,
    public textColor: string,
    public statisticResult: StatisticResult,
    // eslint-disable-next-line unicorn/no-useless-undefined
    public statisticallySignificantFactor: string | number | undefined = undefined
  ) {}
}

export class TableResultComparisonEntry {
  constructor(
    public key: string,
    public framework: Framework,
    public label: string,
    public bgColor: string,
    public textColor: string
  ) {}
}

export class TableResultGeommeanEntry {
  constructor(
    public key: string,
    public framework: Framework,
    public mean: number,
    public bgColor: string,
    public textColor: string
  ) {}
}

export interface ResultLookup {
  (benchmark: Benchmark, framework: Framework): Result | null;
}
export function convertToMap(results: Array<Result>): ResultLookup {
  const resultMap = new Map<string, Map<string, Result>>();

  results.forEach((r) => {
    if (!resultMap.has(r.benchmark)) resultMap.set(r.benchmark, new Map<string, Result>());
    resultMap.get(r.benchmark)!.set(r.framework, r);
  });

  const resultLookup = (benchmark: Benchmark, framework: Framework) => {
    const m = resultMap.get(benchmark.id);
    if (!m) return null;
    const v = m.get(framework.name);
    if (!v) return null;
    return v;
  };

  return resultLookup;
}

type StatisticTuple = [string, string, StatisticResult];

const undecided: StatisticTuple = ["#fff", "#000", StatisticResult.UNDECIDED];
const faster: StatisticTuple = ["#00b300", "#fff", StatisticResult.FASTER];
const slower: StatisticTuple = ["#b30000", "#fff", StatisticResult.SLOWER];

function colorsForStatisticResult(statisticResult: StatisticResult) {
  switch (statisticResult) {
    case StatisticResult.FASTER:
      return faster;
    case StatisticResult.SLOWER:
      return slower;
    default:
      return undecided;
  }
}

const statisticComputeColor = function (sign: number, pValue: number): [string, string, StatisticResult] {
  if (pValue > 0.05 || Number.isNaN(pValue)) {
    return undecided; //['#fff','#000', StatisticResult.Undecided];
  }
  if (sign <= 0) {
    // let a = 0.8; //(0.1 - pValue) * 10.0;
    // let r = 0;
    // let g = (1.0-a)* 255 + a * 160;
    // let b = 0;
    // return [`rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`, '#fff', StatisticResult.Faster];
    return faster;
  } else {
    // let a = 0.8; //(0.1 - pValue) * 10.0;
    // let r = (1.0-a)* 255 + a * 160;
    // let g = 0;
    // let b = 0;
    return slower; //[`rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`, '#fff', StatisticResult.Slower];
  }
};

export class ResultTableData {
  resultsMap = new Map<BenchmarkType, ResultData>();
  frameworks: Array<Framework>;
  frameworksForFactors: Array<Framework>;
  selectedFameworks: Set<Framework>;

  constructor(
    public allFrameworks: Array<Framework>,
    public allBenchmarks: Array<Benchmark>,
    public results: ResultLookup,
    public selectedFrameworksInDropdown: Set<Framework>,
    public selectedBenchmarks: Set<Benchmark>,
    type: FrameworkType,
    sortKey: string,
    public displayMode: DisplayMode,
    public compareWith: Framework | undefined,
    public selectedCategories: Set<number>,
    public cpuDurationMode: string
  ) {
    const allowedIssues = new Set(knownIssues.map((issue) => issue.number));
    const defaultFrameworks = ["vanillajs-keyed", "vanillajs-1-keyed", "vanillajs-non-keyed", "vanillajs-1-non-keyed"];

    console.log("ResultTableData", allowedIssues, selectedCategories);

    this.selectedFameworks = new Set<Framework>();

    selectedFrameworksInDropdown.forEach((framework) => {
      if (this.isFrameworkAllowed(framework, allowedIssues, defaultFrameworks)) {
        this.selectedFameworks.add(framework);
      }
    });
    this.frameworks = this.filterFrameworksByType(this.selectedFameworks, type);
    this.frameworksForFactors = this.allFrameworks.filter(
      (framework) => framework.type === type && this.isFrameworkAllowed(framework, allowedIssues, defaultFrameworks)
    );

    this.update(sortKey);
  }
  private isFrameworkAllowed(framework: Framework, allowedIssues: Set<number>, defaultFrameworks: Array<string>) {
    return framework.issues.every((i) => allowedIssues.has(i)) || defaultFrameworks.includes(framework.name);
  }
  private filterFrameworksByType(selectedFrameworks: Set<Framework>, type: FrameworkType) {
    return this.allFrameworks.filter((framework) => framework.type === type && selectedFrameworks.has(framework));
  }
  private createResult(type: BenchmarkType): ResultData {
    const benchmarks = this.allBenchmarks.filter(
      (benchmark) => benchmark.type === type && this.selectedBenchmarks.has(benchmark)
    );
    const results = benchmarks.map((benchmark) => this.computeFactors(benchmark));
    const geomMean = this.frameworks.map((framework, idx) => {
      const resultsForFramework = results.map((arr) => arr[idx]);
      return this.computeGeometricMean(type, framework, benchmarks, resultsForFramework);
    });
    const comparison = this.frameworks.map((framework, idx) => {
      const resultsForFramework = results.map((arr) => arr[idx]);
      return this.computeComparison(framework, resultsForFramework);
    });

    return { benchmarks, results, geomMean, comparison };
  }

  private update(sortKey: string) {
    console.time("update");

    for (const type of benchmarkTypes) {
      this.resultsMap.set(type, this.createResult(type));
    }

    this.sortBy(sortKey);
    console.timeEnd("update");
  }
  public getResult(type: BenchmarkType): ResultData {
    return this.resultsMap.get(type)!;
  }

  private getSortableValue(framework: Framework, frameworkIndex: number, sortKey: string) {
    let sortValue;
    switch (sortKey) {
      case SORT_BY_NAME: {
        sortValue = framework.name;
        break;
      }
      case SORT_BY_GEOMMEAN_CPU: {
        sortValue = this.getResult(BenchmarkType.CPU).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
        break;
      }
      case SORT_BY_GEOMMEAN_MEM: {
        sortValue = this.getResult(BenchmarkType.MEM).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
        break;
      }
      case SORT_BY_GEOMMEAN_SIZE: {
        sortValue = this.getResult(BenchmarkType.SIZE).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
        break;
      }
      case SORT_BY_GEOMMEAN_STARTUP: {
        sortValue = this.getResult(BenchmarkType.STARTUP).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
        break;
      }
      default: {
        const cpuIdx = this.getResult(BenchmarkType.CPU).benchmarks.findIndex((b) => b.id === sortKey);
        const memIdx = this.getResult(BenchmarkType.MEM).benchmarks.findIndex((b) => b.id === sortKey);
        const sizeIdx = this.getResult(BenchmarkType.SIZE).benchmarks.findIndex((b) => b.id === sortKey);
        const startupIdx = this.getResult(BenchmarkType.STARTUP).benchmarks.findIndex((b) => b.id === sortKey);

        if (cpuIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.CPU).results[cpuIdx][frameworkIndex]?.value ?? Number.POSITIVE_INFINITY;
        else if (startupIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.STARTUP).results[startupIdx][frameworkIndex]?.value ??
            Number.POSITIVE_INFINITY;
        else if (memIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.MEM).results[memIdx][frameworkIndex]?.value ?? Number.POSITIVE_INFINITY;
        else if (sizeIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.SIZE).results[sizeIdx][frameworkIndex]?.value ?? Number.POSITIVE_INFINITY;
        else throw new Error(`sortKey ${sortKey} not found`);
      }
    }

    return {
      framework,
      frameworkIndex,
      sortValue,
    };
  }

  sortBy(sortKey: string): void {
    const zipped = this.frameworks.map((framework, frameworkIndex) =>
      this.getSortableValue(framework, frameworkIndex, sortKey)
    );

    const remappedIdx = zipped.sort((a, b) => Number(a.sortValue) - Number(b.sortValue)).map((z) => z.frameworkIndex);

    this.frameworks = this.remap(remappedIdx, this.frameworks);

    for (const type of benchmarkTypes) {
      const result = this.getResult(type);

      result.results = result.results.map((row) => this.remap(remappedIdx, row));
      result.geomMean = this.remap(remappedIdx, result.geomMean);
      result.comparison = this.remap(remappedIdx, result.comparison);
    }
  }
  private remap<T>(remappedIdx: Array<number>, array: Array<T>): Array<T> {
    return remappedIdx.map((idx) => array[idx]);
  }

  computeGeometricMean(
    type: BenchmarkType,
    framework: Framework,
    benchmarks: Array<Benchmark>,
    resultsForFramework: Array<TableResultValueEntry | null>
  ): TableResultGeommeanEntry {
    let benchmarkWeights: Array<number>;
    if (type === BenchmarkType.CPU) {
      benchmarkWeights = [
        0.64280248137063, 0.5607178150466176, 0.5643800750716564, 0.1925635870170522, 0.13200612879341714,
        0.5277091212292658, 0.5644449600965534, 0.5508359820582848, 0.4225836631419211,
      ];
    } else {
      benchmarkWeights = Array.from<number>({ length: benchmarks.length }).fill(1);
    }

    let hasResults = false;
    let gMean = 0.0;
    resultsForFramework.forEach((r, idx) => {
      if (r !== null && !Number.isNaN(r.factor)) {
        hasResults = true;
        gMean += benchmarkWeights[idx] * Math.log(r.factor);
      }
    });
    const value = hasResults ? Math.exp(gMean / benchmarkWeights.reduce((a, b) => a + b, 0)) : NaN;

    return this.compareWith
      ? new TableResultGeommeanEntry(framework.name, framework, value, "#fff", "#000")
      : new TableResultGeommeanEntry(framework.name, framework, value, computeColor(value), "#000");
  }
  computeComparison(
    framework: Framework,
    resultsCPUForFramework: Array<TableResultValueEntry | null>
  ): TableResultComparisonEntry {
    if (!this.compareWith) {
      return new TableResultComparisonEntry(framework.name, framework, "", "#fff", "#000");
    }

    let statisticResult: StatisticResult | undefined;

    for (const r of resultsCPUForFramework) {
      if (r?.statisticResult !== StatisticResult.UNDECIDED) {
        if (!statisticResult) {
          statisticResult = r?.statisticResult;
        } else if (statisticResult !== r?.statisticResult) {
          statisticResult = StatisticResult.UNDECIDED;
        }
      }
    }

    let label = "";
    statisticResult ??= StatisticResult.UNDECIDED;
    if (statisticResult === StatisticResult.FASTER) {
      label = "faster!";
    } else if (statisticResult === StatisticResult.SLOWER) {
      label = "slower!";
    }

    return new TableResultComparisonEntry(
      framework.name,
      framework,
      label,
      colorsForStatisticResult(statisticResult)[0],
      colorsForStatisticResult(statisticResult)[1]
    );
  }

  private getBenchmarkStatistic(result: Result | null, resultsKey: string): number {
    if (result === null) return 0;

    return this.displayMode === DisplayMode.DISPLAY_MEDIAN
      ? result.results[resultsKey].median
      : result.results[resultsKey].mean;
  }

  private computeFactors(benchmark: Benchmark): Array<TableResultValueEntry | null> {
    const resultsKey = benchmark.type === BenchmarkType.CPU ? this.cpuDurationMode : DEFAULT_RESULTS_KEY;

    const benchmarkResults = this.frameworksForFactors.map((f) => this.results(benchmark, f));

    const min = Math.max(
      benchmarkResults.reduce(
        (min, result) => (result === null ? min : Math.min(min, this.getBenchmarkStatistic(result, resultsKey))),
        Number.POSITIVE_INFINITY
      )
    );
    // if (benchmark.type === BenchmarkType.CPU) {
    //     min = Math.max(1000/60, min);
    // }

    const some = this.frameworks.map((framework) =>
      this.calculateTableResultValues(benchmark, framework, resultsKey, min)
    );

    return some;
  }

  private calculateTableResultValues(
    benchmark: Benchmark,
    framework: Framework,
    resultsKey: string,
    min: number
  ): TableResultValueEntry | null {
    const result = this.results(benchmark, framework);
    if (result === null) return null;
    const resultValues = result.results[resultsKey];

    const value = this.getBenchmarkStatistic(result, resultsKey);
    const factor = value / min;
    // if (benchmark.type === BenchmarkType.CPU) {
    //     factor = Math.max(1, factor);
    // }
    const confidenceInterval = 
      (1.959964 * (resultValues.standardDeviation || 0)) / Math.sqrt(resultValues.values.length);
      const confidenceIntervalStr = benchmark.type === BenchmarkType.CPU ? confidenceInterval.toFixed(1) : null;
      const formattedValue = formatEn.format(value);
      console.log("confidenceInterval", benchmark.id, framework.name, formattedValue, value, confidenceInterval, confidenceIntervalStr, resultValues.values.length)

    if (!this.compareWith || benchmark.type !== BenchmarkType.CPU) {
      return new TableResultValueEntry(
        framework.name,
        value,
        formattedValue,
        confidenceIntervalStr,
        factor,
        factor.toFixed(2),
        computeColor(factor),
        "#000",
        StatisticResult.UNDECIDED
      );
    }

    const compareWithResults = this.results(benchmark, this.compareWith)!;
    const compareWithResultsValues = compareWithResults.results[resultsKey];
    // let meanStr = 'x'; //mean.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true});

    // X1,..,Xn: this Framework, Y1, ..., Ym: selected Framework
    // https://de.wikipedia.org/wiki/Zweistichproben-t-Test
    const compareWithMean = compareWithResultsValues.mean;
    const stdDev = resultValues.standardDeviation || 0;
    const compareWithResultsStdDev = compareWithResultsValues.standardDeviation || 0;

    const x1 = resultValues.mean;
    const x2 = compareWithMean;
    const s1_2 = stdDev * stdDev;
    const s2_2 = compareWithResultsStdDev * compareWithResultsStdDev;
    const n1 = compareWithResultsValues.values.length;
    const n2 = resultValues.values.length;
    // Welch Welch–Satterthwaite dof
    // const dof =
    //   Math.pow(s1_2 / n1 + s2_2 / n2, 2) /
    //   ((s1_2 * s1_2) / (n1 * n1 * (n1 - 1)) + (s2_2 * s2_2) / (n2 * n2 * (n2 - 1)));
    // simple dof 
    const dof = n1 + n2 - 2;
    const t = (x1 - x2) / Math.sqrt(s1_2 / n1 + s2_2 / n2);
    const p = (1.0 - jStat.studentt.cdf(Math.abs(t), dof)) * 2;

    const statisticalCol = statisticComputeColor(t, p);
    const statisticalResult = (p * 100).toFixed(3) + "%";

    return new TableResultValueEntry(
      framework.name,
      value,
      formattedValue,
      confidenceIntervalStr,
      factor,
      factor.toFixed(2),
      statisticalCol[0],
      statisticalCol[1],
      statisticalCol[2],
      statisticalResult
    );
  }
}
