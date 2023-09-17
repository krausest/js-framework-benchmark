import React from "react";

interface Props {
  children: Array<JSX.Element>;
  selectNone: (event: React.SyntheticEvent) => void;
  selectAll: (event: React.SyntheticEvent) => void;
  isNoneSelected: boolean;
  areAllSelected: boolean;
  grid?: boolean;
}

const DropDownContents = ({
  selectAll,
  selectNone,
  isNoneSelected,
  areAllSelected,
  children,
  grid = false,
}: Props) => {
  const handleSelectNone = (event: React.MouseEvent) => {
    !isNoneSelected && selectNone(event);
  };

  const handleSelectAll = (event: React.MouseEvent) => {
    !areAllSelected && selectAll(event);
  };

  return (
    <div className="section">
      {children[0]}
      <div className="float-rt">
        <button
          className="textButton"
          onClick={handleSelectNone}
          disabled={isNoneSelected}
          aria-label="Select none"
        >
          None
        </button>
        &nbsp;
        <button
          className="textButton"
          onClick={handleSelectAll}
          disabled={areAllSelected}
          aria-label="Select all"
        >
          All
        </button>
      </div>
      <div className={grid ? "grid" : ""}>{children[1]}</div>
    </div>
  );
};

export default DropDownContents;
