import React from "react";
import { Framework } from "../../../Common";

interface Props {
  frameworks: Array<Framework>;
  isSelected: (benchmark: Framework) => boolean;
  select: (benchmark: Framework, add: boolean) => void;
}

const FrameworkSelectorList = ({ frameworks, isSelected, select }: Props) => {
  console.log("SelectBarFrameworks");

  return (
    <>
      {frameworks.map((item) => (
        <div key={item.name}>
          <input
            className="form-check-input"
            id={`inp-${item.name}-${item.type}`}
            type="checkbox"
            onChange={(evt) => select(item, evt.target.checked)}
            checked={isSelected(item)}
          />
          <label
            htmlFor={`inp-${item.name}-${item.type}`}
            className="form-check-label"
          >
            {item.displayname}
          </label>
        </div>
      ))}
    </>
  );
};

export default FrameworkSelectorList;
