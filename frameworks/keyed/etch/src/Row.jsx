'use strict';
/** @jsx etch.dom */

const etch = require('etch');

export class Row {
    constructor(props, children) {
        this.props = props;
        this.children = children;

        this.onDelete = this.onDelete.bind(this);
        this.onClick = this.onClick.bind(this);

        etch.initialize(this);
    }

    update(nextProps, children) {
        if (nextProps.data === this.props.data && nextProps.styleClass === this.props.styleClass) {
            return Promise.resolve();
        }
        this.props = Object.assign({}, this.props, nextProps);
        this.children = children;
        return etch.update(this);
    }

    onDelete() {
        this.props.onDelete(this.props.data.id);
    }
    onClick() {
        this.props.onClick(this.props.data.id);
    }

    render() {
        let {styleClass, onClick, onDelete, data} = this.props;
        return (<tr className={styleClass}>
            <td className="col-md-1">{data.id}</td>
            <td className="col-md-4">
                <a onClick={this.onClick}>{data.label}</a>
            </td>
            <td className="col-md-1"><a onClick={this.onDelete}><span className="glyphicon glyphicon-remove" ariaHidden="true"></span></a></td>
            <td className="col-md-6"></td>
        </tr>);
    }
}
