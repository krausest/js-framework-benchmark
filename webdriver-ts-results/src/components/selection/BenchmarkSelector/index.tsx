import React from "react";
import { BenchmarkType } from "../../../Common";
import Dropdown from "../../ui/Dropdown";
import BenchmarkSelectorCategory from "./BenchmarkSelectorCategory";

const BenchmarkSelector = () => {
  console.log("BenchmarkSelector");

  return (
    <Dropdown label="Which benchmarks?" width="300px">
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
    </Dropdown>
  );
};

export default BenchmarkSelector;
