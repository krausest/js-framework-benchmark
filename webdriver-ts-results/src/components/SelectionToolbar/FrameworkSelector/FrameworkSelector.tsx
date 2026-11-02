import { FrameworkType } from "@/Common";
import { useRootStore } from "@/store";
import FrameworkSelectorCategory from "./FrameworkSelectorCategory";
import SelectorDialog from "../SelectorDialog";

const FrameworkSelector = () => {
  console.log("FrameworkSelector");

  const hasNonKeyedFrameworks = useRootStore((state) => state.frameworkLists[FrameworkType.NON_KEYED].length > 0);

  return (
    <SelectorDialog buttonLabel="Frameworks" title="Frameworks selector" wide>
      <FrameworkSelectorCategory frameworkType={FrameworkType.KEYED} label="Keyed frameworks" />
      {hasNonKeyedFrameworks && (
        <FrameworkSelectorCategory frameworkType={FrameworkType.NON_KEYED} label="Non-keyed frameworks" />
      )}
    </SelectorDialog>
  );
};

export default FrameworkSelector;
