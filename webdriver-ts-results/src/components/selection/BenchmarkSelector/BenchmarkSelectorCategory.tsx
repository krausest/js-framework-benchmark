import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BenchmarkType } from "../../../Common";
import {
  areAllBenchmarksSelected,
  isNoneBenchmarkSelected,
  selectBenchmark,
  selectAllBenchmarks,
  State,
} from "../../../reducer";
import DropDownContents from "../../DropDown/DropDownContents";
import BenchmarkSelectorList from "./BenchmarkSelectorList";

interface Props {
  label: string;
  benchmarkType: BenchmarkType;
}

const BenchmarkSelectorCategory = ({ label, benchmarkType }: Props) => {
  console.log("BenchmarkSelectorCategory");

  const dispatch = useDispatch();

  const benchmarks = useSelector(
    (state: State) => state.benchmarkLists[benchmarkType],
  );
  const selectedBenchmarks = useSelector(
    (state: State) => state.selectedBenchmarks,
  );
  const isNoneSelected = useSelector((state: State) =>
    isNoneBenchmarkSelected(state, benchmarkType),
  );
  const areAllSelected = useSelector((state: State) =>
    areAllBenchmarksSelected(state, benchmarkType),
  );

  return (
    <DropDownContents
      isNoneSelected={isNoneSelected}
      areAllSelected={areAllSelected}
      selectNone={() => dispatch(selectAllBenchmarks(benchmarkType, false))}
      selectAll={() => dispatch(selectAllBenchmarks(benchmarkType, true))}
    >
      <h3>{label}</h3>
      <BenchmarkSelectorList
        isSelected={(benchmark) => selectedBenchmarks.has(benchmark)}
        select={(benchmark, add) => dispatch(selectBenchmark(benchmark, add))}
        benchmarks={benchmarks}
      />
    </DropDownContents>
  );
};

export default BenchmarkSelectorCategory;
