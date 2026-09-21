import { CpuDurationMode } from "@/Common";
import { Select } from "antd";

interface Props {
  cpuDurationMode: CpuDurationMode;
  onChange: (value: CpuDurationMode) => void;
}

const DurationModeSelector = ({ cpuDurationMode, onChange }: Props) => {
  return (
    <div className="mode-selector mode-selector--duration">
      <label htmlFor="durationMode" className="mode-selector__label">
        CPU duration
      </label>
      <Select
        id="durationMode"
        value={cpuDurationMode}
        aria-label="Select CPU duration mode"
        options={[
          { value: CpuDurationMode.TOTAL, label: "total duration" },
          { value: CpuDurationMode.SCRIPT, label: "only JS duration" },
          { value: CpuDurationMode.RENDER, label: "only render duration" },
        ]}
        onChange={(value) => onChange(value as CpuDurationMode)}
      />
    </div>
  );
};

export default DurationModeSelector;
