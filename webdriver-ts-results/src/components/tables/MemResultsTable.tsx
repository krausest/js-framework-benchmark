import React from "react";
import { ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_MEM, BenchmarkType } from "@/Common";
import ValueResultRow from "./ValueResultRow";
import GeomMeanRow from "./GeomMeanRow";

interface Props {
  data: ResultTableData;
  currentSortKey: string;
  sortBy: (name: string) => void;
}

const MemResultsTable = ({ data, currentSortKey, sortBy }: Props) => {
  const resultsMEM = data.getResult(BenchmarkType.MEM);

  const handleSortByName = (event: React.MouseEvent) => {
    event.preventDefault();
    sortBy(SORT_BY_NAME);
  };

  return resultsMEM.results.length === 0 ? null : (
    <>
      <thead>
        <tr>
          <td className="description">
            <h3>Memory allocation in MBs ± 95% confidence interval</h3>
          </td>
        </tr>
      </thead>
      <thead>
        <tr>
          <th className="benchname">
            <button
              className={`button button__text ${currentSortKey === SORT_BY_NAME ? "sort-key" : ""}`}
              onClick={handleSortByName}
            >
              Name
            </button>
          </th>
          {data.frameworks.map((f) => (
            <th key={f.displayname}>{f.displayname}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resultsMEM.results.map((resultsForBenchmark, benchIdx) => (
          <ValueResultRow
            key={resultsMEM.benchmarks[benchIdx]?.id}
            benchIdx={benchIdx}
            resultsForBenchmark={resultsForBenchmark}
            benchmarks={resultsMEM.benchmarks}
            currentSortKey={currentSortKey}
            sortBy={sortBy}
          />
        ))}
        <GeomMeanRow
          weighted={false}
          currentSortKey={currentSortKey}
          sortBy={sortBy}
          geomMean={resultsMEM.geomMean}
          sortbyGeommeanEnum={SORT_BY_GEOMMEAN_MEM}
        />
      </tbody>
    </>
  );
};

export default MemResultsTable;
