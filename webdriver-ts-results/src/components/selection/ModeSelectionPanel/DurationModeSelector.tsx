import { CpuDurationMode } from "@/Common";

interface Props {
  cpuDurationMode: CpuDurationMode;
  onChange: (value: CpuDurationMode) => void;
}

const DurationModeSelector = ({ cpuDurationMode, onChange }: Props) => {
  return (
    <div className="mode-selector">
      <label htmlFor="durationMode">
        Duration measurement mode:
      </label>
      <select
        id="durationMode"
        className="mode-selector__select"
        value={cpuDurationMode}
        aria-label="Select CPU duration mode"
        onChange={(evt) => onChange(evt.target.value as CpuDurationMode)}
      >
        <option value={CpuDurationMode.Total}>total duration</option>
        <option value={CpuDurationMode.Script}>only JS duration</option>
        <option value={CpuDurationMode.Render}>only render duration</option>
      </select>
    </div>
  );
};

export default DurationModeSelector;
