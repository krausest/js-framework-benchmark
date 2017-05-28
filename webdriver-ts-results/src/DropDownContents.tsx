import * as React from 'react';
import {DropdownCallback} from './Common'

interface Props<T> extends DropdownCallback<T> {
  children: Array<JSX.Element>;
}

export function DropDownContents<T>(props: Props<T>) {
  let {selectNone, selectAll, isNoneSelected, areAllSelected, children} = props;
  return <div>            
          <div className="row">
            <div className="text-left col-md-8"> 
              {children[0]}
            </div>
            <div className="text-right col-md-4" style={{paddingTop: '25px'}}> 
                {!isNoneSelected() ? <a href='#' onClick={selectNone}>None</a> : <span>None</span>}
                &nbsp;
                {!areAllSelected() ? <a href='#' onClick={selectAll}>All</a> : <span>All</span>}
            </div>    
          </div>    
          <div className="row">
            {children[1]}
          </div>
      </div>;
}
