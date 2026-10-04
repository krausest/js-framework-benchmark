import IssueSelectorList from "./IssueSelectorList";
import SelectorDialog from "../SelectorDialog";

const IssueSelector = () => {
  console.log("IssueSelector");

  return (
    <SelectorDialog buttonLabel="Issues" title="Issues selector">
      <IssueSelectorList />
    </SelectorDialog>
  );
};

export default IssueSelector;
