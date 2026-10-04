import type { Framework } from "@/Common";

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
        <label key={item.name} className="checkbox">
          <input type="checkbox" onChange={(evt) => select(item, evt.target.checked)} checked={isSelected(item)} />
          <span>{item.displayname}</span>
        </label>
      ))}
    </>
  );
};

export default FrameworkSelectorList;
