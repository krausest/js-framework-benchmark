import React from "react";
import {
  SORT_BY_NAME,
  SORT_BY_GEOMMEAN_CPU,
  SORT_BY_GEOMMEAN_MEM,
  SORT_BY_GEOMMEAN_SIZE,
  BenchmarkType,
} from "@/Common";
import type { ResultTableData, T_SORT_BY_GEOMMEAN, TableResultGeommeanEntry } from "@/Common";

interface Props {
  data: ResultTableData;
  currentSortKey: string;
  sortBy: (name: string) => void;
}

// The geometric mean rows of the full table, one column each. They are not combined in one score.
const COLUMNS: Array<{ type: BenchmarkType; sortKey: T_SORT_BY_GEOMMEAN; label: string; mean: string }> = [
  { type: BenchmarkType.CPU, sortKey: SORT_BY_GEOMMEAN_CPU, label: "Duration", mean: "weighted geometric mean" },
  { type: BenchmarkType.MEM, sortKey: SORT_BY_GEOMMEAN_MEM, label: "Memory", mean: "geometric mean" },
  { type: BenchmarkType.SIZE, sortKey: SORT_BY_GEOMMEAN_SIZE, label: "Size and first paint", mean: "geometric mean" },
];

const SummaryTable = ({ data, currentSortKey, sortBy }: Props) => {
  const columns = COLUMNS.filter((column) => data.getResult(column.type).benchmarks.length > 0);
  const comparison = data.getResult(BenchmarkType.CPU).comparison;

  const handleSort = (sortKey: string) => (event: React.SyntheticEvent) => {
    event.preventDefault();
    sortBy(sortKey);
  };

  const renderMean = (result: TableResultGeommeanEntry | null, key: number) =>
    result == null || Number.isNaN(result.mean) ? (
      <td key={key}></td>
    ) : (
      <td key={key} style={{ backgroundColor: result.bgColor, color: result.textColor }}>
        {result.mean.toFixed(2)}
      </td>
    );

  return (
    <table className="summary__table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">
            <button
              className={`button button__text ${currentSortKey === SORT_BY_NAME ? "sort-key" : ""}`}
              onClick={handleSort(SORT_BY_NAME)}
            >
              Implementation
            </button>
          </th>
          {columns.map((column) => (
            <th scope="col" key={column.sortKey}>
              <button
                className={`button button__text ${currentSortKey === column.sortKey ? "sort-key" : ""}`}
                onClick={handleSort(column.sortKey)}
              >
                {column.label}
              </button>
              <div className="summary__mean">{column.mean}</div>
            </th>
          ))}
          {data.compareWith && <th scope="col">compared with {data.compareWith.displayname}</th>}
        </tr>
      </thead>
      <tbody>
        {data.frameworks.map((f, idx) => (
          <tr key={f.name}>
            <td className="summary__rank">{idx + 1}</td>
            <th scope="row">
              {f.frameworkHomeURL ? (
                <a target="_blank" rel="noreferrer" href={f.frameworkHomeURL}>
                  {f.displayname}
                </a>
              ) : (
                f.displayname
              )}
              {f.issues?.map((i) => (
                <a key={i} className="summary__issue" href={"#" + i.toFixed()}>
                  {i.toFixed()}
                </a>
              ))}
            </th>
            {columns.map((column) => renderMean(data.getResult(column.type).geomMean[idx], column.type))}
            {data.compareWith && <td>{comparison[idx]?.label}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SummaryTable;
