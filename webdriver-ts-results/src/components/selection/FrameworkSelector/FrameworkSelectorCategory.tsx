import React from "react";
import DropDownContents from "../../DropDown/DropDownContents";
import { useDispatch, useSelector } from "react-redux";
import { FrameworkType } from "../../../Common";
import {
  State,
  isNoneFrameworkSelected,
  areAllFrameworksSelected,
  selectAllFrameworks,
  selectFramework,
} from "../../../reducer";
import FrameworkSelectorList from "./FrameworkSelectorList";

interface Props {
  label: string;
  frameworkType: FrameworkType;
}

const FrameworkSelectorCategory = ({ label, frameworkType }: Props) => {
  console.log("FrameworkSelectorCategory");

  const dispatch = useDispatch();

  const selectedFrameworks = useSelector(
    (state: State) => state.selectedFrameworksDropDown,
  );
  const isNoneSelected = useSelector((state: State) =>
    isNoneFrameworkSelected(state, frameworkType),
  );
  const areAllSelected = useSelector((state: State) =>
    areAllFrameworksSelected(state, frameworkType),
  );

  const frameworks = useSelector(
    (state: State) => state.frameworkLists[frameworkType],
  );

  return (
    <DropDownContents
      grid
      isNoneSelected={isNoneSelected}
      areAllSelected={areAllSelected}
      selectNone={() => dispatch(selectAllFrameworks(frameworkType, false))}
      selectAll={() => dispatch(selectAllFrameworks(frameworkType, true))}
    >
      <h3>{label}</h3>
      <FrameworkSelectorList
        isSelected={(framework) => selectedFrameworks.has(framework)}
        select={(framework, add) => dispatch(selectFramework(framework, add))}
        frameworks={frameworks}
      />
    </DropDownContents>
  );
};

export default FrameworkSelectorCategory;
