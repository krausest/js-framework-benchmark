import React from "react";
import { BenchmarkType } from "../../../Common";
import DropDown from "../../DropDown";
import BenchmarkSelectorCategory from "./BenchmarkSelectorCategory";

const BenchmarkSelector = () => {
  console.log("BenchmarkSelector");

  return (
    <DropDown label="Which benchmarks?" width="300px">
      <BenchmarkSelectorCategory
        benchmarkType={BenchmarkType.CPU}
        label="Duration"
      />
      <BenchmarkSelectorCategory
        benchmarkType={BenchmarkType.STARTUP}
        label="Startup"
      />
      <BenchmarkSelectorCategory
        benchmarkType={BenchmarkType.MEM}
        label="Memory"
      />
    </DropDown>
  );
};

export default BenchmarkSelector;
