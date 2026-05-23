import { create } from "zustand";
import { jStat } from "jstat";
import { frameworks as rawFrameworks, benchmarks as rawBenchmarks, results as rawResults } from "./results";
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
} from "@/Common";
import { knownIssues } from "@/helpers/issues";

const removeKeyedSuffix = (value: string) => {
  return value.replace(/-keyed|-non-keyed$/, "");
};

const mappedFrameworks = rawFrameworks.map((f) => ({
  name: f.name,
  dir: f.dir,
  displayname: removeKeyedSuffix(f.name),
  issues: f.issues ?? [],
  language: (f as Record<string, unknown>).language as string ?? "",
  type: f.keyed ? FrameworkType.KEYED : FrameworkType.NON_KEYED,
  frameworkHomeURL: f.frameworkHomeURL,
}));

const allBenchmarks = new Set(rawBenchmarks);
const allFrameworks = new Set(mappedFrameworks);

const results: Result[] = [];
for (const result of rawResults) {
  for (const b of result.b) {
    const values: { [k: string]: ResultValues } = {};
    for (const key of Object.keys(b.v)) {
      const r = b.v[key];
      const vals = {
        mean: r ? jStat.mean(r) : Number.NaN,
        median: r ? jStat.median(r) : Number.NaN,
        standardDeviation: r ? jStat.stdev(r, true) : Number.NaN,
        values: r,
      };
      values[key] = vals;
    }
    results.push({ framework: rawFrameworks[result.f].name, benchmark: rawBenchmarks[b.b].id, results: values });
  }
}

allFrameworks.forEach((f) => {
  if (!results.some((r) => r.framework === f.name)) {
    allFrameworks.delete(f);
  }
})

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
  selectedIssues: Set<number>;
  resultTables: ResultTables;
  sortKey: string;
  displayMode: DisplayMode;
  compareWith: CompareWith;
  cpuDurationMode: CpuDurationMode;
}

interface Actions {
  areAllBenchmarksSelected: (type: BenchmarkType) => boolean;
  isNoneBenchmarkSelected: (type: BenchmarkType) => boolean;
  areAllFrameworksSelected: (type: FrameworkType) => boolean;
  isNoneFrameworkSelected: (type: FrameworkType) => boolean;
  isUnflaggedFrameworkSelected: (type: FrameworkType) => boolean;
  areAllIssuesSelected: () => boolean;
  isNoneIssueSelected: () => boolean;
  selectIssue: (issueNumber: number, add: boolean) => void;
  selectAllIssues: (add: boolean) => void;
  selectFramework: (framework: Framework, add: boolean) => void;
  selectAllFrameworks: (frameworkType: FrameworkType, add: boolean) => void;
  selectUnflaggedFrameworks: (frameworkType: FrameworkType) => void;
  selectBenchmark: (benchmark: Benchmark, add: boolean) => void;
  selectAllBenchmarks: (benchmarkType: BenchmarkType, add: boolean) => void;
  selectDisplayMode: (displayMode: DisplayMode) => void;
  selectCpuDurationMode: (cpuDurationMode: CpuDurationMode) => void;
  compare: (framework: Framework) => void;
  stopCompare: (framework: Framework) => void;
  sort: (sortKey: string) => void;
  copyStateToClipboard: () => void;
  setStateFromClipboard: (arg: unknown) => void;
}

function filterFrameworksByIssues(selectedFrameworks: Set<Framework>, selectedIssues: Set<number>): Set<Framework> {
  const filtered = new Set<Framework>();
  for (const framework of selectedFrameworks) {
    if (framework.issues.length === 0 || framework.issues.every((i) => selectedIssues.has(i))) {
      filtered.add(framework);
    }
  }
  return filtered;
}

function updateResultTable({
  frameworks,
  benchmarks,
  selectedFrameworks,
  selectedBenchmarks,
  selectedIssues,
  sortKey,
  displayMode,
  compareWith,
  cpuDurationMode,
}: State) {
  const filteredFrameworks = filterFrameworksByIssues(selectedFrameworks, selectedIssues);
  return {
    [FrameworkType.KEYED]: new ResultTableData(
      frameworks,
      benchmarks,
      resultLookup,
      filteredFrameworks,
      selectedBenchmarks,
      FrameworkType.KEYED,
      sortKey,
      displayMode,
      compareWith[FrameworkType.KEYED],
      cpuDurationMode
    ),
    [FrameworkType.NON_KEYED]: new ResultTableData(
      frameworks,
      benchmarks,
      resultLookup,
      filteredFrameworks,
      selectedBenchmarks,
      FrameworkType.NON_KEYED,
      sortKey,
      displayMode,
      compareWith[FrameworkType.NON_KEYED],
      cpuDurationMode
    ),
  };
}

interface ClipboardState {
  benchmarks: string[];
  frameworks: string[];
  issues?: number[];
  displayMode: DisplayMode;
}

function extractClipboardState(state: ClipboardState): Partial<State> {
  const newState: Partial<State> = {};

  if (state.benchmarks) {
    const newSelectedBenchmarks = new Set<Benchmark>();
    for (const benchmark of state.benchmarks) {
      for (const sb of rawBenchmarks) {
        if (benchmark === sb.id) newSelectedBenchmarks.add(sb);
      }
    }
    newState.selectedBenchmarks = newSelectedBenchmarks;
  }

  if (state.frameworks) {
    const newSelectedFramework = new Set<Framework>();
    for (const framework of state.frameworks) {
      for (const sf of mappedFrameworks) {
        if (framework === sf.dir) newSelectedFramework.add(sf);
      }
    }
    newState.selectedFrameworks = newSelectedFramework;
  }

  if (state.displayMode) {
    newState.displayMode = state.displayMode;
  }

  if (state.issues) {
    newState.selectedIssues = new Set(state.issues);
  }

  return newState;
}

const preInitialState: State = {
  // State
  benchmarks: rawBenchmarks,
  benchmarkLists: {
    [BenchmarkType.CPU]: rawBenchmarks.filter((b) => b.type === BenchmarkType.CPU),
    [BenchmarkType.MEM]: rawBenchmarks.filter((b) => b.type === BenchmarkType.MEM),
    [BenchmarkType.SIZE]: rawBenchmarks.filter((b) => b.type === BenchmarkType.SIZE),
  },
  frameworks: mappedFrameworks,
  frameworkLists: {
    [FrameworkType.KEYED]: mappedFrameworks.filter((f) => f.type === FrameworkType.KEYED),
    [FrameworkType.NON_KEYED]: mappedFrameworks.filter((f) => f.type === FrameworkType.NON_KEYED),
  },
  // dynamic
  selectedBenchmarks: allBenchmarks,
  selectedFrameworks: allFrameworks,
  selectedIssues: new Set(knownIssues.map((i) => i.number)),
  sortKey: SORT_BY_GEOMMEAN_CPU,
  displayMode: DisplayMode.DISPLAY_MEDIAN,
  resultTables: {
    [FrameworkType.KEYED]: undefined,
    [FrameworkType.NON_KEYED]: undefined,
  },
  compareWith: {
    [FrameworkType.KEYED]: undefined,
    [FrameworkType.NON_KEYED]: undefined,
  },
  cpuDurationMode: CpuDurationMode.TOTAL,
};

const initialState: State = {
  ...preInitialState,
  resultTables: updateResultTable(preInitialState),
};

export const useRootStore = create<State & Actions>((set, get) => ({
  ...initialState,
  // Getters
  areAllBenchmarksSelected: (type) => {
    return get().benchmarkLists[type].every((benchmark) => get().selectedBenchmarks.has(benchmark));
  },
  isNoneBenchmarkSelected: (type) => {
    return get().benchmarkLists[type].every((benchmark) => !get().selectedBenchmarks.has(benchmark));
  },
  areAllFrameworksSelected: (type) => {
    return get().frameworkLists[type].every((framework) => get().selectedFrameworks.has(framework));
  },
  isNoneFrameworkSelected: (type) => {
    return get().frameworkLists[type].every((framework) => !get().selectedFrameworks.has(framework));
  },
  isUnflaggedFrameworkSelected: (type) => {
    return get().frameworkLists[type].every((framework) => framework.issues.length ? !get().selectedFrameworks.has(framework) : get().selectedFrameworks.has(framework));
  },
  areAllIssuesSelected: () => {
    return knownIssues.every((issue) => get().selectedIssues.has(issue.number));
  },
  isNoneIssueSelected: () => {
    return knownIssues.every((issue) => !get().selectedIssues.has(issue.number));
  },
  // Actions
  selectIssue: (issueNumber: number, add: boolean) => {
    const newSelectedIssues = new Set(get().selectedIssues);
    if (add) {
      newSelectedIssues.add(issueNumber);
    } else {
      newSelectedIssues.delete(issueNumber);
    }
    const t = { ...get(), selectedIssues: newSelectedIssues };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  selectAllIssues: (add: boolean) => {
    const newSelectedIssues = new Set<number>();
    if (add) {
      for (const issue of knownIssues) {
        newSelectedIssues.add(issue.number);
      }
    }
    const t = { ...get(), selectedIssues: newSelectedIssues };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  selectFramework: (framework: Framework, add: boolean) => {
    const newSelectedFramework = new Set(get().selectedFrameworks);

    if (add) {
      newSelectedFramework.add(framework);
    } else {
      newSelectedFramework.delete(framework);
    }

    const t = { ...get(), selectedFrameworks: newSelectedFramework };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
  selectUnflaggedFrameworks: (frameworkType: FrameworkType) => {
    const newSelectedFramework = new Set(get().selectedFrameworks);
    const frameworks =
      frameworkType === FrameworkType.KEYED
        ? get().frameworkLists[FrameworkType.KEYED]
        : get().frameworkLists[FrameworkType.NON_KEYED];

    for (const framework of frameworks) {
      if (framework.issues.length) {
        newSelectedFramework.delete(framework);
      } else {
        newSelectedFramework.add(framework);
      }
    }

    const t = { ...get(), selectedFrameworks: newSelectedFramework };
    return set(() => ({
      ...t,
      resultTables: updateResultTable(t),
    }));
  },
  selectAllFrameworks: (frameworkType: FrameworkType, add: boolean) => {
    const newSelectedFramework = new Set(get().selectedFrameworks);
    const frameworks =
      frameworkType === FrameworkType.KEYED
        ? get().frameworkLists[FrameworkType.KEYED]
        : get().frameworkLists[FrameworkType.NON_KEYED];

    for (const framework of frameworks) {
      if (add) {
        newSelectedFramework.add(framework);
      } else {
        newSelectedFramework.delete(framework);
      }
    }

    const t = { ...get(), selectedFrameworks: newSelectedFramework };
    return set(() => ({
      ...t,
      resultTables: updateResultTable(t),
    }));
  },
  selectBenchmark: (benchmark: Benchmark, add: boolean) => {
    const newSelectedBenchmark = new Set(get().selectedBenchmarks);

    if (add) {
      newSelectedBenchmark.add(benchmark);
    } else {
      newSelectedBenchmark.delete(benchmark);
    }

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
      if (add) {
        newSelectedBenchmark.add(benchmark);
      } else {
        newSelectedBenchmark.delete(benchmark);
      }
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
  copyStateToClipboard: () => {
    const currentState = get();

    const serializedState: ClipboardState = {
      frameworks: currentState.frameworks.filter((f) => currentState.selectedFrameworks.has(f)).map((f) => f.dir),
      benchmarks: currentState.benchmarks.filter((f) => currentState.selectedBenchmarks.has(f)).map((f) => f.id),
      issues: [...currentState.selectedIssues],
      displayMode: currentState.displayMode,
    };

    const json = JSON.stringify(serializedState);

    try {
      navigator.clipboard.writeText(json);
      window.location.hash = btoa(json);
    } catch (error) {
      console.error("Copying state failed", error);
    }
  },
  setStateFromClipboard: (arg) => {
    if (!arg) {
      console.log("no state found");
      return;
    }

    const t = { ...get(), ...extractClipboardState(arg as ClipboardState) };
    return set(() => ({ ...t, resultTables: updateResultTable(t) }));
  },
}));
