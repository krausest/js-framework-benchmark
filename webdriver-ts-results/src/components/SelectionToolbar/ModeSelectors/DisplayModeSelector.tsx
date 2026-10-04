import { DisplayMode } from "@/Common";

interface Props {
  displayMode: DisplayMode;
  onChange: (value: DisplayMode) => void;
}

const DisplayModeSelector = ({ displayMode, onChange }: Props) => {
  return (
    <div className="mode-selector">
      <label className="toolbar-label" htmlFor="displayMode">
        Display mode
      </label>
      <select
        id="displayMode"
        className="select"
        value={displayMode}
        onChange={(evt) => onChange(Number(evt.target.value) as DisplayMode)}
      >
        <option value={DisplayMode.DISPLAY_MEAN}>mean results</option>
        <option value={DisplayMode.DISPLAY_MEDIAN}>median results</option>
        <option value={DisplayMode.BOX_PLOT}>box plot</option>
      </select>
    </div>
  );
};

export default DisplayModeSelector;
