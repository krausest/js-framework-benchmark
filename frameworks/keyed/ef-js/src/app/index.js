import Tpl from './template.eft'
import Row from '../row'
import buildData from '../build-data.js'
import {inform, exec} from 'ef-core'

const App = class extends Tpl {
	static init(state) {
		let selectedRow = null

		const run = () => {
			selectedRow = null
			inform()
			state.rows = buildData(state).map(i => new Row(i))
			exec()
		}

		const runLots = () => {
			selectedRow = null
			inform()
			state.rows = buildData(state, 10000).map(i => new Row(i))
			exec()
		}

		const add = () => {
			inform()
			state.rows.push(...(buildData(state, 1000).map(i => new Row(i))))
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
			state.rows.clear()
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

		const swapRows = () => {
			const { rows } = state

			if (rows.length > 998) {
				inform()
				const d1 = rows[1]
				const d998 = rows[998]

				d1.$umount()
				d998.$umount()

				rows.splice(1, 0, d998)
				rows.splice(998, 0, d1)

				exec()
			}
		}

		return {
			methods: {
				run, runLots, add, update, clear, swapRows, select, deselect
			}
		}
	}
}

export default App
