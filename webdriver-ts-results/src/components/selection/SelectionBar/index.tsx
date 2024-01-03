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
      <div className="select-bar__dropdowns">
        <FrameworkSelector />
        <BenchmarkSelector />
        <CopyPasteSelection />
      </div>
      <div className="select-bar__dropdowns">
        <ModeSelecionPanel showDurationSelection={showDurationSelection} />
      </div>
    </div>
  );
};

export default SelectionBar;
