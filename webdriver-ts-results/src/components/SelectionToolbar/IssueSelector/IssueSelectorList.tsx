import { knownIssues } from "@/helpers/issues";
import { useRootStore } from "@/store";
import SelectorContentContainer from "@/components/SelectionToolbar/SelectorContentContainer";
import { Checkbox, Flex } from "antd";

const IssueSelectorList = () => {
  console.log("IssueSelectorList");

  const selectedIssues = useRootStore((state) => state.selectedIssues);
  const areAllSelected = useRootStore((state) => state.areAllIssuesSelected);
  const isNoneSelected = useRootStore((state) => state.isNoneIssueSelected);
  const selectIssue = useRootStore((state) => state.selectIssue);
  const selectAllIssues = useRootStore((state) => state.selectAllIssues);

  return (
    <SelectorContentContainer
      isNoneSelected={isNoneSelected()}
      areAllSelected={areAllSelected()}
      selectNone={() => selectAllIssues(false)}
      selectAll={() => selectAllIssues(true)}
      label="Issues"
    >
      <Flex vertical>
        {knownIssues.map((issue) => (
          <Checkbox
            key={issue.number}
            onChange={(evt) => selectIssue(issue.number, evt.target.checked)}
            checked={selectedIssues.has(issue.number)}
          >
            #{issue.number}: {issue.text.replace(/^\[(?:Note|Issue)\]:\s*/, "")}
          </Checkbox>
        ))}
      </Flex>
    </SelectorContentContainer>
  );
};

export default IssueSelectorList;
