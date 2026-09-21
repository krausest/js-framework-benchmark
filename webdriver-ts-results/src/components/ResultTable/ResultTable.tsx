import React from "react";
import { DisplayMode, BenchmarkType, FrameworkType, CpuDurationMode } from "../../Common";
import CpuResultsTable from "@/components/tables/CpuResultsTable";
import MemResultsTable from "@/components/tables/MemResultsTable";
// import StartupResultsTable from "./tables/StartupResultsTable";
import { benchmarks } from "@/results";
import { useRootStore } from "@/store";
import SizeResultsTable from "@/components/tables/SizeResultsTable";

const BoxPlotTable = React.lazy(() => import("@/components/BoxPlotTable/BoxPlotTable"));

interface Props {
  type: FrameworkType;
}

const ResultTable = ({ type }: Props) => {
  const texts = {
    [FrameworkType.KEYED]: {
      label: "Keyed results",
      description:
        "Each data item keeps its own DOM element through a stable key. Inserting or removing an item creates or removes its corresponding element.",
    },
    [FrameworkType.NON_KEYED]: {
      label: "Non-keyed results",
      description:
        "DOM elements may be reused for different data items. This can reduce work, but may affect state changed outside the framework. Compare these implementations separately from keyed results.",
    },
  };

  const data = useRootStore((state) => state.resultTables[type]);
  const currentSortKey = useRootStore((state) => state.sortKey);
  const displayMode = useRootStore((state) => state.displayMode);
  const cpuDurationMode = useRootStore((state) => state.cpuDurationMode);
  const sort = useRootStore((state) => state.sort);

  const sortBy = (sortKey: string) => sort(sortKey);
  const headingId = `results-${type}`;
  const hintId = `${headingId}-hint`;

  if (
    !data ||
    data.frameworks.length === 0 ||
    (data.getResult(BenchmarkType.CPU).benchmarks.length === 0 &&
      data.getResult(BenchmarkType.SIZE).benchmarks.length === 0 &&
      data.getResult(BenchmarkType.MEM).benchmarks.length === 0)
  ) {
    return null;
  }

  return (
    <section className="result-group" aria-labelledby={headingId}>
      <div key={texts[type].label}>
        <div className="result-group__heading">
          <h2 id={headingId}>{texts[type].label}</h2>
          <span className="implementation-count">{data.frameworks.length} implementations</span>
        </div>
        <p className="result-group__description">{texts[type].description}</p>
        <p className="result-group__hint" id={hintId}>
          <span>Click a benchmark name to sort. Scroll horizontally to explore all implementations.</span>
          <span>Lower values are better. Compare measurements within the same release.</span>
        </p>

        {cpuDurationMode === CpuDurationMode.SCRIPT && (
          <p className="experimental-notice">
            Warning: This is an experimental view that includes script duration only. Don&apos;t rely on those values
            yet and don&apos;t report them until they are official. Report bugs in issue{" "}
            <a href="https://github.com/krausest/js-framework-benchmark/issues/1233">1233</a>.
          </p>
        )}
        {cpuDurationMode === CpuDurationMode.RENDER && (
          <p className="experimental-notice">
            Warning: This is an experimental view that shows the difference between total duration and script duration.
            Don&apos;t rely on those values yet and don&apos;t report them until they are official. Report bugs in issue{" "}
            <a href="https://github.com/krausest/js-framework-benchmark/issues/1233">1233</a>.
          </p>
        )}
        {displayMode === DisplayMode.BOX_PLOT ? (
          benchmarks.length > 0 && (
            <React.Suspense fallback={<div>Loading...</div>}>
              <BoxPlotTable
                label={texts[type].label}
                results={data.results}
                frameworks={data.frameworks}
                benchmarks={data.getResult(BenchmarkType.CPU).benchmarks}
                currentSortKey={currentSortKey}
                sortBy={sortBy}
                cpuDurationMode={cpuDurationMode}
              />
            </React.Suspense>
          )
        ) : (
          <div className="results">
            <div
              className="results__table-container"
              role="region"
              aria-label={`${texts[type].label} table`}
              aria-describedby={hintId}
              tabIndex={0}
            >
              <table
                className="results__table"
                aria-labelledby={headingId}
                style={{ width: `calc(var(--label-width) + ${data.frameworks.length * 84}px)` }}
              >
                <colgroup>
                  <col className="bench-column" />
                  <col className="framework-column" span={data.frameworks.length} />
                </colgroup>
                <CpuResultsTable currentSortKey={currentSortKey} sortBy={sortBy} data={data} />
                <MemResultsTable currentSortKey={currentSortKey} sortBy={sortBy} data={data} />
                <SizeResultsTable currentSortKey={currentSortKey} sortBy={sortBy} data={data} />
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultTable;
