import React from "react";
import { useDispatch } from "react-redux";
import { Framework, TableResultComparisonEntry } from "../../Common";
import { compare, stopCompare } from "../../reducer";

interface Props {
  comparison: Array<TableResultComparisonEntry | null>;
  compareWith: Framework | undefined;
}

const CompareRow = ({ comparison, compareWith }: Props) => {
  const dispatch = useDispatch();

  const renderComparisonCell = (
    result: TableResultComparisonEntry | null,
    idx: number,
  ) => {
    if (!result) {
      return <th key={idx}></th>;
    }

    const { key, bgColor, textColor, label, framework } = result;
    const isComparing = compareWith === framework;

    const handleToggleComparing = () => {
      isComparing
        ? dispatch(stopCompare(framework))
        : dispatch(compare(framework));
    };

    return (
      <th
        key={key}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {label}
        <button
          className="sortKey textButton"
          onClick={handleToggleComparing}
          aria-label={
            isComparing ? "Stop comparing" : "Compare with other frameworks"
          }
        >
          {isComparing ? "stop compare" : "compare"}
        </button>
      </th>
    );
  };

  return (
    <tr>
      <th>
        compare: Green means significantly faster, red significantly slower
      </th>
      {comparison.map((result, idx) => renderComparisonCell(result, idx))}
    </tr>
  );
};

export default CompareRow;
