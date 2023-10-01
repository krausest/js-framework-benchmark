import React from "react";
import { BenchmarkType } from "../../../Common";
import { useRootStore } from "../../../reducer";
import DropDownContents from "../../DropDown/DropDownContents";
import BenchmarkSelectorList from "./BenchmarkSelectorList";

interface Props {
  label: string;
  benchmarkType: BenchmarkType;
}

const BenchmarkSelectorCategory = ({ label, benchmarkType }: Props) => {
  console.log("BenchmarkSelectorCategory");

  const benchmarks = useRootStore(
    (state) => state.benchmarkLists[benchmarkType],
  );
  const selectedBenchmarks = useRootStore((state) => state.selectedBenchmarks);
  const isNoneSelected = useRootStore((state) => state.isNoneBenchmarkSelected);
  const areAllSelected = useRootStore(
    (state) => state.areAllBenchmarksSelected,
  );
  const selectAllBenchmarks = useRootStore(
    (state) => state.selectAllBenchmarks,
  );
  const selectBenchmark = useRootStore((state) => state.selectBenchmark);

  return (
    <DropDownContents
      isNoneSelected={isNoneSelected(benchmarkType)}
      areAllSelected={areAllSelected(benchmarkType)}
      selectNone={() => selectAllBenchmarks(benchmarkType, false)}
      selectAll={() => selectAllBenchmarks(benchmarkType, true)}
    >
      <h3>{label}</h3>
      <BenchmarkSelectorList
        isSelected={(benchmark) => selectedBenchmarks.has(benchmark)}
        select={(benchmark, add) => selectBenchmark(benchmark, add)}
        benchmarks={benchmarks}
      />
    </DropDownContents>
  );
};

export default BenchmarkSelectorCategory;
