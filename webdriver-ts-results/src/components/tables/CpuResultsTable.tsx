import React from "react";
import { ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_CPU, BenchmarkType } from "@/Common";
import GeomMeanRow from "./GeomMeanRow";
import CompareRow from "./CompareRow";
import ValueResultRow from "./ValueResultRow";

interface Props {
  data: ResultTableData;
  currentSortKey: string;
  sortBy: (name: string) => void;
}

const CpuResultsTable = ({ data, currentSortKey, sortBy }: Props) => {
  const resultsCPU = data.getResult(BenchmarkType.CPU);

  const handleSortByName = (event: React.MouseEvent) => {
    event.preventDefault();
    sortBy(SORT_BY_NAME);
  };

  return resultsCPU.results.length === 0 ? null : (
    <>
      {/* Dummy row for fixed td width */}
      <thead className="dummy">
        <tr>
          <th></th>
          {data.frameworks.map((_f, idx) => (
            <th key={idx}></th>
          ))}
        </tr>
      </thead>
      <thead>
        <tr>
          <td className="description">
            <h3>Duration in milliseconds ± 95% confidence interval (Slowdown = Duration / Fastest)</h3>
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
            <br />
            Duration for...
          </th>
          {data.frameworks.map((f, idx) => (
            <th key={idx}>
              {f.frameworkHomeURL ? (
                <a target="_blank" rel="noreferrer" href={f.frameworkHomeURL}>
                  {f.displayname}
                </a>
              ) : (
                f.displayname
              )}
            </th>
          ))}
        </tr>
      </thead>
      <thead>
        <tr>
          <th>Implementation notes</th>
          {data.frameworks.map((f) => (
            <th key={f.name}>
              {f.issues &&
                f.issues.map((i) => (
                  <React.Fragment key={i.toFixed()}>
                    <a href={"#" + i.toFixed()}>{i.toFixed()}</a>
                    <span> </span>
                  </React.Fragment>
                ))}
            </th>
          ))}
        </tr>
      </thead>
      <thead>
        <tr>
          <th>Implementation link</th>
          {data.frameworks.map((f) => (
            <th key={f.name}>
              <a
                target="_blank"
                rel="noreferrer"
                href={"https://github.com/krausest/js-framework-benchmark/tree/master/frameworks/" + f.dir}
              >
                code
              </a>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resultsCPU.results.map((resultsForBenchmark, benchIdx) => (
          <ValueResultRow
            key={resultsCPU.benchmarks[benchIdx]?.id}
            benchIdx={benchIdx}
            resultsForBenchmark={resultsForBenchmark}
            benchmarks={resultsCPU.benchmarks}
            currentSortKey={currentSortKey}
            sortBy={sortBy}
          />
        ))}
        <GeomMeanRow
          weighted={true}
          currentSortKey={currentSortKey}
          sortBy={sortBy}
          geomMean={resultsCPU.geomMean}
          sortbyGeommeanEnum={SORT_BY_GEOMMEAN_CPU}
        />
        <CompareRow comparison={resultsCPU.comparison} compareWith={data.compareWith} />
      </tbody>
    </>
  );
};

export default CpuResultsTable;
