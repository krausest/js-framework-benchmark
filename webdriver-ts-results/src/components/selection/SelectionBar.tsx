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
    <div className="selectBar">
      <div className="header-row">
        <FrameworkSelector />
        <div className="hspan" />
        <BenchmarkSelector />
        <div className="hspan" />
        <ModeSelector showDurationSelection={showDurationSelection} />
        <div className="hspan" />
        <CopyPasteSelection />
      </div>
    </div>
  );
};
