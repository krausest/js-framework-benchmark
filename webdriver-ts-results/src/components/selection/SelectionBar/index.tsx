import BenchmarkSelector from "../BenchmarkSelector";
import FrameworkSelector from "../FrameworkSelector";
import ModeSelecionPanel from "../ModeSelectionPanel";
import CopyPasteSelection from "../CopyPasteSelection";
import "./SelectionBar.css";

interface Props {
  showDurationSelection: boolean;
}

const SelectionBar = ({ showDurationSelection }: Props) => {
  console.log("SelectionBar");

  return (
    <div className="select-bar">
      <div className="select-bar__actions">
        <FrameworkSelector />
        <BenchmarkSelector />
      </div>
      <CopyPasteSelection />
      <div className="select-bar__actions">
        <ModeSelecionPanel showDurationSelection={showDurationSelection} />
      </div>
    </div>
  );
};

export default SelectionBar;
