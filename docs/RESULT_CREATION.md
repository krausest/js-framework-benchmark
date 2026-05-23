# Result Creation Pipeline

This document describes how benchmark results flow from the benchmark runner to the results web application.

## Overview

The pipeline has three stages:

1. **Benchmark Execution** (`webdriver-ts`) — runs benchmarks and writes individual JSON result files
2. **Result Aggregation** (`webdriver-ts`, `npm run results`) — collects individual files into a compiled TypeScript module
3. **Result Display** (`webdriver-ts-results`) — a React/Vite web app that renders the results table

## Stage 1: Benchmark Execution

The benchmark runner (in `webdriver-ts/src/`) executes benchmarks for each framework and writes individual JSON result files to `webdriver-ts/results/`.

### Result File Format

Each file is named `{frameworkVersionString}_{benchmarkId}.json`, e.g. `thyn-v0.0.355-keyed_01_run1k.json`.

The JSON structure:
```json
{
  "framework": "thyn-v0.0.355-keyed",
  "keyed": true,
  "benchmark": "01_run1k",
  "type": "CPU",
  "values": {
    "total": { "min": 22, "max": 25, "mean": 23.1, "stddev": 0.8, "median": 23, "values": [23, 22.8, ...] },
    "script": { ... },
    "paint": { ... }
  }
}
```

### Framework Discovery

The benchmark runner discovers frameworks by calling the server's `/ls` endpoint (`server/src/frameworks/`), which:
1. Scans `frameworks/keyed/` and `frameworks/non-keyed/` for directories containing both `package.json` and `package-lock.json`
2. Reads the `js-framework-benchmark` property from each `package.json` to extract metadata: version, issues, customURL, frameworkHomeURL, etc.
3. Builds a `frameworkVersionString` (e.g. `thyn-v0.0.355-keyed`) from the package name and resolved version

## Stage 2: Result Aggregation

**Command**: `npm run results` (in `webdriver-ts/`)  
**Source**: `webdriver-ts/src/createResultJS.ts`

This step:
1. Fetches the framework list from the server (same `/ls` endpoint)
2. For each framework × benchmark combination, reads the corresponding JSON file from `webdriver-ts/results/`
3. Produces two outputs:
   - **`webdriver-ts-results/src/results.ts`** — a TypeScript module with pre-compiled data in a compressed indexed format
   - **`webdriver-ts/results.json`** — a human-readable JSON file

### Compressed Format in results.ts

```typescript
export const results: RawResult[] = [
  {
    f: 0,  // Index into the `frameworks` array
    b: [
      { b: 0, v: { total: [...], script: [...], paint: [...] } },  // Index into `benchmarks` array
      { b: 1, v: { total: [...], script: [...], paint: [...] } },
      ...
    ]
  },
  ...
];

export const frameworks = [
  { name: "alien-signals-v3.1.2-keyed", dir: "keyed/alien-signals", keyed: true, issues: [801], frameworkHomeURL: "..." },
  ...
];

export const benchmarks = [
  { id: "01_run1k", label: "...", description: "...", type: 0 },
  ...
];
```

## Stage 3: Result Display

**App**: `webdriver-ts-results/` (React + Vite + Zustand + Ant Design)  
**Command**: `npm run dev` (development) or `npm run build` (production)

### Data Loading (`store.ts`)

1. Imports pre-compiled `results`, `frameworks`, and `benchmarks` from `results.ts`
2. Maps raw frameworks to `Framework` objects with `type` (KEYED/NON_KEYED), `displayname`, `issues`, etc.
3. Expands compressed results into `Result[]` with computed statistics (mean, median, stdev via jStat)
4. Creates a `ResultLookup` map: `(benchmark, framework) → Result | null`
5. Removes frameworks that have no results at all

### Framework Selection ("Which frameworks?")

The dropdown UI (`SelectionToolbar/FrameworkSelector/`) shows **all** frameworks loaded from `results.ts`. Users can select/deselect individual frameworks. Initially all frameworks are selected.

### Table Rendering (`ResultTableData` in `Common.ts`)

When building the table, `ResultTableData` applies additional filtering:
1. Computes `allowedIssues` from the hardcoded `knownIssues` list in `helpers/issues.ts`
2. A framework is allowed if **all** its declared issues are in `allowedIssues`, OR if it's a vanillajs default framework
3. Only allowed and selected frameworks appear in the table
4. The `selectedCategories` (user-toggled issue categories) are passed but used separately for category-based filtering

### Known Issues System (`helpers/issues.ts`)

The `knownIssues` array defines recognized issue numbers (634, 772, 796, 800, 801, 1139, 1261). Each has a severity (NOTE or ERROR), descriptive text, and a GitHub link.

If a framework declares an issue number that is **not** in `knownIssues`, it will:
- Still appear in the "Which frameworks?" dropdown (since the dropdown shows all frameworks)
- Be **filtered out** from the results table (since `isFrameworkAllowed` returns false)

This is the mechanism that causes a framework to appear selectable but not visible in the table.
