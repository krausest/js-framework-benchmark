import { CpuDurationMode } from "@/Common";
import { Select } from "antd";

interface Props {
  cpuDurationMode: CpuDurationMode;
  onChange: (value: CpuDurationMode) => void;
}

const DurationModeSelector = ({ cpuDurationMode, onChange }: Props) => {
  return (
    <div>
      <label htmlFor="durationMode" className="mode-selector__label">
        Duration measurement mode:
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
