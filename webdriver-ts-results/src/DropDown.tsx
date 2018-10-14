import * as React from 'react';

interface Props {
  label: string;
  children: JSX.Element | JSX.Element[];
  width: string;
}

export class DropDown extends React.Component<Props,{open: boolean}> {
    constructor(props: Props) {
        super(props);
        this.state = {open: false};
    }
    public toggle = (event: React.SyntheticEvent<HTMLElement>) => {
        console.log("this.toggle");
        event.stopPropagation();
        this.setState((state,props) => {
            return {open: !state.open}
        })
      }
    public render() {
        let {label, children, width} = this.props;
        return (<div className={(this.state.open ? 'open ' : '') +'btn-group'}>
          <button type="button" onClick={this.toggle} className="btn btn-outline-secondary btn-md dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {label} <span className="caret"></span>
          </button>
          <div className="shutter" onClick={this.toggle}></div>
          <div className={(this.state.open ? 'show ' : '') +'dropdown-menu'} style={{width: width}}>
            <div className="card-body" style={{paddingTop:'0px'}}>
              {children}
            </div>
          </div>
        </div>);
    }
};
