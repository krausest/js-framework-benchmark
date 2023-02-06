import App from './app.eft'
import _Row from './row'
import {inform, exec} from 'ef-core'

let app = null
let selectedID = null

let componentStore = []

const rowMethods = {
	select({state}) {
		inform()
		if (selectedID) {
			const idx = app.rows.findIndex(d => d.id === selectedID)
			if (app.rows[idx]) app.rows[idx].selected = false
		}
		state.selected = true
		selectedID = state.id
		exec()
	},
	remove({state}) {
		if (state.id === selectedID) selectedID = null
		const idx = app.rows.findIndex(d => d.id === state.id)
		inform()
		for (let i = idx; i < app.rows.length - 1; i++) {
			app.rows[i].$update(app.rows[i + 1])
		}
		componentStore.push(app.rows.pop())
		exec()
	}
}

const Row = class extends _Row {
	constructor(...args) {
		super(...args)
		this.$methods = rowMethods
	}
}

let _id = 1

const _random = max => Math.round(Math.random() * 1000) % max

const buildData = (count = 1000) => {
	const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
	const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
	const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

	const data = []

	for (let i = 0; i < count; i++) {
		data.push({
			id: _id,
			// eslint-disable-next-line prefer-template
			label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
		})
		_id += 1
	}

	return data
}

const getRow = (state) => {
	if (componentStore.length) {
		const row = componentStore.pop()
		row.$update(state)
		return row
	}

	return new Row(state)
}

inform()

// for (let i = 0; i < 10000; i += 1) {
// 	componentStore.push(new Row())
// }

app = new App({
	$methods: {
		run({state}) {
			selectedID = null
			inform()
			const data = buildData()
			for (let i in data) {
				if (state.rows[i]) {
					state.rows[i].$update(data[i])
				} else {
					state.rows.push(getRow(data[i]))
				}
			}
			exec()
		},
		runLots({state}) {
			selectedID = null
			inform()
			const data = buildData(10000)
			for (let i in data) {
				if (state.rows[i]) {
					state.rows[i].$update(data[i])
				} else {
					state.rows.push(getRow(data[i]))
				}
			}
			exec()
		},
		add({state}) {
			inform()
			// eslint-disable-next-line semi
			;state.rows.push(...(buildData(1000).map(i => getRow(i))))
			exec()
		},
		update({state: {rows}}) {
			inform()
			for (let i = 0; i < rows.length; i += 10) {
				rows[i].label += ' !!!'
			}
			exec()
		},
		clear({state}) {
			componentStore = componentStore.concat(state.rows)
			state.rows.clear()
		},
		swapRows({state: {rows}}) {
			if (rows.length > 998) {
				inform()
				const {id: id1, label: label1} = rows[1]
				const {id: id998, label: label998} = rows[998]

				rows[1].id = id998
				rows[1].label = label998
				rows[998].id = id1
				rows[998].label = label1
				exec()
			}
		}
	}
})

app.$mount({target: document.querySelector('#main')})

exec()

window.app = app
