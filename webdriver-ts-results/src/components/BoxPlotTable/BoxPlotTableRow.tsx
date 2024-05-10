import React from "react";
import { Benchmark, Framework, ResultLookup, CpuDurationMode } from "@/Common";
import BoxPlotTableChart from "./BoxPlotTableChart";

interface Props {
  frameworks: Array<Framework>;
  benchmark: Benchmark;
  results: ResultLookup;
  currentSortKey: string;
  sortBy: (name: string) => void;
  cpuDurationMode: CpuDurationMode;
}

const BoxPlotTableRow = ({ frameworks, benchmark, results, currentSortKey, sortBy, cpuDurationMode }: Props) => {
  const resultsValues = (framework: Framework) => results(benchmark, framework)?.results[cpuDurationMode].values ?? [];

  const handleSortByBenchmarkResults = (event: React.MouseEvent) => {
    event.preventDefault();
    sortBy(benchmark.id);
  };

  const traces = frameworks.map((framework) => ({
    framework: framework.name,
    values: resultsValues(framework),
  }));

  return (
    <tr key={benchmark.id} style={{ height: 250 }}>
      <th className="benchname">
        <button
          className={`button button__text ${currentSortKey === benchmark.id ? "sort-key" : ""}`}
          onClick={handleSortByBenchmarkResults}
          aria-label="Sort by benchmark results (from best to worst)"
        >
          {benchmark.label}
        </button>
        <div className="rowCount">{benchmark.description}</div>
      </th>
      <td>
        <BoxPlotTableChart traces={traces} />
      </td>
    </tr>
  );
};

export default BoxPlotTableRow;
