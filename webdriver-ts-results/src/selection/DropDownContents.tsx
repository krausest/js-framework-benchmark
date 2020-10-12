import * as React from 'react';

interface Props<T> {
  children: Array<JSX.Element>;
  selectNone: (event: React.SyntheticEvent<any>) => void;
  selectAll: (event: React.SyntheticEvent<any>) => void;
  isNoneSelected: boolean;
  areAllSelected: boolean;
}

export function DropDownContents<T>(props: Props<T>) {
  let {selectNone, selectAll, isNoneSelected, areAllSelected, children} = props;
  return <div className="section">
            {children[0]}
            <div className="float-rt">
                {!isNoneSelected ? <button className='textButton' onClick={selectNone}>None</button> : <button disabled={true} className='textButton'>None</button>}
                &nbsp;
                {!areAllSelected ? <button className='textButton' onClick={selectAll}>All</button> : <button disabled={true} className='textButton'>All</button>}
            </div>
            <div className="grid">
                {children[1]}
            </div>
        </div>;
}
