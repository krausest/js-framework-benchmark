import React from "react";
import { useRootStore } from "../../../reducer";
import DisplayModeSelector from "./DisplayModeSelector";
import DurationModeSelector from "./DurationModeSelector";
import "./ModeSelectionPanel.css";

interface Props {
  showDurationSelection: boolean;
}

const ModeSelecionPanel = ({ showDurationSelection }: Props) => {
  console.log("ModeSelector");

  const displayMode = useRootStore((state) => state.displayMode);
  const cpuDurationMode = useRootStore((state) => state.cpuDurationMode);
  const selectDisplayMode = useRootStore((state) => state.selectDisplayMode);
  const selectCpuDurationMode = useRootStore(
    (state) => state.selectCpuDurationMode,
  );

  return (
    <>
      <div className="mode-selection-panel">
        <DisplayModeSelector
          displayMode={displayMode}
          onChange={(value) => selectDisplayMode(value)}
        />

        {showDurationSelection ? (
          <DurationModeSelector
            cpuDurationMode={cpuDurationMode}
            onChange={(value) => selectCpuDurationMode(value)}
          />
        ) : null}
      </div>
    </>
  );
};

export default ModeSelecionPanel;
