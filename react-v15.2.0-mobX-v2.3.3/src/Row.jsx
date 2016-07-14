'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {observer} = require("mobx-react");
var {observable, computed} = require ("mobx");
window.rowsUpdated = 0;
window.rowsMounted = 0;

@observer
export class Row extends React.Component {
	constructor(props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
		this.onClick = this.onClick.bind(this);
	}

//	componentDidUpdate() {
//		window.rowsUpdated++;
//	}
//	componentDidMount() {
//		window.rowsMounted++;
//	}

	onDelete() {
		this.props.onDelete(this.props.data);
	}
	onClick() {
		this.props.onClick(this.props.data);
	}

	render() {
		let {onClick, onDelete, data} = this.props;
		return (<tr className={data.isSelected ? 'danger' : ''}>
			<td className="col-md-1">{data.id}</td>
			<td className="col-md-4">
				<a onClick={this.onClick}>{data.label}</a>
			</td>
			<td className="col-md-1"><a onClick={this.onDelete}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
			<td className="col-md-6"></td>
		</tr>);
	}
}

