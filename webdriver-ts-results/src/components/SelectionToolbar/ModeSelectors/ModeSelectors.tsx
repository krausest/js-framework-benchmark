import { useRootStore } from "@/store";
import DisplayModeSelector from "./DisplayModeSelector";
import DurationModeSelector from "./DurationModeSelector";
import "./ModeSelectors.css";

interface Props {
  showDurationSelection: boolean;
}

const ModeSelectors = ({ showDurationSelection }: Props) => {
  console.log("ModeSelectors");

  const displayMode = useRootStore((state) => state.displayMode);
  const cpuDurationMode = useRootStore((state) => state.cpuDurationMode);
  const selectDisplayMode = useRootStore((state) => state.selectDisplayMode);
  const selectCpuDurationMode = useRootStore((state) => state.selectCpuDurationMode);

  return (
    <>
      <div className="mode-selection-panel">
        <DisplayModeSelector displayMode={displayMode} onChange={(value) => selectDisplayMode(value)} />
      </div>
      {showDurationSelection ? (
        <DurationModeSelector cpuDurationMode={cpuDurationMode} onChange={(value) => selectCpuDurationMode(value)} />
      ) : null}
    </>
  );
};

export default ModeSelectors;
