import type { Benchmark } from "@/Common";
import { Checkbox } from "antd";

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
        <Checkbox key={item.id} onChange={(evt) => select(item, evt.target.checked)} checked={isSelected(item)}>
          {item.label}
        </Checkbox>
      ))}
    </>
  );
};

export default BenchmarkSelectorList;
