import * as React from 'react';

export interface Framework {
    name: string;
    uri: string;
    nonKeyed: boolean;
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
    geometricMean: number;
    standardDeviation: number;
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
    constructor(public mean: number, public standardDeviation: number, public factor: number) {
        this.color = computeColor(factor);
    }
    render() {
        return (<td style={{backgroundColor:this.color}}>
                    <span className="mean">{this.mean.toFixed(1)}</span>
                    <span className="deviation">{this.standardDeviation.toFixed(1)}</span>
                    <br />
                    <span className="factor">({this.factor.toFixed(1)})</span>
                </td>);
    }
}

export class TableResultGeommeanEntry implements TableResultEntry {
    color: string;
    constructor(public mean: number) {
        this.color = computeColor(mean);
    }
    render() {
        return (<th style={{backgroundColor:this.color}}>{this.mean.toFixed(1)}
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

export class ResultTableData {
    // Rows
    benchmarksCPU: Array<Benchmark>;
    benchmarksMEM: Array<Benchmark>;
    // Columns
    frameworks: Array<Framework>;
    // Cell data
    resultsCPU: Array<Array<TableResultValueEntry|null>>;   // [benchmark][framework]
    geomMeanCPU: Array<TableResultGeommeanEntry|null>;
    resultsMEM: Array<Array<TableResultValueEntry|null>>;

    constructor(public allFrameworks: Array<Framework>, public allBenchmarks: Array<Benchmark>, public results: ResultLookup, 
        public selectedFrameworks: Set<Framework>, public selectedBenchmarks: Set<Benchmark>, nonKeyed: boolean|undefined, sortKey: string) {
        this.frameworks = this.allFrameworks.filter(framework => (nonKeyed===undefined || framework.nonKeyed === nonKeyed) && selectedFrameworks.has(framework));
        this.update(sortKey);
    }
    private update(sortKey: string) {
        this.benchmarksCPU = this.allBenchmarks.filter(benchmark => benchmark.type !== BenchmarkType.MEM && this.selectedBenchmarks.has(benchmark));
        this.benchmarksMEM = this.allBenchmarks.filter(benchmark => benchmark.type === BenchmarkType.MEM && this.selectedBenchmarks.has(benchmark));

        this.resultsCPU = this.benchmarksCPU.map(benchmark => this.computeFactors(benchmark, true));
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
            else if (sortKey === SORT_BY_GEOMMEAN) sortValue = this.geomMeanCPU[frameworkIndex]!.mean;
            else {
                let cpuIdx = this.benchmarksCPU.findIndex(b => b.id === sortKey);
                let memIdx = this.benchmarksMEM.findIndex(b => b.id === sortKey);
                if (cpuIdx>-1) sortValue = this.resultsCPU[cpuIdx][frameworkIndex]==null ? Number.POSITIVE_INFINITY : this.resultsCPU[cpuIdx][frameworkIndex]!.mean;
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
            return new TableResultGeommeanEntry(value);
    }
    computeFactors(benchmark: Benchmark, clamp: boolean): Array<TableResultValueEntry|null> {
        let benchmarkResults = this.frameworks.map(f => this.results(benchmark, f));
        let min = benchmarkResults.reduce((min, result) => result===null ? min : Math.min(min,result.mean), Number.POSITIVE_INFINITY);
        return this.frameworks.map(f => {
            let result = this.results(benchmark, f);
            if (result === null) return null;
            else {
                let mean = result.mean;
                let factor = clamp ? Math.max(16, result.mean) / Math.max(16, min) : result.mean/min;
                let standardDeviation = result.standardDeviation;
                return new TableResultValueEntry(mean, standardDeviation, factor);
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