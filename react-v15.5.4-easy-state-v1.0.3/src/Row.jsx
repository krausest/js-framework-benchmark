import React, { Component } from 'react'
import easyState from 'react-easy-state'

@easyState
export default class Row extends Component {
	onDelete () {
		const { row, onDelete } = this.props
		onDelete(row)
	}

	onClick () {
		const { row, onClick } = this.props
		onClick(row)
	}

	render() {
		const { row, styleClass } = this.props

		return (
			<tr className={styleClass}>
				<td className="col-md-1">{row.id}</td>
				<td className="col-md-4">
					<a onClick={this.onClick}>{row.label}</a>
				</td>
				<td className="col-md-1"><a onClick={this.onDelete}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
				<td className="col-md-6"></td>
			</tr>
		)
	}
}
