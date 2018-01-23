import React, { Component } from 'react'
import { view } from 'react-easy-state/dist/es.es6'
import appStore from './appStore'

class Row extends Component {
	onDelete () {
		appStore.delete(this.props.row)
	}

	onClick () {
		appStore.select(this.props.row)
	}

	render() {
		const { row } = this.props
		const styleClass = row.selected ? 'danger' : ''

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

export default view(Row)
