import * as React from 'react';
var jStat:any = require('jStat').jStat;

export interface Framework {
    name: string;
    keyed: boolean;
}

export enum BenchmarkType { CPU, MEM, STARTUP }

export interface Benchmark {
    id: string;
    type: BenchmarkType;
    label: string;
    description: string;
}

export interface Result {
    framework: string;
    benchmark: string;
    type: string;
    min: number;
    max: number;
    mean: number;
    geometricMean: number|null;
    standardDeviation: number|null;
    median: number;
    values: number[];
    count?: number;
}

export interface DropdownCallback<T> {
  selectNone: (event: React.SyntheticEvent<any>) => void;
  selectAll: (event: React.SyntheticEvent<any>) => void;
  isNoneSelected: () => boolean;
  areAllSelected: () => boolean;
  isSelected: (item: T) => boolean;
}

export interface TableResultEntry {
    render() : JSX.Element;
}

export const SORT_BY_NAME = 'SORT_BY_NAME';
export const SORT_BY_GEOMMEAN = 'SORT_BY_GEOMMEAN';

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

export class TableResultValueEntry implements TableResultEntry {
    color: string;
    constructor(public key:string, public mean: number, public standardDeviation: number, public factor: number, public statisticallySignificantFactor: string|number|undefined, public statisticalCol: [string,string]|undefined) {
        this.color = computeColor(factor);
    }
    render() {
        let col = this.statisticalCol === undefined ? this.color : this.statisticalCol[0];
        let textCol = this.statisticalCol === undefined ? '#000' : this.statisticalCol[1];
        return (<td key={this.key} style={{backgroundColor:col, color: textCol}}>
                    <span className="mean">{this.mean.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true})}</span>
                    <span className="deviation">{this.standardDeviation.toFixed(1)}</span>
                    <br />
                    <span className="factor">({this.factor.toFixed(1)})</span>
                    <br/>
                    <span className="factor">{this.statisticallySignificantFactor}</span>
                </td>);
    }
}

export class TableResultGeommeanEntry implements TableResultEntry {
    color: string;
    constructor(public key:string, public mean: number) {
        this.color = computeColor(mean);
    }
    render() {
        return (<th key={this.key} style={{backgroundColor:this.color}}>{this.mean.toFixed(2)}
                </th>);
    }
}

interface ResultLookup {
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

let statisticComputeColor = function(sign: number, pValue: number): [string, string] {
    if (pValue > 0.10) {
        return ['#fff','#000'];
    }
    if (sign < 0) {
        let a = (0.1 - pValue) * 10.0;
        let r = 0;
        let g = (1.0-a)* 255 + a * 160;
        let b = 0;
        return [`rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`, '#fff'];
    } else  {
        let a = (0.1 - pValue) * 10.0;
        let r = (1.0-a)* 255 + a * 160;
        let g = 0;
        let b = 0;
        return [`rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`, '#fff'];
    }
}

export class ResultTableData {
    // Rows
    benchmarksCPU: Array<Benchmark>;
    benchmarksStartup: Array<Benchmark>;
    benchmarksMEM: Array<Benchmark>;
    // Columns
    frameworks: Array<Framework>;
    // Cell data
    resultsCPU: Array<Array<TableResultValueEntry|null>>;   // [benchmark][framework]
    geomMeanCPU: Array<TableResultGeommeanEntry|null>;
    resultsStartup: Array<Array<TableResultValueEntry|null>>;
    resultsMEM: Array<Array<TableResultValueEntry|null>>;

    constructor(public allFrameworks: Array<Framework>, public allBenchmarks: Array<Benchmark>, public results: ResultLookup,
        public selectedFrameworks: Set<Framework>, public selectedBenchmarks: Set<Benchmark>, nonKeyed: boolean|undefined, sortKey: string,
        public compareWith: Framework|undefined,
        public useMedian: boolean) {
        this.frameworks = this.allFrameworks.filter(framework => (nonKeyed===undefined || framework.keyed !== nonKeyed) && selectedFrameworks.has(framework));
        this.update(sortKey);
    }
    private update(sortKey: string) {
        this.benchmarksCPU = this.allBenchmarks.filter(benchmark => benchmark.type === BenchmarkType.CPU && this.selectedBenchmarks.has(benchmark));
        this.benchmarksStartup = this.allBenchmarks.filter(benchmark => benchmark.type === BenchmarkType.STARTUP && this.selectedBenchmarks.has(benchmark));
        this.benchmarksMEM = this.allBenchmarks.filter(benchmark => benchmark.type === BenchmarkType.MEM && this.selectedBenchmarks.has(benchmark));

        const prepare = (benchmark: Benchmark) => {
            this.frameworks.forEach(f => {
                let result = this.results(benchmark, f);
                if (result !== null) {
                    let vals = result.values.slice(0);
                    result.mean = jStat.mean(vals);
                    result.median = jStat.median(vals);
                    result.standardDeviation = jStat.stdev(vals, true);
                    result.count = vals.length;
                }
            });
        }

        this.benchmarksCPU.forEach(prepare);
        this.benchmarksStartup.forEach(prepare);
        this.benchmarksMEM.forEach(prepare);


        this.resultsCPU = this.benchmarksCPU.map(benchmark => this.computeFactors(benchmark, true));
        this.resultsStartup = this.benchmarksStartup.map(benchmark => this.computeFactors(benchmark, true));
        this.resultsMEM = this.benchmarksMEM.map(benchmark => this.computeFactors(benchmark, false));

        this.geomMeanCPU = this.frameworks.map((framework, idx) => {
            let resultsForFramework = this.resultsCPU.map(arr => arr[idx]);
            return this.computeGeometricMean(framework, this.benchmarksCPU, resultsForFramework);
        });
        this.sortBy(sortKey);
    }
    sortBy(sortKey: string) {
        let zipped = this.frameworks.map((f,frameworkIndex) => {
            let sortValue;
            if (sortKey === SORT_BY_NAME) sortValue = f.name;
            else if (sortKey === SORT_BY_GEOMMEAN) sortValue = this.geomMeanCPU[frameworkIndex]!.mean || Number.POSITIVE_INFINITY;
            else {
                let cpuIdx = this.benchmarksCPU.findIndex(b => b.id === sortKey);
                let startupIdx = this.benchmarksStartup.findIndex(b => b.id === sortKey);
                console.log("startupIdx", startupIdx);
                let memIdx = this.benchmarksMEM.findIndex(b => b.id === sortKey);
                if (cpuIdx>-1) sortValue = this.resultsCPU[cpuIdx][frameworkIndex]==null ? Number.POSITIVE_INFINITY : this.resultsCPU[cpuIdx][frameworkIndex]!.mean;
                else if (startupIdx>-1) sortValue = this.resultsStartup[startupIdx][frameworkIndex]==null ? Number.POSITIVE_INFINITY : this.resultsStartup[startupIdx][frameworkIndex]!.mean;
                else if (memIdx>-1) sortValue = this.resultsMEM[memIdx][frameworkIndex]==null ? Number.POSITIVE_INFINITY : this.resultsMEM[memIdx][frameworkIndex]!.mean;
                else throw `sortKey ${sortKey} not found`;
            }
            return {
                framework: f,
                origIndex: frameworkIndex,
                sortValue: sortValue
            };
        });
        zipped.sort((a,b) => { if (a.sortValue! < b.sortValue!) return -1; else if (a.sortValue == b.sortValue) return 0; return 1;})
        let remappedIdx = zipped.map(z => z.origIndex);
        this.frameworks = this.remap(remappedIdx, this.frameworks);
        this.resultsCPU = this.resultsCPU.map(row => this.remap(remappedIdx, row));
        this.geomMeanCPU = this.remap(remappedIdx, this.geomMeanCPU);
        this.resultsStartup = this.resultsStartup.map(row => this.remap(remappedIdx, row));
        this.resultsMEM = this.resultsMEM.map(row => this.remap(remappedIdx, row));
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
            let gMean = resultsCPUForFramework.reduce((gMean, r) => {
                if (r !== null)  {
                    count++;
                    gMean *= r.factor;
                }
                return gMean;
            }, 1.0);
            let value = Math.pow(gMean, 1 / count);
            return new TableResultGeommeanEntry(framework.name, value);
    }
    computeFactors(benchmark: Benchmark, clamp: boolean): Array<TableResultValueEntry|null> {
        let benchmarkResults = this.frameworks.map(f => this.results(benchmark, f));
        let compareWithResults = this.compareWith ? this.results(benchmark, this.compareWith) : undefined;
        let min = benchmarkResults.reduce((min, result) => result===null ? min : Math.min(min, this.useMedian ? result.median : result.mean), Number.POSITIVE_INFINITY);
        return this.frameworks.map(f => {
            let result = this.results(benchmark, f);
            if (result === null) return null;
            else {
                let mean = (this.useMedian && !compareWithResults) ? result.median : result.mean;
                let factor = clamp ? Math.max(16, mean) / Math.max(16, min) : mean/min;
                let standardDeviation = result.standardDeviation;

                let statisticalResult = undefined;
                let statisticalCol = undefined;
                // X1,..,Xn: this Framework, Y1, ..., Ym: selected Framework
                // https://de.wikipedia.org/wiki/Zweistichproben-t-Test
                if (compareWithResults) {
                    let compareWithMean = compareWithResults.mean;
                    let stdDev = result.standardDeviation || 0;
                    let compareWithResultsStdDev = compareWithResults.standardDeviation || 0;

                    let x1 = mean;
                    let x2 = compareWithMean;
                    let s1_2 = stdDev*stdDev;
                    let s2_2 = compareWithResultsStdDev * compareWithResultsStdDev;
                    let n1 = 10;
                    let n2 = 10;
                    let ny = Math.pow(s1_2/n1 + s2_2/n2, 2) /
                            (s1_2*s1_2 / (n1*n1*(n1-1)) + s2_2*s2_2/(n2*n2*(n2-1)));
                    let t = (x1-x2)/Math.sqrt(s1_2/n1 + s2_2/n2);
                    let p = (1.0-jStat.studentt.cdf( Math.abs(t), ny ))*2;
                    statisticalCol = statisticComputeColor(t, p);
                    statisticalResult = (p*100).toFixed(3)+"%";
                }
                return new TableResultValueEntry(f.name, mean, standardDeviation || 0, factor, statisticalResult, statisticalCol);
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