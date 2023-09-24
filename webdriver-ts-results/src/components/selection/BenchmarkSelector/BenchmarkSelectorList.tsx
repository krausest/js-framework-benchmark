import React from "react";
import type { Benchmark } from "../../../Common";

interface Props {
  benchmarks: Array<Benchmark>;
  isSelected: (benchmark: Benchmark) => boolean;
  select: (benchmark: Benchmark, add: boolean) => void;
}

const BenchmarkSelectorList = ({ benchmarks, isSelected, select }: Props) => {
  console.log("BenchmarkSelectorList");

  return (
    <>
      {benchmarks.map((item) => (
        <div key={item.id} className="col-md-12">
          <div className="form-check">
            <input
              id={`inp-${item.id}`}
              className="form-check-input"
              type="checkbox"
              onChange={(evt) => select(item, evt.target.checked)}
              checked={isSelected(item)}
            />
            <label htmlFor={`inp-${item.id}`} className="form-check-label">
              {item.label}
            </label>
          </div>
        </div>
      ))}
    </>
  );
};

export default BenchmarkSelectorList;
