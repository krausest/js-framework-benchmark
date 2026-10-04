import BenchmarkSelector from "./BenchmarkSelector";
import FrameworkSelector from "./FrameworkSelector";
import IssueSelector from "./IssueSelector";
import ModeSelectors from "./ModeSelectors";
import CopyPasteControls from "./CopyPasteControls";

interface Props {
  showDurationSelection: boolean;
}

const SelectionToolbar = ({ showDurationSelection }: Props) => {
  console.log("SelectionToolbar");

  return (
    <section className="toolbar" aria-label="Benchmark controls">
      <div className="toolbar__filters">
        <p className="toolbar-label">Filter results</p>
        <div className="toolbar__actions">
          <FrameworkSelector />
          <BenchmarkSelector />
          <IssueSelector />
        </div>
      </div>
      <CopyPasteControls />
      <div className="toolbar__modes">
        <ModeSelectors showDurationSelection={showDurationSelection} />
      </div>
    </section>
  );
};

export default SelectionToolbar;
