import React from "react";
import { DisplayMode } from "../../../Common";

interface Props {
  displayMode: DisplayMode;
  onChange: (value: DisplayMode) => void;
}

const DisplayModeSelector = ({ displayMode, onChange }: Props) => {
  return (
    <>
      <div className="mode-selector">
        <label htmlFor="displayMode">Display mode:</label>
        <select
          id="displayMode"
          className="mode-selector__select"
          value={displayMode}
          aria-label="Select display mode"
          onChange={(evt) => onChange(Number(evt.target.value) as DisplayMode)}
        >
          <option value={DisplayMode.DisplayMean}>mean results</option>
          <option value={DisplayMode.DisplayMedian}>median results</option>
          <option value={DisplayMode.BoxPlot}>box plot</option>
        </select>
      </div>
    </>
  );
};

export default DisplayModeSelector;
