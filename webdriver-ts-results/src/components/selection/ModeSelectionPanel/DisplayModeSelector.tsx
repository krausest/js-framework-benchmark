import { DisplayMode } from "@/Common";
import { Select } from "antd";

interface Props {
  displayMode: DisplayMode;
  onChange: (value: DisplayMode) => void;
}

const DisplayModeSelector = ({ displayMode, onChange }: Props) => {
  return (
    <div className="mode-selector">
      <label className="mode-selector__label" htmlFor="displayMode">
        Display mode:
      </label>
      <Select
        id="displayMode"
        defaultValue={displayMode}
        options={[
          { value: DisplayMode.DisplayMean, label: "mean results" },
          { value: DisplayMode.DisplayMedian, label: "median results" },
          { value: DisplayMode.BoxPlot, label: "box plot" },
        ]}
        aria-label="Select display mode"
        onChange={(value) => onChange(value as DisplayMode)}
      />
    </div>
  );
};

export default DisplayModeSelector;
