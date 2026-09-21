import BenchmarkSelector from "./BenchmarkSelector";
import FrameworkSelector from "./FrameworkSelector";
import IssueSelector from "./IssueSelector";
import ModeSelectors from "./ModeSelectors";
import CopyPasteControls from "./CopyPasteControls";
import "./SelectionToolbar.css";

interface Props {
  showDurationSelection: boolean;
}

const SelectionToolbar = ({ showDurationSelection }: Props) => {
  console.log("SelectionToolbar");

  return (
    <section className="select-toolbar" aria-label="Benchmark controls">
      <div className="select-toolbar__filters">
        <p className="select-toolbar__label">Filter results</p>
        <div className="select-toolbar__actions">
          <FrameworkSelector />
          <BenchmarkSelector />
          <IssueSelector />
        </div>
      </div>
      <CopyPasteControls />
      <div className="select-toolbar__modes">
        <ModeSelectors showDurationSelection={showDurationSelection} />
      </div>
    </section>
  );
};

export default SelectionToolbar;
