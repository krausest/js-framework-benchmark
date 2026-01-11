import { Benchmark, Framework, ResultLookup, CpuDurationMode } from "@/Common";
import BoxPlotTableRow from "./BoxPlotTableRow";

interface Props {
  frameworks: Array<Framework>;
  benchmarks: Array<Benchmark>;
  results: ResultLookup;
  currentSortKey: string;
  sortBy: (name: string) => void;
  cpuDurationMode: CpuDurationMode;
}

const BoxPlotTableRows = ({ frameworks, benchmarks, results, currentSortKey, sortBy, cpuDurationMode }: Props) => {
  return (
    <>
      {benchmarks.map((benchmark) => (
        <BoxPlotTableRow
          key={benchmark.id}
          frameworks={frameworks}
          benchmark={benchmark}
          results={results}
          currentSortKey={currentSortKey}
          sortBy={sortBy}
          cpuDurationMode={cpuDurationMode}
        />
      ))}
    </>
  );
};

export default BoxPlotTableRows;
