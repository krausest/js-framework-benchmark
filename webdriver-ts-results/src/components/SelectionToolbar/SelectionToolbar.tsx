import BenchmarkSelector from "./BenchmarkSelector";
import FrameworkSelector from "./FrameworkSelector";
import ModeSelectors from "./ModeSelectors";
import CopyPasteControls from "./CopyPasteControls";
import "./SelectionToolbar.css";

interface Props {
  showDurationSelection: boolean;
}

const SelectionToolbar = ({ showDurationSelection }: Props) => {
  console.log("SelectionToolbar");

  return (
    <div className="select-toolbar">
      <div className="select-toolbar__actions">
        <FrameworkSelector />
        <BenchmarkSelector />
      </div>
      <CopyPasteControls />
      <div className="select-toolbar__actions">
        <ModeSelectors showDurationSelection={showDurationSelection} />
      </div>
    </div>
  );
};

export default SelectionToolbar;
