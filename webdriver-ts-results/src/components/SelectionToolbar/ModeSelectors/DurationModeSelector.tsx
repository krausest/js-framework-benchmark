import { CpuDurationMode } from "@/Common";

interface Props {
  cpuDurationMode: CpuDurationMode;
  onChange: (value: CpuDurationMode) => void;
}

const DurationModeSelector = ({ cpuDurationMode, onChange }: Props) => {
  return (
    <div className="mode-selector">
      <label htmlFor="durationMode" className="toolbar-label">
        CPU duration
      </label>
      <select
        id="durationMode"
        className="select"
        value={cpuDurationMode}
        onChange={(evt) => onChange(evt.target.value as CpuDurationMode)}
      >
        <option value={CpuDurationMode.TOTAL}>total duration</option>
        <option value={CpuDurationMode.SCRIPT}>only JS duration</option>
        <option value={CpuDurationMode.RENDER}>only render duration</option>
      </select>
    </div>
  );
};

export default DurationModeSelector;
