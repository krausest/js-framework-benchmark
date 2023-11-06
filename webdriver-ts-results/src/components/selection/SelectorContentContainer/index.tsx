import React from "react";
import "./SelectorContentContainer.css";

interface Props {
  children: React.ReactElement;
  selectNone: (event: React.SyntheticEvent) => void;
  selectAll: (event: React.SyntheticEvent) => void;
  isNoneSelected: boolean;
  areAllSelected: boolean;
  grid?: boolean;
  label: string;
}

const SelectorContentContainer = ({
  selectAll,
  selectNone,
  isNoneSelected,
  areAllSelected,
  children,
  grid = false,
  label,
}: Props) => {
  const handleSelectNone = (event: React.MouseEvent) => {
    !isNoneSelected && selectNone(event);
  };

  const handleSelectAll = (event: React.MouseEvent) => {
    !areAllSelected && selectAll(event);
  };

  return (
    <div className="selector-content-container">
      <h3>{label}</h3>
      <div className="selector-content-container__actions">
        <button
          className="button button__text"
          onClick={handleSelectNone}
          disabled={isNoneSelected}
          aria-label="Select none"
        >
          None
        </button>
        <button
          className="button button__text"
          onClick={handleSelectAll}
          disabled={areAllSelected}
          aria-label="Select all"
        >
          All
        </button>
      </div>
      <div
        className={`selector-content-container__content ${grid ? "grid" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default SelectorContentContainer;
