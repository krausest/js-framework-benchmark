var jStat:any = require('jStat').jStat;

export enum StatisticResult {Slower, Undecided, Faster}
export enum DisplayMode { DisplayMean, DisplayMedian, BoxPlot };

export enum FilterIssuesMode { AllImplentations, FilterErrors, FilterSevereIssues, FilterWarnings };

export enum FrameworkType { KEYED, NON_KEYED }

export interface Framework {
    name: string;
    type: FrameworkType;
    issues: number[];
    displayname: string;
}

export const knownIssues = [
    {issue: 634, severity: 0, text:"Issue: The HTML structure for the implementation is not fully correct.", link: "https://github.com/krausest/js-framework-benchmark/issues/634"},
    {issue: 694, severity: 0, text:"Issue: Keyed implementations must move the DOM nodes for swap rows ", link: "https://github.com/krausest/js-framework-benchmark/issues/694"},
    {issue: 772, severity: 1, text:"Note: Implementation is not data-driven ", link: "https://github.com/krausest/js-framework-benchmark/issues/772"},
    {issue: 800, severity: 2, text:"Note: state for selected row is kept on each row", link: "https://github.com/krausest/js-framework-benchmark/issues/800"},
    {issue: 796, severity: 2, text:"Note: Implementation uses explicit requestAnimationFrame calls", link: "https://github.com/krausest/js-framework-benchmark/issues/796"},
    {issue: 801, severity: 2, text:"Note: Implementation uses explicit event delegation", link: "https://github.com/krausest/js-framework-benchmark/issues/801"},
  ];

export function findIssue(issueNumber: number) {
    return knownIssues.find(i => i.issue === issueNumber)
}
export const minSeverity = (framework: Framework): number => 
    framework.issues.reduce((min, i) => Math.min(min, findIssue(i)?.severity ?? Number.POSITIVE_INFINITY), Number.POSITIVE_INFINITY)

export enum BenchmarkType { CPU, MEM, STARTUP }

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

let computeColor = function(factor: number): string {
    if (factor < 2.0) {
        let a = (factor - 1.0);
        let r = (1.0-a)* 99 + a * 255;
        let g = (1.0-a)* 191 + a * 236;
        let b = (1.0-a)* 124 + a * 132;
        return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
    } else  {
        let a = Math.min((factor - 2.0) / 2.0, 1.0);
        let r = (1.0-a)* 255 + a * 249;
        let g = (1.0-a)* 236 + a * 105;
        let b = (1.0-a)* 132 + a * 108;
        return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
    }
}

export class TableResultValueEntry {
    constructor(public key:string, public value: number, public formattedValue: string, 
        public deviation: string|null, public factor: number, public formattedFactor: string, 
        public bgColor: string, public textColor: string, 
        public statisticResult: StatisticResult,
        public statisticallySignificantFactor: string|number|undefined = undefined) {
    }
}

export class TableResultComparisonEntry {
    constructor(public key:string, public framework:Framework, public label: string,
        public bgColor: string, public textColor: string) {
    }
}

export class TableResultGeommeanEntry {
    constructor(public key:string, public framework:Framework, public mean: number, public bgColor: string, public textColor: string) {
    }
}

export interface ResultLookup {
    (benchmark: Benchmark, framework: Framework): Result|null;
}
export function convertToMap(results: Array<Result>): ResultLookup {
    let resultMap = new Map<String, Map<String, Result>>();
    results.forEach(r => {
        if (!resultMap.has(r.benchmark)) resultMap.set(r.benchmark, new Map<String,Result>());
        resultMap.get(r.benchmark)!.set(r.framework, r);
    });
    return (benchmark: Benchmark, framework: Framework) => {
        let m = resultMap.get(benchmark.id);
        if (!m) return null;
        let v = m.get(framework.name);
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

let statisticComputeColor = function(sign: number, pValue: number): [string, string, StatisticResult] {
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
        public displayMode: DisplayMode, public compareWith: Framework|undefined, public filterIssuesMode: FilterIssuesMode) {     

        this.selectedFameworks = new Set<Framework>();
        selectedFrameworksInDropdown.forEach(f => {
            let min = minSeverity(f)
            if (filterIssuesMode === FilterIssuesMode.AllImplentations
                || (filterIssuesMode === FilterIssuesMode.FilterErrors && min >0)
                || (filterIssuesMode === FilterIssuesMode.FilterSevereIssues && min >1)
                || (filterIssuesMode === FilterIssuesMode.FilterWarnings && min >2)
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
            let benchmarks = this.allBenchmarks.filter(benchmark => benchmark.type === type && this.selectedBenchmarks.has(benchmark));
            let results = benchmarks.map(benchmark => this.computeFactors(benchmark, type !== BenchmarkType.MEM));
            let geomMean = this.frameworks.map((framework, idx) => {
                let resultsForFramework = results.map(arr => arr[idx]);
                return this.computeGeometricMean(framework, benchmarks, resultsForFramework);
            });    
            let comparison = this.frameworks.map((framework, idx) => {
                let resultsForFramework = results.map(arr => arr[idx]);
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
        let zipped = this.frameworks.map((f,frameworkIndex) => {
            let sortValue;
            if (sortKey === SORT_BY_NAME) sortValue = f.name;
            else if (sortKey === SORT_BY_GEOMMEAN_CPU) sortValue = this.getResult(BenchmarkType.CPU).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else if (sortKey === SORT_BY_GEOMMEAN_MEM) sortValue = this.getResult(BenchmarkType.MEM).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else if (sortKey === SORT_BY_GEOMMEAN_STARTUP) sortValue = this.getResult(BenchmarkType.STARTUP).geomMean[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else {
                let cpuIdx = this.getResult(BenchmarkType.CPU).benchmarks.findIndex(b => b.id === sortKey);
                let memIdx = this.getResult(BenchmarkType.MEM).benchmarks.findIndex(b => b.id === sortKey);
                let startupIdx = this.getResult(BenchmarkType.STARTUP).benchmarks.findIndex(b => b.id === sortKey);
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
        let remappedIdx = zipped.map(z => z.origIndex);
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
        let copy = new Array<T>(array.length);
        remappedIdx.forEach((idx, i) => {
            copy[i] = array[idx];
        });
        return copy;
    }

    computeGeometricMean(framework: Framework, benchmarksCPU: Array<Benchmark>, resultsCPUForFramework: Array<TableResultValueEntry|null>) {
        let count = 0.0;
        let gMean = resultsCPUForFramework.reduce((gMean, r, idx) => {
            if (r !== null)  {
                count++;
                gMean *= (r.factor as number);
            }
            return gMean;
        }, 1.0);
        let value = Math.pow(gMean, 1 / count);
        return this.compareWith ? new TableResultGeommeanEntry(framework.name, framework, value, '#fff', '#000') :
             new TableResultGeommeanEntry(framework.name, framework, value, computeColor(value), '#000');
    }
    computeComparison(framework: Framework, benchmarksCPU: Array<Benchmark>, resultsCPUForFramework: Array<TableResultValueEntry|null>) {
        if (this.compareWith) {
            let statisticResult: StatisticResult|undefined = undefined;
            resultsCPUForFramework.forEach((r, idx) => {
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

    computeFactors(benchmark: Benchmark, clamp: boolean): Array<TableResultValueEntry|null> {
        let benchmarkResults = this.frameworks.map(f => this.results(benchmark, f));
        let selectFn = (result: Result|null) => {
            if (result===null) return 0;
            if (this.displayMode === DisplayMode.DisplayMedian) {
                return result.median;
            } else {
                return result.mean;
            }
        }
        let min = benchmarkResults.reduce((min, result) => result===null ? min : Math.min(min, selectFn(result)), Number.POSITIVE_INFINITY);
        return this.frameworks.map(f => {
            let result = this.results(benchmark, f);
            if (result === null) return null;

            let value = selectFn(result);
            let factor = value/min;
            let conficenceInterval = 1.959964 * (result.standardDeviation || 0) / Math.sqrt(result.values.length);
            let conficenceIntervalStr = benchmark.type === BenchmarkType.MEM ? null : conficenceInterval.toFixed(1);
            let formattedValue = formatEn.format(value);

            if (!this.compareWith) {
                return new TableResultValueEntry(f.name, value, formattedValue, conficenceIntervalStr, factor, factor.toFixed(2), computeColor(factor), '#000', StatisticResult.Undecided);
            } else {
                let compareWithResults = this.results(benchmark, this.compareWith)!;
                    // let meanStr = 'x'; //mean.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true});

                // X1,..,Xn: this Framework, Y1, ..., Ym: selected Framework
                // https://de.wikipedia.org/wiki/Zweistichproben-t-Test
                let statisticalResult = undefined;
                let statisticalCol = undefined;
                let compareWithMean = compareWithResults.mean;
                let stdDev = result.standardDeviation || 0;
                let compareWithResultsStdDev = compareWithResults.standardDeviation || 0;

                
                let x1 = result.mean;
                let x2 = compareWithMean;
                let s1_2 = stdDev*stdDev;
                let s2_2 = compareWithResultsStdDev * compareWithResultsStdDev;
                let n1 = 10;
                let n2 = 10;
                let ny = Math.pow(s1_2/n1 + s2_2/n2, 2) / (s1_2*s1_2 / (n1*n1*(n1-1)) + s2_2*s2_2/(n2*n2*(n2-1)));
                let t = (x1-x2)/Math.sqrt(s1_2/n1 + s2_2/n2);
                let p = (1.0-jStat.studentt.cdf( Math.abs(t), ny ))*2;
                statisticalCol = statisticComputeColor(t, p);
                statisticalResult = (p*100).toFixed(3)+"%";
                return new TableResultValueEntry(f.name, value, formattedValue, conficenceIntervalStr, factor, factor.toFixed(2), statisticalCol[0], statisticalCol[1], statisticalCol[2], statisticalResult);
            } 
        });
    }
    filterResults = function(bench: Benchmark, frameworks: Array<Framework>, results: Array<Result>) {
        return frameworks.reduce((array, framework) => {
            let res = results.filter(r => r.benchmark === bench.id && r.framework === framework.name);
            if (res.length===1) array.push(res[0]);
            else array.push(null);
            return array;
        }, new Array<Result|null>());
    }
}