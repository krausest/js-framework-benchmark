import App from './app.eft'
import _Row from './row'
import {inform, exec} from 'ef-core'

let app = null
let selectedID = null

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
		state.$destroy()
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

inform()

app = new App({
	$methods: {
		run({state}) {
			selectedID = null
			inform()
			state.rows = buildData().map(i => new Row(i))
			exec()
		},
		runLots({state}) {
			selectedID = null
			inform()
			state.rows = buildData(10000).map(i => new Row(i))
			exec()
		},
		add({state}) {
			inform()
			// eslint-disable-next-line semi
			;state.rows.push(...(buildData(1000).map(i => new Row(i))))
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
			state.rows.clear()
		},
		swapRows({state: {rows}}) {
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
	}
})

app.$mount({target: document.querySelector('#main')})

exec()

window.app = app
