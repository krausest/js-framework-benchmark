import React from "react";
import { TableResultGeommeanEntry, T_SORT_BY_GEOMMEAN } from "@/Common";

interface Props {
  weighted: boolean;
  geomMean: Array<TableResultGeommeanEntry | null>;
  currentSortKey: string;
  sortBy: (name: string) => void;
  sortbyGeommeanEnum: T_SORT_BY_GEOMMEAN;
}

const GeomMeanRow = ({ weighted, geomMean, currentSortKey, sortBy, sortbyGeommeanEnum }: Props) => {
  const handleSort = (sortValue: string) => (event: React.SyntheticEvent) => {
    event.preventDefault();
    sortBy(sortValue);
  };

  return (
    <tr>
      <th>
        <button
          className={`button button__text ${currentSortKey === sortbyGeommeanEnum ? "sort-key" : ""}`}
          onClick={handleSort(sortbyGeommeanEnum)}
        >
          {weighted ? "weighted " : ""} geometric mean
        </button>
        of all factors in the table
      </th>
      {geomMean.map((result, idx) =>
        result == null ? (
          <th key={idx}></th>
        ) : (
          <th key={result.key} style={{ backgroundColor: result.bgColor, color: result.textColor }}>
            {result.mean.toFixed(2)}
          </th>
        )
      )}
    </tr>
  );
};

export default GeomMeanRow;
