import React from "react";
import { ResultTableData, SORT_BY_NAME, BenchmarkType, SORT_BY_GEOMMEAN_SIZE } from "@/Common";
import ValueResultRow from "./ValueResultRow";
import GeomMeanRow from "./GeomMeanRow";

interface Props {
  data: ResultTableData;
  currentSortKey: string;
  sortBy: (name: string) => void;
}

const SizeResultsTable = ({ data, currentSortKey, sortBy }: Props) => {
  const resultsSize = data.getResult(BenchmarkType.SIZE);

  const handleSortByName = (event: React.MouseEvent) => {
    event.preventDefault();
    sortBy(SORT_BY_NAME);
  };

  return resultsSize.results.length === 0 ? null : (
    <>
      <thead>
        <tr>
          <td className="description">
            <h3>Transferred size (in kBs) and first paint</h3>
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
        {resultsSize.results.map((resultsForBenchmark, benchIdx) => (
          <ValueResultRow
            key={resultsSize.benchmarks[benchIdx]?.id}
            benchIdx={benchIdx}
            resultsForBenchmark={resultsForBenchmark}
            benchmarks={resultsSize.benchmarks}
            currentSortKey={currentSortKey}
            sortBy={sortBy}
          />
        ))}
        <GeomMeanRow
          weighted={false}
          currentSortKey={currentSortKey}
          sortBy={sortBy}
          geomMean={resultsSize.geomMean}
          sortbyGeommeanEnum={SORT_BY_GEOMMEAN_SIZE}
        />
      </tbody>
    </>
  );
};

export default SizeResultsTable;
