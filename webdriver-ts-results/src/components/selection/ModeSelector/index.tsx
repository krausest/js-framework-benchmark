import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCpuDurationMode,
  selectDisplayMode,
  State,
} from "../../../reducer";
import DisplayModeSelector from "./DisplayModeSelector";
import DurationModeSelector from "./DurationModeSelector";

interface Props {
  showDurationSelection: boolean;
}

const ModeSelector = ({ showDurationSelection }: Props) => {
  console.log("ModeSelector");

  const dispatch = useDispatch();

  const displayMode = useSelector((state: State) => state.displayMode);
  const cpuDurationMode = useSelector((state: State) => state.cpuDurationMode);

  return (
    <>
      <DisplayModeSelector
        displayMode={displayMode}
        onChange={(value) => dispatch(selectDisplayMode(value))}
      />

      {showDurationSelection && (
        <DurationModeSelector
          cpuDurationMode={cpuDurationMode}
          onChange={(value) => dispatch(selectCpuDurationMode(value))}
        />
      )}
    </>
  );
};

export default ModeSelector;
