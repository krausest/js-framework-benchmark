import React from "react";
import { ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_STARTUP, BenchmarkType } from "@/Common";
import ValueResultRow from "./ValueResultRow";
import GeomMeanRow from "./GeomMeanRow";

interface Props {
  data: ResultTableData;
  currentSortKey: string;
  sortBy: (name: string) => void;
}

const StartupResultsTable = ({ data, currentSortKey, sortBy }: Props) => {
  const resultsStartup = data.getResult(BenchmarkType.STARTUP);

  const handleSortByName = (event: React.MouseEvent) => {
    event.preventDefault();
    sortBy(SORT_BY_NAME);
  };

  return resultsStartup.results.length === 0 ? null : (
    <>
      <thead>
        <tr>
          <td className="description">
            <h3>Startup metrics (lighthouse with mobile simulation)</h3>
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
        {resultsStartup.results.map((resultsForBenchmark, benchIdx) => (
          <ValueResultRow
            key={resultsStartup.benchmarks[benchIdx]?.id}
            benchIdx={benchIdx}
            resultsForBenchmark={resultsForBenchmark}
            benchmarks={resultsStartup.benchmarks}
            currentSortKey={currentSortKey}
            sortBy={sortBy}
          />
        ))}
        <GeomMeanRow
          weighted={false}
          currentSortKey={currentSortKey}
          sortBy={sortBy}
          geomMean={resultsStartup.geomMean}
          sortbyGeommeanEnum={SORT_BY_GEOMMEAN_STARTUP}
        />
      </tbody>
    </>
  );
};

export default StartupResultsTable;
