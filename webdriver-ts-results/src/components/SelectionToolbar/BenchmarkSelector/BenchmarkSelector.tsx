import { BenchmarkType } from "@/Common";
import BenchmarkSelectorCategory from "./BenchmarkSelectorCategory";
import SelectorDialog from "../SelectorDialog";

const BenchmarkSelector = () => {
  console.log("BenchmarkSelector");

  return (
    <SelectorDialog buttonLabel="Benchmarks" title="Benchmarks selector">
      <BenchmarkSelectorCategory benchmarkType={BenchmarkType.CPU} label="Duration" />
      <BenchmarkSelectorCategory benchmarkType={BenchmarkType.SIZE} label="Transferred size" />
      <BenchmarkSelectorCategory benchmarkType={BenchmarkType.MEM} label="Memory" />
    </SelectorDialog>
  );
};

export default BenchmarkSelector;
