import { Benchmark, BenchmarkType, convertToMap, DisplayMode, Framework, FrameworkType, RawResult, Result, ResultTableData, SORT_BY_GEOMMEAN_CPU, FilterIssuesMode } from "./Common"
import {benchmarks, frameworks, results as rawResults} from './results';
var jStat:any = require('jStat').jStat;

let results : Result[] = (rawResults as RawResult[]).map(res => Object.assign(({framework: res.f, benchmark: res.b, values: res.v}),
    {mean: res.v ? jStat.mean(res.v) : Number.NaN,
    median: res.v ? jStat.median(res.v) : Number.NaN,
    standardDeviation: res.v ? jStat.stdev(res.v, true):  Number.NaN}));

let removeKeyedSuffix = (value: string) => {
    if  (value.endsWith('-non-keyed')) return value.substring(0,value.length-10)
    else if (value.endsWith('-keyed')) return value.substring(0,value.length-6)
    return value;
}
let mappedFrameworks = frameworks.map(f => ({name: f.name, displayname: removeKeyedSuffix(f.name), issues: f.issues ?? [], type:f.keyed ? FrameworkType.KEYED : FrameworkType.NON_KEYED}));

let allBenchmarks = benchmarks.reduce((set, b) => set.add(b), new Set<Benchmark>() );
let allFrameworks = mappedFrameworks.reduce((set, f) => set.add(f), new Set<Framework>() );
let resultLookup = convertToMap(results);

interface BenchmarkLists {
    [idx: number]: Benchmark[]    
}
interface FrameworkLists {
    [idx: number]: Framework[]    
}
interface ResultTables {
    [idx: number]: ResultTableData|undefined  
}
interface CompareWith {
    [idx: number]: Framework|undefined  
}

export interface State {
    benchmarkLists: BenchmarkLists;
    frameworkLists: FrameworkLists;
    benchmarks: Array<Benchmark>;
    frameworks: Array<Framework>;
    selectedBenchmarks: Set<Benchmark>;
    selectedFrameworksDropDown: Set<Framework>;
    resultTables: ResultTables;
    sortKey: string;
    displayMode: DisplayMode;
    compareWith: CompareWith;
    filterIssuesMode: FilterIssuesMode;
}

export const areAllBenchmarksSelected = (state: State, type: BenchmarkType) => state.benchmarkLists[type].every(b => state.selectedBenchmarks.has(b))
export const isNoneBenchmarkSelected = (state: State, type: BenchmarkType) => state.benchmarkLists[type].every(b => !state.selectedBenchmarks.has(b))

export const areAllFrameworksSelected = (state: State, type: FrameworkType) => state.frameworkLists[type].every(f => state.selectedFrameworksDropDown.has(f))
export const isNoneFrameworkSelected = (state: State, type: FrameworkType) => state.frameworkLists[type].every(f => !state.selectedFrameworksDropDown.has(f))


let pre_initialState : State = {    
    // static
    benchmarks: benchmarks,
    benchmarkLists: {
        [BenchmarkType.CPU]: benchmarks.filter(b => b.type === BenchmarkType.CPU),
        [BenchmarkType.MEM]: benchmarks.filter(b => b.type === BenchmarkType.MEM), 
        [BenchmarkType.STARTUP]: benchmarks.filter(b => b.type === BenchmarkType.STARTUP)
    },
    frameworks: mappedFrameworks,
    frameworkLists: {
        [FrameworkType.KEYED]: mappedFrameworks.filter(f => f.type === FrameworkType.KEYED),
        [FrameworkType.NON_KEYED]: mappedFrameworks.filter(f => f.type === FrameworkType.NON_KEYED),
    },
    // dynamic
    selectedBenchmarks: allBenchmarks,
    selectedFrameworksDropDown: allFrameworks,
    sortKey: SORT_BY_GEOMMEAN_CPU,
    displayMode: DisplayMode.DisplayMedian,
    resultTables: {
        [FrameworkType.KEYED]: undefined,
        [FrameworkType.NON_KEYED]: undefined
    },
    compareWith: {
        [FrameworkType.KEYED]: undefined,
        [FrameworkType.NON_KEYED]: undefined
    },
    filterIssuesMode: FilterIssuesMode.FilterErrors
}
let initialState: State = {
    ...pre_initialState,
    resultTables: updateResultTable(pre_initialState)
}

function updateResultTable({frameworks, benchmarks, selectedFrameworksDropDown: selectedFrameworks, selectedBenchmarks, sortKey, displayMode, compareWith, filterIssuesMode}: State) {
    return {
        [FrameworkType.KEYED]: new ResultTableData(frameworks, benchmarks, resultLookup, selectedFrameworks, selectedBenchmarks, FrameworkType.KEYED, sortKey, displayMode, compareWith[FrameworkType.KEYED], filterIssuesMode),
        [FrameworkType.NON_KEYED]: new ResultTableData(frameworks, benchmarks, resultLookup, selectedFrameworks, selectedBenchmarks, FrameworkType.NON_KEYED, sortKey, displayMode, compareWith[FrameworkType.NON_KEYED], filterIssuesMode)
    }
}

export const selectFramework = (framework: Framework, add: boolean) => {
    return {type: 'SELECT_FRAMEWORK', data: {framework, add}
    }
}

export const selectAllFrameworks = (frameworkType: FrameworkType, add: boolean) => {
    return {type: 'SELECT_ALL_FRAMEWORKS', data: {frameworkType, add}}
}

export const selectBenchmark = (benchmark: Benchmark, add: boolean) => {
    return {type: 'SELECT_BENCHMARK', data: {benchmark, add}
    }
}

export const selectAllBenchmarks = (benchmarkType: BenchmarkType, add: boolean) => {
    return {type: 'SELECT_ALL_BENCHMARKS', data: {benchmarkType, add}}
}

export const selectDisplayMode = (displayMode: DisplayMode) => {
    return {type: 'SELECT_DISPLAYMODE', data: {displayMode}}
}

export const selectFilterIssuesMode = (filterIssueMode: FilterIssuesMode) => {
    return {type: 'SELECT_FILTER_ISSUES_MODE', data: {filterIssueMode}}
}

export const compare = (framework: Framework) => {
    return {type: 'COMPARE', data: {framework}}
}
export const stopCompare = (framework: Framework) => {
    return {type: 'STOP_COMPARE', data: {framework}}
}

export const sort = (sortKey: string) => {
    return {type: 'SORT', data: {sortKey}}
}


export const reducer = (state = initialState, action: any) => {
    console.log("reducer", action)
    switch (action.type) {
        case 'SELECT_FRAMEWORK': {
            let newSelectedFramework = new Set(state.selectedFrameworksDropDown);
            if (action.data.add) newSelectedFramework.add(action.data.framework);
            else newSelectedFramework.delete(action.data.framework);
            let t = {...state, selectedFrameworksDropDown: newSelectedFramework};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'SELECT_ALL_FRAMEWORKS': {
            let newSelectedFramework = new Set(state.selectedFrameworksDropDown);
            for (let f of (action.data.frameworkType === FrameworkType.KEYED ? state.frameworkLists[FrameworkType.KEYED] : state.frameworkLists[FrameworkType.NON_KEYED])) {
                if (action.data.add) newSelectedFramework.add(f);
                else newSelectedFramework.delete(f);
            }
            let t = {...state, selectedFrameworksDropDown: newSelectedFramework};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'SELECT_BENCHMARK': {
            let newSelectedBenchmark = new Set(state.selectedBenchmarks);
            if (action.data.add) newSelectedBenchmark.add(action.data.benchmark);
            else newSelectedBenchmark.delete(action.data.benchmark);
            let t = {...state, selectedBenchmarks: newSelectedBenchmark};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'SELECT_ALL_BENCHMARKS': {
            let newSelectedBenchmark = new Set(state.selectedBenchmarks);
            // action.data.benchmarkType
            for (let b of state.benchmarkLists[BenchmarkType.CPU]) {
                if (action.data.add) newSelectedBenchmark.add(b)
                else newSelectedBenchmark.delete(b)
            }
            let t = {...state, selectedBenchmarks: newSelectedBenchmark}
            return {...t, resultTables: updateResultTable(t)}
        }
        case 'SELECT_DISPLAYMODE': {
            let t = {...state, displayMode: action.data.displayMode};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'COMPARE': {
            let compareWith = {...state.compareWith};
            compareWith[action.data.framework.type] = action.data.framework;
            
            let t = {...state, compareWith: compareWith};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'STOP_COMPARE': {
            let compareWith = {...state.compareWith};
            compareWith[action.data.framework.type] = undefined;
            let t = {...state, compareWith: compareWith};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'SORT': {
            let t = {...state, sortKey: action.data.sortKey};
            return {...t, resultTables: updateResultTable(t)};
        }
        case 'SELECT_FILTER_ISSUES_MODE': {
            const filterIssuesMode = action.data.filterIssueMode;
            let t = {...state, filterIssuesMode};
            return {...t, resultTables: updateResultTable(t)};
        }
        default:
            return state;
    }
  }