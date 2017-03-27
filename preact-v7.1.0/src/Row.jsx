'use strict';
/** @jsx preact.h */

var preact = require('preact');
var { render, h, Component } = preact;

window.rowsUpdated = 0;
window.rowsMounted = 0;

export class Row extends Component {
	constructor(props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.data !== this.props.data || nextProps.styleClass !== this.props.styleClass;
	}
//	componentDidUpdate() {
//		window.rowsUpdated++;
//	}
//	componentDidMount() {
//		window.rowsMounted++;
//	}

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
			<td className="col-md-1"><a onClick={this.onDelete}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
			<td className="col-md-6"></td>

			<td class="col-md-6" style="display: none;">
				<span class="label label-default">{data.id}</span>
			</td>

			<td class="col-md-6" style="display: none;">
				<h3>Example heading <span class="label label-default">{data.label}</span></h3>
			</td>

			<td class="col-md-6" style="display: none;">
				<div class="progress">
					<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
						<span class="sr-only">60% Complete</span>
					</div>
				</div>
			</td>

			<td class="col-md-6" style="display: none;">
				<div class="media">
					<div class="media-left media-middle">
						<a href="#">
							<img class="media-object" alt="..." />
						</a>
					</div>
					<div class="media-body">
						<h4 class="media-heading">Middle aligned media</h4>
						{data.label}
					</div>
				</div>
			</td>
		</tr>);
	}
}
