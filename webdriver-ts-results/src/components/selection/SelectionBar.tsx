import React from "react";
import BenchmarkSelector from "./BenchmarkSelector";
import FrameworkSelector from "./FrameworkSelector";
import ModeSelecionPanel from "./ModeSelectionPanel";
import CopyPasteSelection from "./CopyPasteSelection";

interface Props {
  showDurationSelection: boolean;
}

export const SelectionBar = ({ showDurationSelection }: Props) => {
  console.log("SelectionBar");

  return (
    <div className="select-bar">
      <div className="select-bar__dropdowns">
        <FrameworkSelector />
        <BenchmarkSelector />
      </div>
      <ModeSelecionPanel showDurationSelection={showDurationSelection} />
      <CopyPasteSelection />
    </div>
  );
};
