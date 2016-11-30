'use strict';

import Inferno from 'inferno'
import Component from 'inferno-component'
import { observer } from 'inferno-mobx';

@observer
export class Row extends Component {
    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onDelete() {
        this.props.onDelete(this.props.data);
    }

    onClick() {
        this.props.onClick(this.props.data);
    }

    render() {
        let {onClick, onDelete, data} = this.props;
        return (
            <tr className={data.isSelected ? 'danger' : ''}>
                <td className="col-md-1">{data.id}</td>
                <td className="col-md-4">
                    <a onClick={this.onClick}>{data.label}</a>
                </td>
                <td className="col-md-1">
                    <a onClick={this.onDelete}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </a>
                </td>
                <td className="col-md-6"></td>
            </tr>
        );
    }
}
