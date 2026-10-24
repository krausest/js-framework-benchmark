import Tpl from './template.eft'
import Row from '../row'
import buildData from '../build-data.js'
import {inform, exec} from 'ef-core'

let rowCache = []

const getRow = (state) => {
	if (rowCache.length) {
		const row = rowCache.pop()
		row.$update(state)
		if (row.selected) row.selected = false
		return row
	}

	return new Row(state)
}

const App = class extends Tpl {
	static init(state) {
		let selectedRow = null

		const run = () => {
			const { rows } = state
			inform()
			if (selectedRow) selectedRow.selected = false
			selectedRow = null
			const data = buildData(state)
			if (data.length < rows.length) {
				rowCache = rowCache.concat(rows.splice(data.length - rows.length))
				for (let i in data) {
					const row = rows[i]
					row.$update(data[i])
				}
			} else {
				const supplement = []
				for (let i in data) {
					if (rows[i]) {
						const row = rows[i]
						row.$update(data[i])
					} else {
						supplement.push(getRow(data[i]))
					}
				}
				rows.push(...supplement)
			}
			exec()
		}

		const runLots = () => {
			const { rows } = state
			inform()
			if (selectedRow) selectedRow.selected = false
			selectedRow = null
			const data = buildData(state, 10000)
			if (data.length < rows.length) {
				rowCache = rowCache.concat(rows.splice(data.length - rows.length))
				for (let i in data) {
					const row = rows[i]
					row.$update(data[i])
				}
			} else {
				const supplement = []
				for (let i in data) {
					if (rows[i]) {
						const row = rows[i]
						row.$update(data[i])
					} else {
						supplement.push(getRow(data[i]))
					}
				}
				rows.push(...supplement)
			}
			exec()
		}

		const add = () => {
			inform()
			state.rows.push(...(buildData(state, 1000).map(i => getRow(i))))
			exec()
		}

		const update = () => {
			const { rows } = state

			inform()
			for (let i = 0; i < rows.length; i += 10) {
				rows[i].$data.label += ' !!!'
			}
			exec()
		}

		const clear = () => {
			const { rows } = state
			rowCache = rowCache.concat(rows)
			rows.clear()
		}

		const swapRows = () => {
			const { rows } = state

			if (rows.length > 998) {
				inform()
				const {id: id1, label: label1} = rows[1].$data
				const {id: id998, label: label998} = rows[998].$data

				rows[1].$data = {id: id998, label: label998}
				rows[998].$data = {id: id1, label: label1}

				if (selectedRow) {
					if (selectedRow === rows[1]) {
						selectedRow.selected = false
						selectedRow = rows[998]
						selectedRow.selected = true
					} else if (selectedRow === rows[998]) {
						selectedRow.selected = false
						selectedRow = rows[1]
						selectedRow.selected = true
					}
				}

				exec()
			}
		}

		const select = ({ id }) => {
			const { rows } = state

			inform()
			const row = rows[rows.findIndex(d => d.id === id)]
			if (row) row.selected = true
			if (selectedRow) selectedRow.selected = false
			selectedRow = row
			exec()
		}

		const deselect = ({ id }) => {
			if (selectedRow && selectedRow.id === id) {
				selectedRow.selected = false
				selectedRow = null
			}
		}

		return {
			methods: {
				run, runLots, add, update, clear, swapRows, select, deselect
			}
		}
	}

	// eslint-disable-next-line class-methods-use-this
	recycle(row) {
		rowCache.push(row)
	}
}

export default App
