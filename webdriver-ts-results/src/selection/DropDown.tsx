import React, {useCallback, useState} from 'react';

interface Props {
  label: string;
  children: JSX.Element | JSX.Element[];
  width: string;
}

const DropDown = ({label, children, width}: Props) => {
    const [open, setOpen] = useState(false);
    const toggle = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
        event.stopPropagation();
        setOpen(!open)
      }, [open])
      return (<div className={(open ? 'open dropdown-container' : 'dropdown-container')}>
        <button type="button" onClick={toggle} className={(open ? 'open dropdown' : 'dropdown')}>
          {label} <span className="caret"></span>
        </button>
        <div className="shutter" onClick={toggle}></div>
        <div className={(open ? 'show ' : '') +'dropdown-menu'} style={{width: width}}>
          {children}
        </div>
      </div>);
};

export default DropDown;
