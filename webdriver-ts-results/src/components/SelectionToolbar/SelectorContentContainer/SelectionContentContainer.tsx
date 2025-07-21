import React from "react";
import "./SelectorContentContainer.css";
import { Button, Flex } from "antd";

interface Props {
  children: React.ReactElement;
  selectNone: (event: React.SyntheticEvent) => void;
  selectUnflagged: (event: React.SyntheticEvent) => void;
  selectAll: (event: React.SyntheticEvent) => void;
  isNoneSelected: boolean;
  isUnflaggedSelected: boolean;
  areAllSelected: boolean;
  grid?: boolean;
  label: string;
}

const SelectorContentContainer = ({
  selectAll,
  selectNone,
  selectUnflagged,
  isNoneSelected,
  isUnflaggedSelected,
  areAllSelected,
  children,
  grid = false,
  label,
}: Props) => {
  const handleSelectNone = (event: React.MouseEvent) => {
    !isNoneSelected && selectNone(event);
  };

  const handleSelectUnflagged = (event: React.MouseEvent) => {
    !isUnflaggedSelected && selectUnflagged(event);
  };

  const handleSelectAll = (event: React.MouseEvent) => {
    !areAllSelected && selectAll(event);
  };

  return (
    <div className="selector-content-container">
      <Flex justify="space-between" align="center">
        <h3>{label}</h3>
        <div className="selector-content-container__actions">
          <Button type="text" onClick={handleSelectNone} disabled={isNoneSelected} aria-label="Select none">
            None
          </Button>
          <Button type="text" onClick={handleSelectAll} disabled={areAllSelected} aria-label="Select all">
            All
          </Button>
          <Button type="text" onClick={handleSelectUnflagged} disabled={isUnflaggedSelected} aria-label="Select unflagged">
            Unflagged
          </Button>
        </div>
      </Flex>
      <div className={`selector-content-container__content ${grid ? "grid" : ""}`}>
        <div className="selector-content-container__content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default SelectorContentContainer;
