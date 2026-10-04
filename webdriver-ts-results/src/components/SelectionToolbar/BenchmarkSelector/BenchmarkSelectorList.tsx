import type { Benchmark } from "@/Common";

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
        <label key={item.id} className="checkbox">
          <input type="checkbox" onChange={(evt) => select(item, evt.target.checked)} checked={isSelected(item)} />
          <span>{item.label}</span>
        </label>
      ))}
    </>
  );
};

export default BenchmarkSelectorList;
