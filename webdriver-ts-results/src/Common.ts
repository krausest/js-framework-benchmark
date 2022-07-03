/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jStat: any = require('jStat').jStat;

export enum StatisticResult {Slower, Undecided, Faster}
export enum DisplayMode { DisplayMean, DisplayMedian, BoxPlot }

export enum FrameworkType { KEYED, NON_KEYED }

export interface Framework {
    name: string;
    dir: string;
    type: FrameworkType;
    issues: number[];
    displayname: string;
}

export enum Severity {Note, Error}

interface Category {
  id: number;
  text: string;
  issues: Array<number>;
  severity: Severity;
}

export const categories: Category[] = [
  {id:1, text:"[Note]: Manual DOM manipulations", issues: [772], severity: Severity.Note},
  {id:2, text:"[Note]:View state on the model", issues: [800], severity: Severity.Note},
  {id:3, text:"[Note]: Explicit requestAnimationFrame calls", issues: [796], severity: Severity.Note},
  {id:4, text:"[Note]: Manual event delegation", issues: [801], severity: Severity.Note},
  {id:5, text:"[Issue]: Errors in the implementation", issues: [634], severity: Severity.Error},
]

export const knownIssues = [
    {issue: 634, severity: Severity.Error, text:"[Issue]: The HTML structure for the implementation is not fully correct.", link: "https://github.com/krausest/js-framework-benchmark/issues/634"},
    {issue: 772, severity: Severity.Note, text:"[Note]: Implementation uses manual DOM manipulations", link: "https://github.com/krausest/js-framework-benchmark/issues/772"},
    {issue: 796, severity: Severity.Note, text:"[Note]: Implementation uses explicit requestAnimationFrame calls", link: "https://github.com/krausest/js-framework-benchmark/issues/796"},
    {issue: 800, severity: Severity.Note, text:"[Note]: View state on the model", link: "https://github.com/krausest/js-framework-benchmark/issues/800"},
    {issue: 801, severity: Severity.Note, text:"[Note]: Implementation uses manual event delegation", link: "https://github.com/krausest/js-framework-benchmark/issues/801"},
  ];

export function findIssue(issueNumber: number) {
    return knownIssues.find(i => i.issue === issueNumber)
}
export enum BenchmarkType { CPU, MEM, DUMMY, STARTUP }

export interface Benchmark {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
}

export interface RawResult {
    f: string;
    b: string;
    v: number[];
}

export interface Result {
    framework: string;
    benchmark: string;
    values: number[];
    mean: number;
    median: number;
    standardDeviation: number;
}

interface ResultData {
    benchmarks: Array<Benchmark>;
    results: Array<Array<TableResultValueEntry|null>>;
    geomMean: Array<TableResultGeommeanEntry|null>;
    comparison: Array<TableResultComparisonEntry|null>;
}

export const SORT_BY_NAME = 'SORT_BY_NAME';
export const SORT_BY_GEOMMEAN_CPU = 'SORT_BY_GEOMMEAN_CPU';
export const SORT_BY_GEOMMEAN_MEM = 'SORT_BY_GEOMMEAN_MEM';
export const SORT_BY_GEOMMEAN_STARTUP = 'SORT_BY_GEOMMEAN_STARTUP';
export type T_SORT_BY_GEOMMEAN = typeof SORT_BY_GEOMMEAN_CPU | typeof SORT_BY_GEOMMEAN_MEM | typeof SORT_BY_GEOMMEAN_STARTUP;

const computeColor = function(factor: number): string {
    if (factor < 2.0) {
        const a = (factor - 1.0);
        const r = (1.0-a)* 99 + a * 255;
        const g = (1.0-a)* 191 + a * 236;
        const b = (1.0-a)* 124 + a * 132;
        return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
    } else  {
        const a = Math.min((factor - 2.0) / 2.0, 1.0);
        const r = (1.0-a)* 255 + a * 249;
        const g = (1.0-a)* 236 + a * 105;
        const b = (1.0-a)* 132 + a * 108;
        return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
    }
}

export class TableResultValueEntry {
    constructor(public key: string, public value: number, public formattedValue: string, 
        public deviation: string|null, public factor: number, public formattedFactor: string, 
        public bgColor: string, public textColor: string, 
        public statisticResult: StatisticResult,
        public statisticallySignificantFactor: string|number|undefined = undefined) {
    }
}

export class TableResultComparisonEntry {
    constructor(public key: string, public framework: Framework, public label: string,
        public bgColor: string, public textColor: string) {
    }
}

export class TableResultGeommeanEntry {
    constructor(public key: string, public framework: Framework, public mean: number, public bgColor: string, public textColor: string) {
    }
}

export interface ResultLookup {
    (benchmark: Benchmark, framework: Framework): Result|null;
}
export function convertToMap(results: Array<Result>): ResultLookup {
    const resultMap = new Map<string, Map<string, Result>>();
    results.forEach(r => {
        if (!resultMap.has(r.benchmark)) resultMap.set(r.benchmark, new Map<string,Result>());
        resultMap.get(r.benchmark)!.set(r.framework, r);
    });
    return (benchmark: Benchmark, framework: Framework) => {
        const m = resultMap.get(benchmark.id);
        if (!m) return null;
        const v = m.get(framework.name);
        if (!v) return null;
        return v;
    }
}

const undecided: [string, string, StatisticResult] = ['#fff','#000',StatisticResult.Undecided];
const faster: [string, string, StatisticResult] = ['#00b300','#fff',StatisticResult.Faster];
const slower: [string, string, StatisticResult] = ['#b30000','#fff',StatisticResult.Slower];

function colorsForStatisticResult(statisticResult: StatisticResult) {
    switch(statisticResult) {
        case StatisticResult.Faster:
            return faster;
        case StatisticResult.Slower:
            return slower;
        default:
            return undecided;
    }
}

const statisticComputeColor = function(sign: number, pValue: number): [string, string, StatisticResult] {
    if (pValue > 0.10) {
        return undecided; //['#fff','#000', StatisticResult.Undecided];
    }
    if (sign <= 0) {
        // let a = 0.8; //(0.1 - pValue) * 10.0;
        // let r = 0;
        // let g = (1.0-a)* 255 + a * 160;
        // let b = 0;
        // return [`rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`, '#fff', StatisticResult.Faster];
        return faster;
    } else  {
        // let a = 0.8; //(0.1 - pValue) * 10.0;
        // let r = (1.0-a)* 255 + a * 160;
        // let g = 0;
        // let b = 0;
        return slower; //[`rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`, '#fff', StatisticResult.Slower];
    }
}

const formatEn = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true});

export class ResultTableData {

    resultsMap = new Map<BenchmarkType, ResultData>();
    // // Rows
    // benchmarksCPU: Array<Benchmark>;
    // benchmarksStartup: Array<Benchmark>;
    // benchmarksMEM: Array<Benchmark>;
    // Columns
    frameworks: Array<Framework>;
    selectedFameworks: Set<Framework>;
    // Cell data
    // resultsCPU: Array<Array<TableResultValueEntry|null>>;   // [benchmark][framework]
    // geomMeanCPU: Array<TableResultGeommeanEntry|null>;
    // geomMeanStartup: Array<TableResultGeommeanEntry|null>;
    // geomMeanMEM: Array<TableResultGeommeanEntry|null>;
    // resultsStartup: Array<Array<TableResultValueEntry|null>>;
    // resultsMEM: Array<Array<TableResultValueEntry|null>>;

    constructor(public allFrameworks: Array<Framework>, public allBenchmarks: Array<Benchmark>, public results: ResultLookup,
        public selectedFrameworksInDropdown: Set<Framework>, public selectedBenchmarks: Set<Benchmark>, type: FrameworkType, sortKey: string,
        public displayMode: DisplayMode, public compareWith: Framework|undefined, public selectedCategories: Set<number>) {     

        this.selectedFameworks = new Set<Framework>();

        const allowedIssues = new Set<number>();
        categories.forEach(c => {
          if (selectedCategories.has(c.id)) {
            for (const i of c.issues) { allowedIssues.add(i); }
          }
        });

        console.log("ResultTableData", allowedIssues, selectedCategories);

        selectedFrameworksInDropdown.forEach(f => {
          if (f.issues.every(i => allowedIssues.has(i))
            || (f.name === 'vanillajs-keyed') || (f.name === 'vanillajs-1-keyed')
            || (f.name === 'vanillajs-non-keyed') || (f.name === 'vanillajs-1-non-keyed')
            ) {
              this.selectedFameworks.add(f);
          }
        })
        this.frameworks = this.allFrameworks.filter(framework => framework.type === type && this.selectedFameworks.has(framework));
        this.update(sortKey);


    }
    private update(sortKey: string) {
        console.time("update");

        const createResult = (type: BenchmarkType): ResultData => {
            const benchmarks = this.allBenchmarks.filter(benchmark => benchmark.type === type && this.selectedBenchmarks.has(benchmark));
            const results = benchmarks.map(benchmark => this.computeFactors(benchmark));
            const geomMean = this.frameworks.map((framework, idx) => {
                const resultsForFramework = results.map(arr => arr[idx]);
                return this.computeGeometricMean(framework, benchmarks, resultsForFramework);
            });    
            const comparison = this.frameworks.map((framework, idx) => {
                const resultsForFramework = results.map(arr => arr[idx]);
                return this.computeComparison(framework, benchmarks, resultsForFramework);
            });    
            

            return {benchmarks, results, geomMean, comparison}
        }
        [BenchmarkType.CPU, BenchmarkType.MEM, BenchmarkType.STARTUP].forEach((type) => 
            this.resultsMap.set(type, createResult(type))
        )
        this.sortBy(sortKey);
        console.timeEnd("update");
    }
    public getResult(type: BenchmarkType): ResultData {
        return this.resultsMap.get(type)!
    }
    sortBy(sortKey: string) {
        const zipped = this.frameworks.map((f,frameworkIndex) => {
            let sortValue;
            if (sortKey === SORT_BY_NAME) sortValue = f.name;
            else if (sortKey === SORT_BY_GEOMMEAN_CPU) sortValue = this.getResult(BenchmarkType.CPU).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else if (sortKey === SORT_BY_GEOMMEAN_MEM) sortValue = this.getResult(BenchmarkType.MEM).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else if (sortKey === SORT_BY_GEOMMEAN_STARTUP) sortValue = this.getResult(BenchmarkType.STARTUP).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else {
                const cpuIdx = this.getResult(BenchmarkType.CPU).benchmarks.findIndex(b => b.id === sortKey);
                const memIdx = this.getResult(BenchmarkType.MEM).benchmarks.findIndex(b => b.id === sortKey);
                const startupIdx = this.getResult(BenchmarkType.STARTUP).benchmarks.findIndex(b => b.id === sortKey);
                if (cpuIdx>-1) sortValue = this.getResult(BenchmarkType.CPU).results[cpuIdx][frameworkIndex]?.value ?? Number.POSITIVE_INFINITY;
                else if (startupIdx>-1) sortValue = this.getResult(BenchmarkType.STARTUP).results[startupIdx][frameworkIndex]?.value ?? Number.POSITIVE_INFINITY;
                else if (memIdx>-1) sortValue = this.getResult(BenchmarkType.MEM).results[memIdx][frameworkIndex]?.value ?? Number.POSITIVE_INFINITY;
                else throw Error(`sortKey ${sortKey} not found`);
            }
            return {
                framework: f,
                origIndex: frameworkIndex,
                sortValue: sortValue
            };
        });
        zipped.sort((a,b) => { if (a.sortValue! < b.sortValue!) return -1; else if (a.sortValue === b.sortValue) return 0; return 1;})
        const remappedIdx = zipped.map(z => z.origIndex);
        this.frameworks = this.remap(remappedIdx, this.frameworks);
        [BenchmarkType.CPU, BenchmarkType.MEM, BenchmarkType.STARTUP].forEach((type) => {
            this.getResult(type).results = this.getResult(type).results.map(row => this.remap(remappedIdx, row));
        });
        [BenchmarkType.CPU, BenchmarkType.MEM, BenchmarkType.STARTUP].forEach((type) => {
            this.getResult(type).geomMean = this.remap(remappedIdx, this.getResult(type).geomMean);
        });
        [BenchmarkType.CPU, BenchmarkType.MEM, BenchmarkType.STARTUP].forEach((type) => {
            this.getResult(type).comparison = this.remap(remappedIdx, this.getResult(type).comparison);
        });
    }
    remap<T>(remappedIdx: Array<number>, array: Array<T>): Array<T> {
        const copy = new Array<T>(array.length);
        remappedIdx.forEach((idx, i) => {
            copy[i] = array[idx];
        });
        return copy;
    }

    computeGeometricMean(framework: Framework, benchmarksCPU: Array<Benchmark>, resultsCPUForFramework: Array<TableResultValueEntry|null>) {
        let count = 0.0;
        const gMean = resultsCPUForFramework.reduce((gMean, r) => {
            if (r !== null)  {
                count++;
                gMean *= (r.factor as number);
            }
            return gMean;
        }, 1.0);
        const value = Math.pow(gMean, 1 / count);
        return this.compareWith ? new TableResultGeommeanEntry(framework.name, framework, value, '#fff', '#000') :
             new TableResultGeommeanEntry(framework.name, framework, value, computeColor(value), '#000');
    }
    computeComparison(framework: Framework, benchmarksCPU: Array<Benchmark>, resultsCPUForFramework: Array<TableResultValueEntry|null>) {
        if (this.compareWith) {
            let statisticResult: StatisticResult|undefined = undefined;
            resultsCPUForFramework.forEach((r) => {
                    if (r?.statisticResult !== StatisticResult.Undecided) {
                        if (statisticResult === undefined) {
                            statisticResult = r?.statisticResult;
                        } else {
                            if (statisticResult!==r?.statisticResult) statisticResult = StatisticResult.Undecided
                    }
                }
            });
            let label = '';
            statisticResult = statisticResult! ?? StatisticResult.Undecided;
            if (statisticResult === StatisticResult.Faster) {
                label = 'faster!';
            } else if (statisticResult === StatisticResult.Slower) {
                label = 'slower!';
            }
            return new TableResultComparisonEntry(framework.name, framework, label, colorsForStatisticResult(statisticResult)[0], colorsForStatisticResult(statisticResult)[1]);
        } else {
            return new TableResultComparisonEntry(framework.name, framework, '', '#fff', '#000');
        }
    }

    computeFactors(benchmark: Benchmark): Array<TableResultValueEntry|null> {
        const benchmarkResults = this.frameworks.map(f => this.results(benchmark, f));
        const selectFn = (result: Result|null) => {
            if (result===null) return 0;
            if (this.displayMode === DisplayMode.DisplayMedian) {
                return result.median;
            } else {
                return result.mean;
            }
        }
        const min = benchmarkResults.reduce((min, result) => result===null ? min : Math.min(min, selectFn(result)), Number.POSITIVE_INFINITY);
        return this.frameworks.map(f => {
            const result = this.results(benchmark, f);
            if (result === null) return null;

            const value = selectFn(result);
            const factor = value/min;
            const conficenceInterval = 1.959964 * (result.standardDeviation || 0) / Math.sqrt(result.values.length);
            const conficenceIntervalStr = benchmark.type === BenchmarkType.MEM ? null : conficenceInterval.toFixed(1);
            const formattedValue = formatEn.format(value);

            if (!this.compareWith) {
                return new TableResultValueEntry(f.name, value, formattedValue, conficenceIntervalStr, factor, factor.toFixed(2), computeColor(factor), '#000', StatisticResult.Undecided);
            } else {
                const compareWithResults = this.results(benchmark, this.compareWith)!;
                    // let meanStr = 'x'; //mean.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true});

                // X1,..,Xn: this Framework, Y1, ..., Ym: selected Framework
                // https://de.wikipedia.org/wiki/Zweistichproben-t-Test
                let statisticalResult = undefined;
                let statisticalCol = undefined;
                const compareWithMean = compareWithResults.mean;
                const stdDev = result.standardDeviation || 0;
                const compareWithResultsStdDev = compareWithResults.standardDeviation || 0;

                
                const x1 = result.mean;
                const x2 = compareWithMean;
                const s1_2 = stdDev*stdDev;
                const s2_2 = compareWithResultsStdDev * compareWithResultsStdDev;
                const n1 = 10;
                const n2 = 10;
                const ny = Math.pow(s1_2/n1 + s2_2/n2, 2) / (s1_2*s1_2 / (n1*n1*(n1-1)) + s2_2*s2_2/(n2*n2*(n2-1)));
                const t = (x1-x2)/Math.sqrt(s1_2/n1 + s2_2/n2);
                const p = (1.0-jStat.studentt.cdf( Math.abs(t), ny ))*2;
                statisticalCol = statisticComputeColor(t, p);
                statisticalResult = (p*100).toFixed(3)+"%";
                return new TableResultValueEntry(f.name, value, formattedValue, conficenceIntervalStr, factor, factor.toFixed(2), statisticalCol[0], statisticalCol[1], statisticalCol[2], statisticalResult);
            } 
        });
    }
    filterResults = function(bench: Benchmark, frameworks: Array<Framework>, results: Array<Result>) {
        return frameworks.reduce((array, framework) => {
            const res = results.filter(r => r.benchmark === bench.id && r.framework === framework.name);
            if (res.length===1) array.push(res[0]);
            else array.push(null);
            return array;
        }, new Array<Result|null>());
    }
}