import React from "react";

interface Props {
  children: React.ReactNode;
  selectNone: (event: React.SyntheticEvent) => void;
  selectUnflagged?: (event: React.SyntheticEvent) => void;
  selectAll: (event: React.SyntheticEvent) => void;
  isNoneSelected: boolean;
  isUnflaggedSelected?: boolean;
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
  return (
    <div className="selector-group">
      <div className="selector-group__heading">
        <h3>{label}</h3>
        <div className="selector-group__actions">
          <button type="button" className="btn btn--text" onClick={selectNone} disabled={isNoneSelected}>
            None
          </button>
          <button type="button" className="btn btn--text" onClick={selectAll} disabled={areAllSelected}>
            All
          </button>
          {selectUnflagged && (
            <button
              type="button"
              className="btn btn--text"
              onClick={selectUnflagged}
              disabled={isUnflaggedSelected}
            >
              Unflagged
            </button>
          )}
        </div>
      </div>
      <div className={`selector-group__list ${grid ? "selector-group__list--grid" : ""}`}>{children}</div>
    </div>
  );
};

export default SelectorContentContainer;
