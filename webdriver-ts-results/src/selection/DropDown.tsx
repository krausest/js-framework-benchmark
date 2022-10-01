import React, {useCallback, useState} from 'react';

interface Props {
  label: string;
  children: JSX.Element | JSX.Element[];
  width: string;
}

const DropDown = ({label, children, width}: Props): JSX.Element => {
    const [open, setOpen] = useState(false);
    const toggle = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
        event.stopPropagation();
        setOpen(!open)
      }, [open])
    const click = () => {
      // There's a pretty strange corner case: Click on which frameworks and deselect all keyed
      // frameworks. Then select one keyed framework. This will cause scrolling such that the
      // which frameworks drop down will be scrolled out of the visible area.
      // We prevent this by re-setting the scroll position.
      const x = window.scrollX;
      const y = window.scrollY; 
      window.requestAnimationFrame(() => {
        window.scrollTo(x, y);
      });
    }
      return (<div onClick={click} className={(open ? 'open dropdown-container' : 'dropdown-container')}>
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
