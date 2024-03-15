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
          { value: DisplayMode.DISPLAY_MEAN, label: "mean results" },
          { value: DisplayMode.DISPLAY_MEDIAN, label: "median results" },
          { value: DisplayMode.BOX_PLOT, label: "box plot" },
        ]}
        aria-label="Select display mode"
        onChange={(value) => onChange(value as DisplayMode)}
      />
    </div>
  );
};

export default DisplayModeSelector;
