import { Framework } from "@/Common";
import { Checkbox, Flex } from "antd";

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
        <Flex key={item.name} align="center">
          <Checkbox key={item.name} onChange={(evt) => select(item, evt.target.checked)} checked={isSelected(item)}>
            {item.displayname}
          </Checkbox>
        </Flex>
      ))}
    </>
  );
};

export default FrameworkSelectorList;
