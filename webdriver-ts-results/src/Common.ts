import { jStat } from "jstat";

export enum StatisticResult {
  Slower,
  Undecided,
  Faster,
}
export enum DisplayMode {
  DisplayMean,
  DisplayMedian,
  BoxPlot,
}
export enum CpuDurationMode {
  Total = "total",
  Script = "script",
}

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

export enum Severity {
  Note,
  Error,
}

const DEFAULT_RESULTS_KEY = "DEFAULT";

interface Issue {
  issue: number;
  severity: Severity;
  text: string;
  link: string;
}

export const knownIssues: Issue[] = [
  {
    issue: 634,
    severity: Severity.Error,
    text: "[Issue]: The HTML structure for the implementation is not fully correct.",
    link: "https://github.com/krausest/js-framework-benchmark/issues/634",
  },
  {
    issue: 772,
    severity: Severity.Note,
    text: "[Note]: Implementation uses manual DOM manipulations",
    link: "https://github.com/krausest/js-framework-benchmark/issues/772",
  },
  {
    issue: 796,
    severity: Severity.Note,
    text: "[Note]: Implementation uses explicit requestAnimationFrame calls",
    link: "https://github.com/krausest/js-framework-benchmark/issues/796",
  },
  {
    issue: 800,
    severity: Severity.Note,
    text: "[Note]: View state on the model",
    link: "https://github.com/krausest/js-framework-benchmark/issues/800",
  },
  {
    issue: 801,
    severity: Severity.Note,
    text: "[Note]: Implementation uses manual event delegation",
    link: "https://github.com/krausest/js-framework-benchmark/issues/801",
  },
  {
    issue: 1139,
    severity: Severity.Note,
    text: "[Note]: Implementation uses runtime code generation",
    link: "https://github.com/krausest/js-framework-benchmark/issues/1139",
  },
  {
    issue: 1261,
    severity: Severity.Note,
    text: "[Note]: Manual caching of (v)dom nodes",
    link: "https://github.com/krausest/js-framework-benchmark/issues/1261",
  },
];

export function findIssue(issueNumber: number): Issue | undefined {
  return knownIssues.find((i) => i.issue === issueNumber);
}
export enum BenchmarkType {
  CPU,
  MEM,
  DUMMY,
  STARTUP,
}

export interface Benchmark {
  id: string;
  type: BenchmarkType;
  label: string;
  description: string;
}

export interface RawResult {
  f: string;
  b: string;
  v: { [k: string]: number[] };
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
export const SORT_BY_GEOMMEAN_STARTUP = "SORT_BY_GEOMMEAN_STARTUP";
export type T_SORT_BY_GEOMMEAN =
  | typeof SORT_BY_GEOMMEAN_CPU
  | typeof SORT_BY_GEOMMEAN_MEM
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
    public statisticallySignificantFactor:
      | string
      | number
      | undefined = undefined,
  ) {}
}

export class TableResultComparisonEntry {
  constructor(
    public key: string,
    public framework: Framework,
    public label: string,
    public bgColor: string,
    public textColor: string,
  ) {}
}

export class TableResultGeommeanEntry {
  constructor(
    public key: string,
    public framework: Framework,
    public mean: number,
    public bgColor: string,
    public textColor: string,
  ) {}
}

export interface ResultLookup {
  (benchmark: Benchmark, framework: Framework): Result | null;
}
export function convertToMap(results: Array<Result>): ResultLookup {
  const resultMap = new Map<string, Map<string, Result>>();
  results.forEach((r) => {
    if (!resultMap.has(r.benchmark))
      resultMap.set(r.benchmark, new Map<string, Result>());
    resultMap.get(r.benchmark)!.set(r.framework, r);
  });
  return (benchmark: Benchmark, framework: Framework) => {
    const m = resultMap.get(benchmark.id);
    if (!m) return null;
    const v = m.get(framework.name);
    if (!v) return null;
    return v;
  };
}

const undecided: [string, string, StatisticResult] = [
  "#fff",
  "#000",
  StatisticResult.Undecided,
];
const faster: [string, string, StatisticResult] = [
  "#00b300",
  "#fff",
  StatisticResult.Faster,
];
const slower: [string, string, StatisticResult] = [
  "#b30000",
  "#fff",
  StatisticResult.Slower,
];

function colorsForStatisticResult(statisticResult: StatisticResult) {
  switch (statisticResult) {
    case StatisticResult.Faster:
      return faster;
    case StatisticResult.Slower:
      return slower;
    default:
      return undecided;
  }
}

const statisticComputeColor = function (
  sign: number,
  pValue: number,
): [string, string, StatisticResult] {
  if (pValue > 0.1) {
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

const formatEn = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  useGrouping: true,
});

export class ResultTableData {
  resultsMap = new Map<BenchmarkType, ResultData>();
  // // Rows
  // benchmarksCPU: Array<Benchmark>;
  // benchmarksStartup: Array<Benchmark>;
  // benchmarksMEM: Array<Benchmark>;
  // Columns
  frameworks: Array<Framework>;
  frameworksForFactors: Array<Framework>;
  selectedFameworks: Set<Framework>;
  // Cell data
  // resultsCPU: Array<Array<TableResultValueEntry|null>>;   // [benchmark][framework]
  // geomMeanCPU: Array<TableResultGeommeanEntry|null>;
  // geomMeanStartup: Array<TableResultGeommeanEntry|null>;
  // geomMeanMEM: Array<TableResultGeommeanEntry|null>;
  // resultsStartup: Array<Array<TableResultValueEntry|null>>;
  // resultsMEM: Array<Array<TableResultValueEntry|null>>;

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
    public cpuDurationMode: string,
  ) {
    const allowedIssues = new Set(knownIssues.map((issue) => issue.issue));
    const defaultFrameworks = [
      "vanillajs-keyed",
      "vanillajs-1-keyed",
      "vanillajs-non-keyed",
      "vanillajs-1-non-keyed",
    ];

    console.log("ResultTableData", allowedIssues, selectedCategories);

    this.selectedFameworks = new Set<Framework>();

    selectedFrameworksInDropdown.forEach((framework) => {
      if (
        this.isFrameworkAllowed(framework, allowedIssues, defaultFrameworks)
      ) {
        this.selectedFameworks.add(framework);
      }
    });
    this.frameworks = this.filterFrameworksByType(this.selectedFameworks, type);
    this.frameworksForFactors = this.allFrameworks.filter(
      (framework) =>
        framework.type === type &&
        this.isFrameworkAllowed(framework, allowedIssues, defaultFrameworks),
    );

    this.update(sortKey);
  }
  private isFrameworkAllowed(
    framework: Framework,
    allowedIssues: Set<number>,
    defaultFrameworks: Array<string>,
  ) {
    return (
      framework.issues.every((i) => allowedIssues.has(i)) ||
      defaultFrameworks.includes(framework.name)
    );
  }
  private filterFrameworksByType(
    selectedFrameworks: Set<Framework>,
    type: FrameworkType,
  ) {
    return this.allFrameworks.filter(
      (framework) =>
        framework.type === type && selectedFrameworks.has(framework),
    );
  }
  private update(sortKey: string) {
    console.time("update");

    const createResult = (type: BenchmarkType): ResultData => {
      const benchmarks = this.allBenchmarks.filter(
        (benchmark) =>
          benchmark.type === type && this.selectedBenchmarks.has(benchmark),
      );
      const results = benchmarks.map((benchmark) =>
        this.computeFactors(benchmark),
      );
      const geomMean = this.frameworks.map((framework, idx) => {
        const resultsForFramework = results.map((arr) => arr[idx]);
        return this.computeGeometricMean(
          type,
          framework,
          benchmarks,
          resultsForFramework
        );
      });
      const comparison = this.frameworks.map((framework, idx) => {
        const resultsForFramework = results.map((arr) => arr[idx]);
        return this.computeComparison(
          framework,
          benchmarks,
          resultsForFramework
        );
      });

      return { benchmarks, results, geomMean, comparison };
    };

    const benchmarkTypes = [
      BenchmarkType.CPU,
      BenchmarkType.MEM,
      BenchmarkType.STARTUP,
    ];
    for (const type of benchmarkTypes) {
      this.resultsMap.set(type, createResult(type));
    }

    this.sortBy(sortKey);
    console.timeEnd("update");
  }
  public getResult(type: BenchmarkType): ResultData {
    return this.resultsMap.get(type)!;
  }
  sortBy(sortKey: string): void {
    const zipped = this.frameworks.map((f, frameworkIndex) => {
      let sortValue;
      if (sortKey === SORT_BY_NAME) sortValue = f.name;
      else if (sortKey === SORT_BY_GEOMMEAN_CPU)
        sortValue =
          this.getResult(BenchmarkType.CPU).geomMean[frameworkIndex]!.mean ||
          Number.POSITIVE_INFINITY;
      else if (sortKey === SORT_BY_GEOMMEAN_MEM)
        sortValue =
          this.getResult(BenchmarkType.MEM).geomMean[frameworkIndex]!.mean ||
          Number.POSITIVE_INFINITY;
      else if (sortKey === SORT_BY_GEOMMEAN_STARTUP)
        sortValue =
          this.getResult(BenchmarkType.STARTUP).geomMean[frameworkIndex]!
            .mean || Number.POSITIVE_INFINITY;
      else {
        const cpuIdx = this.getResult(BenchmarkType.CPU).benchmarks.findIndex(
          (b) => b.id === sortKey,
        );
        const memIdx = this.getResult(BenchmarkType.MEM).benchmarks.findIndex(
          (b) => b.id === sortKey,
        );
        const startupIdx = this.getResult(
          BenchmarkType.STARTUP,
        ).benchmarks.findIndex((b) => b.id === sortKey);
        if (cpuIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.CPU).results[cpuIdx][frameworkIndex]
              ?.value ?? Number.POSITIVE_INFINITY;
        else if (startupIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.STARTUP).results[startupIdx][
              frameworkIndex
            ]?.value ?? Number.POSITIVE_INFINITY;
        else if (memIdx > -1)
          sortValue =
            this.getResult(BenchmarkType.MEM).results[memIdx][frameworkIndex]
              ?.value ?? Number.POSITIVE_INFINITY;
        else throw Error(`sortKey ${sortKey} not found`);
      }
      return {
        framework: f,
        origIndex: frameworkIndex,
        sortValue: sortValue,
      };
    });

    const remappedIdx = zipped
      .sort((a, b) => Number(a.sortValue) - Number(b.sortValue))
      .map((z) => z.origIndex);

    this.frameworks = this.remap(remappedIdx, this.frameworks);

    const benchmarkTypes = [
      BenchmarkType.CPU,
      BenchmarkType.MEM,
      BenchmarkType.STARTUP,
    ];

    for (const type of benchmarkTypes) {
      const result = this.getResult(type);

      result.results = result.results.map((row) =>
        this.remap(remappedIdx, row),
      );
      result.geomMean = this.remap(remappedIdx, result.geomMean);
      result.comparison = this.remap(remappedIdx, result.comparison);
    }
  }
  remap<T>(remappedIdx: Array<number>, array: Array<T>): Array<T> {
    return remappedIdx.map((idx) => array[idx]);
  }

  computeGeometricMean(
    type: BenchmarkType,
    framework: Framework,
    benchmarks: Array<Benchmark>,
    resultsForFramework: Array<TableResultValueEntry | null>,
  ): TableResultGeommeanEntry {
    let benchmarkWeights: Array<number>;
    if (type == BenchmarkType.CPU) {
      benchmarkWeights = [0.64280248137063,0.5607178150466176,0.5643800750716564,0.1925635870170522,0.13200612879341714,0.5277091212292658,0.5644449600965534,0.5508359820582848,0.4225836631419211];
    } else {
      benchmarkWeights = new Array(benchmarks.length).fill(1);
    }

    let gMean = 0.0;
    resultsForFramework.forEach((r,idx) => {
        if (r !== null && !isNaN(r.factor)) {
            gMean += benchmarkWeights[idx] * Math.log(r.factor);
        }
    });
    const value = Math.exp(gMean / benchmarkWeights.reduce((a,b) => a+b, 0))

    return this.compareWith
      ? new TableResultGeommeanEntry(
          framework.name,
          framework,
          value,
          "#fff",
          "#000",
        )
      : new TableResultGeommeanEntry(
          framework.name,
          framework,
          value,
          computeColor(value),
          "#000",
        );
  }
  computeComparison(
    framework: Framework,
    benchmarksCPU: Array<Benchmark>, // Remove cause unused
    resultsCPUForFramework: Array<TableResultValueEntry | null>,
  ): TableResultComparisonEntry {
    if (!this.compareWith) {
      return new TableResultComparisonEntry(
        framework.name,
        framework,
        "",
        "#fff",
        "#000",
      );
    }

    let statisticResult: StatisticResult | undefined = undefined;

    for (const r of resultsCPUForFramework) {
      if (r?.statisticResult !== StatisticResult.Undecided) {
        if (!statisticResult) {
          statisticResult = r?.statisticResult;
        } else if (statisticResult !== r?.statisticResult) {
          statisticResult = StatisticResult.Undecided;
        }
      }
    }

    let label = "";
    statisticResult ??= StatisticResult.Undecided;
    if (statisticResult === StatisticResult.Faster) {
      label = "faster!";
    } else if (statisticResult === StatisticResult.Slower) {
      label = "slower!";
    }
    return new TableResultComparisonEntry(
      framework.name,
      framework,
      label,
      colorsForStatisticResult(statisticResult)[0],
      colorsForStatisticResult(statisticResult)[1],
    );
  }

  computeFactors(benchmark: Benchmark): Array<TableResultValueEntry | null> {
    const resultsKey =
      benchmark.type == BenchmarkType.CPU
        ? this.cpuDurationMode
        : DEFAULT_RESULTS_KEY;

    const benchmarkResults = this.frameworksForFactors.map((f) =>
      this.results(benchmark, f),
    );
    const selectFn = (result: Result | null) => {
      if (result === null) return 0;
      if (this.displayMode === DisplayMode.DisplayMedian) {
        return result.results[resultsKey].median;
      } else {
        return result.results[resultsKey].mean;
      }
    };
    const min = Math.max(
      benchmarkResults.reduce(
        (min, result) =>
          result === null ? min : Math.min(min, selectFn(result)),
        Number.POSITIVE_INFINITY,
      ),
    );
    // if (benchmark.type === BenchmarkType.CPU) {
    //     min = Math.max(1000/60, min);
    // }
    return this.frameworks.map((f) => {
      const result = this.results(benchmark, f);
      if (result === null) return null;
      const resultValues = result.results[resultsKey];

      const value = selectFn(result);
      const factor = value / min;
      // if (benchmark.type === BenchmarkType.CPU) {
      //     factor = Math.max(1, factor);
      // }
      const conficenceInterval =
        (1.959964 * (resultValues.standardDeviation || 0)) /
        Math.sqrt(resultValues.values.length);
      const conficenceIntervalStr =
        benchmark.type === BenchmarkType.MEM
          ? null
          : conficenceInterval.toFixed(1);
      const formattedValue = formatEn.format(value);

      if (!this.compareWith) {
        return new TableResultValueEntry(
          f.name,
          value,
          formattedValue,
          conficenceIntervalStr,
          factor,
          factor.toFixed(2),
          computeColor(factor),
          "#000",
          StatisticResult.Undecided,
        );
      }

      const compareWithResults = this.results(benchmark, this.compareWith)!;
      const compareWithResultsValues = compareWithResults.results[resultsKey];
      // let meanStr = 'x'; //mean.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true});

      // X1,..,Xn: this Framework, Y1, ..., Ym: selected Framework
      // https://de.wikipedia.org/wiki/Zweistichproben-t-Test
      let statisticalResult = undefined;
      let statisticalCol = undefined;
      const compareWithMean = compareWithResultsValues.mean;
      const stdDev = resultValues.standardDeviation || 0;
      const compareWithResultsStdDev = compareWithResultsValues.standardDeviation || 0;

      const x1 = resultValues.mean;
      const x2 = compareWithMean;
      const s1_2 = stdDev * stdDev;
      const s2_2 = compareWithResultsStdDev * compareWithResultsStdDev;
      const n1 = compareWithResultsValues.values.length;
      const n2 = resultValues.values.length;
      const ny =
        Math.pow(s1_2 / n1 + s2_2 / n2, 2) /
        ((s1_2 * s1_2) / (n1 * n1 * (n1 - 1)) +
          (s2_2 * s2_2) / (n2 * n2 * (n2 - 1)));
      const t = (x1 - x2) / Math.sqrt(s1_2 / n1 + s2_2 / n2);
      const p = (1.0 - jStat.studentt.cdf(Math.abs(t), ny)) * 2;

      statisticalCol = statisticComputeColor(t, p);
      statisticalResult = (p * 100).toFixed(3) + "%";

      return new TableResultValueEntry(
        f.name,
        value,
        formattedValue,
        conficenceIntervalStr,
        factor,
        factor.toFixed(2),
        statisticalCol[0],
        statisticalCol[1],
        statisticalCol[2],
        statisticalResult,
      );
    });
  }
}
