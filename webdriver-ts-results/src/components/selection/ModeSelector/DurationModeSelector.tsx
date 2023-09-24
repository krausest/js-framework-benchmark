import React from "react";
import { CpuDurationMode } from "../../../Common";

interface Props {
  cpuDurationMode: CpuDurationMode;
  onChange: (value: CpuDurationMode) => void;
}

const DurationModeSelector = ({ cpuDurationMode, onChange }: Props) => {
  return (
    <>
      <label htmlFor="durationMode">
        (Experimental) Duration measurement mode
      </label>
      <div className="hspan" />
      <select
        id="durationMode"
        className="custom-select"
        value={cpuDurationMode}
        aria-label="Select CPU duration mode"
        onChange={(evt) => onChange(evt.target.value as CpuDurationMode)}
      >
        <option value={CpuDurationMode.Total}>total duration</option>
        <option value={CpuDurationMode.Script}>only JS duration</option>
      </select>
    </>
  );
};

export default DurationModeSelector;
