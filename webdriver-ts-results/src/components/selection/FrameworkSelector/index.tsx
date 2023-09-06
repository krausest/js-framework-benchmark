import React from "react";
import { FrameworkType } from "../../../Common";
import DropDown from "../../DropDown";
import FrameworkSelectorCategory from "./FrameworkSelectorCategory";

const FrameworkSelector = () => {
  console.log("FrameworkSelector");

  return (
    <DropDown label="Which frameworks?" width="1024px">
      <FrameworkSelectorCategory
        frameworkType={FrameworkType.KEYED}
        label="Keyed frameworks:"
      ></FrameworkSelectorCategory>
      <FrameworkSelectorCategory
        frameworkType={FrameworkType.NON_KEYED}
        label="Non-keyed frameworks:"
      ></FrameworkSelectorCategory>
    </DropDown>
  );
};

export default FrameworkSelector;
