import React from "react";
import { SORT_BY_NAME, Benchmark, Framework, ResultLookup, CpuDurationMode } from "@/Common";
import BoxPlotTableRows from "./BoxPlotTableRows";

interface Props {
  frameworks: Array<Framework>;
  benchmarks: Array<Benchmark>;
  results: ResultLookup;
  currentSortKey: string;
  sortBy: (name: string) => void;
  cpuDurationMode: CpuDurationMode;
}

const BoxPlotTable = ({ frameworks, benchmarks, results, currentSortKey, sortBy, cpuDurationMode }: Props) => {
  const handleSortByName = (event: React.MouseEvent) => {
    event.preventDefault();
    sortBy(SORT_BY_NAME);
  };

  return (
    <div className="results">
      <h3>Duration in milliseconds</h3>
      <div className="results__table-container">
        <table className="results__table">
          <thead>
            <tr>
              <th className="benchname">
                <button
                  className={`button button__text ${currentSortKey === SORT_BY_NAME ? "sort-key" : ""}`}
                  aria-label="Sort frameworks in ascending order (asc)"
                  onClick={handleSortByName}
                >
                  Name
                </button>
              </th>
              <th style={{ width: frameworks.length * 70 + 100 }}></th>
            </tr>
          </thead>
          <tbody>
            <BoxPlotTableRows
              results={results}
              frameworks={frameworks}
              benchmarks={benchmarks}
              currentSortKey={currentSortKey}
              sortBy={sortBy}
              cpuDurationMode={cpuDurationMode}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoxPlotTable;
