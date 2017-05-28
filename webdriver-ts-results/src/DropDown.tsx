import * as React from 'react';

const toggle = (event: React.SyntheticEvent<HTMLElement>) => {
  let elem = (event.nativeEvent.target as HTMLElement).parentElement;
  if (elem) elem.classList.toggle('open');
}

interface Props {
  label: string;
  children: JSX.Element | JSX.Element[];
  width: string;
}

export function DropDown(props: Props) {
      let {label, children, width} = props;
      return <div className="btn-group">
        <button type="button" onClick={toggle} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {label} <span className="caret"></span>
        </button>
        <div className="dropdown-backdrop" onClick={toggle}></div>
        <div className="dropdown-menu" style={{width: width}}>  
          <div className="panel-body" style={{paddingTop:'0px'}}>
            {children}
          </div>
        </div>
      </div>
};
