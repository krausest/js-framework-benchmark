import React from "react";
import DropDownContents from "../../DropDown/DropDownContents";
import { FrameworkType } from "../../../Common";
import { useRootStore } from "../../../reducer";
import FrameworkSelectorList from "./FrameworkSelectorList";

interface Props {
  label: string;
  frameworkType: FrameworkType;
}

const FrameworkSelectorCategory = ({ label, frameworkType }: Props) => {
  console.log("FrameworkSelectorCategory");

  const selectedFrameworks = useRootStore(
    (state) => state.selectedFrameworksDropDown,
  );
  const frameworks = useRootStore(
    (state) => state.frameworkLists[frameworkType],
  );
  const isNoneSelected = useRootStore((state) => state.isNoneFrameworkSelected);
  const areAllSelected = useRootStore(
    (state) => state.areAllFrameworksSelected,
  );

  const selectFramework = useRootStore((state) => state.selectFramework);
  const selectAllFrameworks = useRootStore(
    (state) => state.selectAllFrameworks,
  );

  return (
    <DropDownContents
      grid
      isNoneSelected={isNoneSelected(frameworkType)}
      areAllSelected={areAllSelected(frameworkType)}
      selectNone={() => selectAllFrameworks(frameworkType, false)}
      selectAll={() => selectAllFrameworks(frameworkType, true)}
    >
      <h3>{label}</h3>
      <FrameworkSelectorList
        isSelected={(framework) => selectedFrameworks.has(framework)}
        select={(framework, add) => selectFramework(framework, add)}
        frameworks={frameworks}
      />
    </DropDownContents>
  );
};

export default FrameworkSelectorCategory;
