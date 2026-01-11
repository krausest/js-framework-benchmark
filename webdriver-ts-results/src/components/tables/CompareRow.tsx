import { Framework, TableResultComparisonEntry } from "@/Common";
import { useRootStore } from "@/store";

interface Props {
  comparison: Array<TableResultComparisonEntry | null>;
  compareWith: Framework | undefined;
}

const CompareRow = ({ comparison, compareWith }: Props) => {
  const compare = useRootStore((state) => state.compare);
  const stopCompare = useRootStore((state) => state.stopCompare);

  const renderComparisonCell = (result: TableResultComparisonEntry | null, idx: number) => {
    if (!result) {
      return <th key={idx}></th>;
    }

    const { key, bgColor, textColor, label, framework } = result;
    const isComparing = compareWith === framework;

    const handleToggleComparing = () => {
      isComparing ? stopCompare(framework) : compare(framework);
    };

    return (
      <th
        key={key}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {label}
        <button
          className="button button__text sortKey"
          onClick={handleToggleComparing}
          aria-label={isComparing ? "Stop comparing" : "Compare with other frameworks"}
        >
          {isComparing ? "stop compare" : "compare"}
        </button>
      </th>
    );
  };

  return (
    <tr>
      <th>compare: Green means significantly faster, red significantly slower</th>
      {comparison.map((result, idx) => renderComparisonCell(result, idx))}
    </tr>
  );
};

export default CompareRow;
