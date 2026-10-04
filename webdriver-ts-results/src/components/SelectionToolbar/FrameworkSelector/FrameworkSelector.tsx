import { FrameworkType } from "@/Common";
import FrameworkSelectorCategory from "./FrameworkSelectorCategory";
import SelectorDialog from "../SelectorDialog";

const FrameworkSelector = () => {
  console.log("FrameworkSelector");

  return (
    <SelectorDialog buttonLabel="Frameworks" title="Frameworks selector" wide>
      <FrameworkSelectorCategory frameworkType={FrameworkType.KEYED} label="Keyed frameworks" />
      <FrameworkSelectorCategory frameworkType={FrameworkType.NON_KEYED} label="Non-keyed frameworks" />
    </SelectorDialog>
  );
};

export default FrameworkSelector;
