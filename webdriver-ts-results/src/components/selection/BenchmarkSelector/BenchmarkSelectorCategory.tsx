import React from "react";
import { BenchmarkType } from "../../../Common";
import { useRootStore } from "../../../reducer";
import SelectorContentContainer from "../SelectorContentContainer";
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
    <SelectorContentContainer
      isNoneSelected={isNoneSelected(benchmarkType)}
      areAllSelected={areAllSelected(benchmarkType)}
      selectNone={() => selectAllBenchmarks(benchmarkType, false)}
      selectAll={() => selectAllBenchmarks(benchmarkType, true)}
      label={label}
    >
      <BenchmarkSelectorList
        isSelected={(benchmark) => selectedBenchmarks.has(benchmark)}
        select={(benchmark, add) => selectBenchmark(benchmark, add)}
        benchmarks={benchmarks}
      />
    </SelectorContentContainer>
  );
};

export default BenchmarkSelectorCategory;
