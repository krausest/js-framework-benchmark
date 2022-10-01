import * as React from 'react';

interface Props {
  children: Array<JSX.Element>;
  selectNone: (event: React.SyntheticEvent) => void;
  selectAll: (event: React.SyntheticEvent) => void;
  isNoneSelected: boolean;
  areAllSelected: boolean;
  grid?: boolean;
}

export function DropDownContents(props: Props): JSX.Element {
  const {selectNone, selectAll, isNoneSelected, areAllSelected, children, grid = false} = props;
  return <div className="section">
            {children[0]}
            <div className="float-rt">
                {!isNoneSelected ? <button className='textButton' onClick={selectNone}>None</button> : <button disabled={true} className='textButton'>None</button>}
                &nbsp;
                {!areAllSelected ? <button className='textButton' onClick={selectAll}>All</button> : <button disabled={true} className='textButton'>All</button>}
            </div>
            <div className={grid ? "grid" : ""}>
                {children[1]}
            </div>
        </div>;
}
