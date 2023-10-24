import { create } from "zustand";
import { jStat } from "jstat";
import {
  frameworks,
  benchmarks as rawBenchmarks,
  results as rawResults,
} from "./results";
import {
  Benchmark,
  BenchmarkType,
  convertToMap,
  DisplayMode,
  Framework,
  FrameworkType,
  Result,
  ResultTableData,
  SORT_BY_GEOMMEAN_CPU,
  ResultValues,
  CpuDurationMode,
  knownIssues,
} from "./Common";

// OK
const benchmarks = rawBenchmarks.filter(
  (benchmark) =>
    benchmark.id !== "32_startup-bt" &&
    benchmark.id !== "33_startup-mainthreadcost",
);

// OK
const results: Result[] = rawResults.map((result) => {
  const values: { [k: string]: ResultValues } = {};
  for (const key of Object.keys(result.v)) {
    const r = result.v[key];
    const vals = {
      mean: r ? jStat.mean(r) : Number.NaN,
      median: r ? jStat.median(r) : Number.NaN,
      standardDeviation: r ? jStat.stdev(r, true) : Number.NaN,
      values: r,
    };
    values[key] = vals;
  }
  return { framework: result.f, benchmark: result.b, results: values };
});

// OK
const removeKeyedSuffix = (value: string) => {
  if (value.endsWith("-non-keyed"))
    return value.substring(0, value.length - 10);
  else if (value.endsWith("-keyed"))
    return value.substring(0, value.length - 6);
  return value;
};

// OK
const mappedFrameworks = frameworks.map((f) => ({
  name: f.name,
  dir: f.dir,
  displayname: removeKeyedSuffix(f.name),
  issues: f.issues ?? [],
  type: f.keyed ? FrameworkType.KEYED : FrameworkType.NON_KEYED,
  frameworkHomeURL: f.frameworkHomeURL,
}));

const allBenchmarks = new Set([...benchmarks]);
const allFrameworks = new Set([...mappedFrameworks]);

const resultLookup = convertToMap(results);

interface BenchmarkLists {
  [idx: number]: Benchmark[];
}
interface FrameworkLists {
  [idx: number]: Framework[];
}
interface ResultTables {
  [idx: number]: ResultTableData | undefined;
}
interface CompareWith {
  [idx: number]: Framework | undefined;
}

interface State {
  benchmarkLists: BenchmarkLists;
  frameworkLists: FrameworkLists;
  benchmarks: Array<Benchmark>;
  frameworks: Array<Framework>;
  selectedBenchmarks: Set<Benchmark>;
  selectedFrameworks: Set<Framework>;
  resultTables: ResultTables;
  sortKey: string;
  displayMode: DisplayMode;
  compareWith: CompareWith;
  categories: Set<number>;
  cpuDurationMode: CpuDurationMode;
}

interface Actions {
  areAllBenchmarksSelected: (type: BenchmarkType) => boolean;
  isNoneBenchmarkSelected: (type: BenchmarkType) => boolean;
  areAllFrameworksSelected: (type: FrameworkType) => boolean;
  isNoneFrameworkSelected: (type: FrameworkType) => boolean;
  selectFramework: (framework: Framework, add: boolean) => void;
  selectAllFrameworks: (frameworkType: FrameworkType, add: boolean) => void;
  selectCategory: (categoryId: number, add: boolean) => void;
  selectBenchmark: (benchmark: Benchmark, add: boolean) => void;
  selectAllBenchmarks: (benchmarkType: BenchmarkType, add: boolean) => void;
  selectDisplayMode: (displayMode: DisplayMode) => void;
  selectCpuDurationMode: (cpuDurationMode: CpuDurationMode) => void;
  compare: (framework: Framework) => void;
  stopCompare: (framework: Framework) => void;
  sort: (sortKey: string) => void;
  setStateFromClipboard: (arg: unknown) => void;
}

function updateResultTable({
  frameworks,
  benchmarks,
  selectedFrameworks,
  selectedBenchmarks,
  sortKey,
  displayMode,
  compareWith,
  categories,
  cpuDurationMode,
}: State) {
  return {
    [FrameworkType.KEYED]: new ResultTableData(
      frameworks,
      benchmarks,
      resultLookup,
      selectedFrameworks,
      selectedBenchmarks,
      FrameworkType.KEYED,
      sortKey,
      displayMode,
      compareWith[FrameworkType.KEYED],
      categories,
      cpuDurationMode,
    ),
    [FrameworkType.NON_KEYED]: new ResultTableData(
      frameworks,
      benchmarks,
      resultLookup,
      selectedFrameworks,
      selectedBenchmarks,
      FrameworkType.NON_KEYED,
      sortKey,
      displayMode,
      compareWith[FrameworkType.NON_KEYED],
      categories,
      cpuDurationMode,
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractState(state: any): Partial<State> {
  let t = {};
  if (state.benchmarks !== undefined) {
    const newSelectedBenchmarks = new Set<Benchmark>();
    for (const b of state.benchmarks) {
      for (const sb of benchmarks) {
        if (b === sb.id) newSelectedBenchmarks.add(sb);
      }
    }
    t = { ...t, selectedBenchmarks: newSelectedBenchmarks };
  }
  if (state.frameworks !== undefined) {
    const newSelectedFramework = new Set<Framework>();
    for (const f of state.frameworks) {
      for (const sf of mappedFrameworks) {
        if (f === sf.dir) newSelectedFramework.add(sf);
      }
    }
    t = { ...t, selectedFrameworks: newSelectedFramework };
  }
  if (state.displayMode !== undefined) {
    t = { ...t, displayMode: state.displayMode };
  }
  return t;
}

const preInitialState: State = {
  // State
  benchmarks: benchmarks,
  benchmarkLists: {
    [BenchmarkType.CPU]: benchmarks.filter((b) => b.type === BenchmarkType.CPU),
    [BenchmarkType.MEM]: benchmarks.filter((b) => b.type === BenchmarkType.MEM),
    [BenchmarkType.STARTUP]: benchmarks.filter(
      (b) => b.type === BenchmarkType.STARTUP,
    ),
  },
  frameworks: mappedFrameworks,
  frameworkLists: {
    [FrameworkType.KEYED]: mappedFrameworks.filter(
      (f) => f.type === FrameworkType.KEYED,
    ),
    [FrameworkType.NON_KEYED]: mappedFrameworks.filter(
      (f) => f.type === FrameworkType.NON_KEYED,
    ),
  },
  // dynamic
  selectedBenchmarks: allBenchmarks,
  selectedFrameworks: allFrameworks,
  sortKey: SORT_BY_GEOMMEAN_CPU,
  displayMode: DisplayMode.DisplayMedian,
  resultTables: {
    [FrameworkType.KEYED]: undefined,
    [FrameworkType.NON_KEYED]: undefined,
  },
  compareWith: {
    [FrameworkType.KEYED]: undefined,
    [FrameworkType.NON_KEYED]: undefined,
  },
  categories: new Set(knownIssues.map((ki) => ki.issue)),
  cpuDurationMode: CpuDurationMode.Total,
};

const initialState: State = {
  ...preInitialState,
  resultTables: updateResultTable(preInitialState),
};

export const useRootStore = create<State & Actions>((set, get) => ({
  ...initialState,
  // Getters
  areAllBenchmarksSelected: (type) => {
    return get().benchmarkLists[type].every((benchmark) =>
      get().selectedBenchmarks.has(benchmark),
    );
  },
  isNoneBenchmarkSelected: (type) => {
    return get().benchmarkLists[type].every(
      (benchmark) => !get().selectedBenchmarks.has(benchmark),
    );
  },
  areAllFrameworksSelected: (type) => {
    return get().frameworkLists[type].every((framework) =>
      get().selectedFrameworks.has(framework),
    );
  },
  isNoneFrameworkSelected: (type) => {
    return get().frameworkLists[type].every(
      (framework) => !get().selectedFrameworks.has(framework),
    );
  },
  // Actions
  selectFramework: (framework: Framework, add: boolean) => {
    const newSelectedFramework = new Set(get().selectedFrameworks);

    add
      ? newSelectedFramework.add(framework)
      : newSelectedFramework.delete(framework);

    const t = { ...get(), selectedFrameworks: newSelectedFramework };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  selectAllFrameworks: (frameworkType: FrameworkType, add: boolean) => {
    const newSelectedFramework = new Set(get().selectedFrameworks);
    const frameworks =
      frameworkType === FrameworkType.KEYED
        ? get().frameworkLists[FrameworkType.KEYED]
        : get().frameworkLists[FrameworkType.NON_KEYED];

    for (const framework of frameworks) {
      add
        ? newSelectedFramework.add(framework)
        : newSelectedFramework.delete(framework);
    }

    const t = { ...get(), selectedFrameworks: newSelectedFramework };
    return set(() => ({
      ...t,
      resultTables: updateResultTable(t),
    }));
  },
  selectCategory: (categoryId: number, add: boolean) => {
    const categories = new Set(get().categories);

    add ? categories.add(categoryId) : categories.delete(categoryId);

    const t = { ...get(), categories };
    return set(() => ({
      ...t,
      resultTables: updateResultTable(t),
    }));
  },
  selectBenchmark: (benchmark: Benchmark, add: boolean) => {
    const newSelectedBenchmark = new Set(get().selectedBenchmarks);

    add
      ? newSelectedBenchmark.add(benchmark)
      : newSelectedBenchmark.delete(benchmark);

    const t = { ...get(), selectedBenchmarks: newSelectedBenchmark };
    return set(() => ({
      ...t,
      resultTables: updateResultTable(t),
    }));
  },
  selectAllBenchmarks: (benchmarkType: BenchmarkType, add: boolean) => {
    const newSelectedBenchmark = new Set(get().selectedBenchmarks);
    const benchmarks = get().benchmarkLists[benchmarkType];

    for (const benchmark of benchmarks) {
      add
        ? newSelectedBenchmark.add(benchmark)
        : newSelectedBenchmark.delete(benchmark);
    }

    const t = { ...get(), selectedBenchmarks: newSelectedBenchmark };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  selectDisplayMode: (displayMode: DisplayMode) => {
    const t = { ...get(), displayMode };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  selectCpuDurationMode: (cpuDurationMode: CpuDurationMode) => {
    const t = { ...get(), cpuDurationMode };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  compare: (framework: Framework) => {
    const compareWith = { ...get().compareWith };
    compareWith[framework.type] = framework;

    const t = { ...get(), compareWith };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  stopCompare: (framework: Framework) => {
    const compareWith = { ...get().compareWith };
    compareWith[framework.type] = undefined;

    const t = { ...get(), compareWith };
    return set(() => ({
      ...t,
      resultTables: updateResultTable(t),
    }));
  },
  sort: (sortKey: string) => {
    const t = { ...get(), sortKey };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  setStateFromClipboard: (arg) => {
    if (!arg) {
      console.log("no state found");
      return;
    }

    const t = { ...get(), ...extractState(arg) };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
}));
