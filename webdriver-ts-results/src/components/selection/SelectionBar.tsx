import React from "react";
import BenchmarkSelector from "./BenchmarkSelector";
import FrameworkSelector from "./FrameworkSelector";
import ModeSelector from "./ModeSelector";
import CopyPasteSelection from "./CopyPasteSelection";

interface Props {
  showDurationSelection: boolean;
}

export const SelectionBar = ({ showDurationSelection }: Props) => {
  console.log("SelectionBar");

  return (
    <div className="select-bar">
      <div className="header-row">
        <FrameworkSelector />
        <BenchmarkSelector />
        <ModeSelector showDurationSelection={showDurationSelection} />
        <CopyPasteSelection />
      </div>
    </div>
  );
};
