import SelectorContentContainer from "@/components/SelectionToolbar/SelectorContentContainer";
import { FrameworkType } from "@/Common";
import { useRootStore } from "@/store";
import FrameworkSelectorList from "./FrameworkSelectorList";

interface Props {
  label: string;
  frameworkType: FrameworkType;
}

const FrameworkSelectorCategory = ({ label, frameworkType }: Props) => {
  console.log("FrameworkSelectorCategory");

  const selectedFrameworks = useRootStore((state) => state.selectedFrameworks);
  const frameworks = useRootStore((state) => state.frameworkLists[frameworkType]);
  const isNoneSelected = useRootStore((state) => state.isNoneFrameworkSelected);
  const isUnflaggedSelected = useRootStore((state) => state.isUnflaggedFrameworkSelected);
  const areAllSelected = useRootStore((state) => state.areAllFrameworksSelected);

  const selectFramework = useRootStore((state) => state.selectFramework);
  const selectAllFrameworks = useRootStore((state) => state.selectAllFrameworks);
  const selectUnflaggedFrameworks = useRootStore((state) => state.selectUnflaggedFrameworks);

  return (
    <SelectorContentContainer
      grid
      isNoneSelected={isNoneSelected(frameworkType)}
      isUnflaggedSelected={isUnflaggedSelected(frameworkType)}
      areAllSelected={areAllSelected(frameworkType)}
      selectNone={() => selectAllFrameworks(frameworkType, false)}
      selectAll={() => selectAllFrameworks(frameworkType, true)}
      selectUnflagged={() => selectUnflaggedFrameworks(frameworkType)}
      label={label}
    >
      <FrameworkSelectorList
        isSelected={(framework) => selectedFrameworks.has(framework)}
        select={(framework, add) => selectFramework(framework, add)}
        frameworks={frameworks}
      />
    </SelectorContentContainer>
  );
};

export default FrameworkSelectorCategory;
