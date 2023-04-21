import { createApp } from 'petite-vue'

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

let nextId = 1
function buildData(count) {
	const data = []

	for (let i = 0; i < count; i++) {
		data.push({
			id: nextId++,
			label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
		})
	}

	return data
}

function _random(max) {
	return Math.round(Math.random() * 1000) % max
}
const rows = []

createApp({
	rows,
	selected: null,

	remove(item) {
		const index = this.rows.findIndex(x => x == item)
		this.rows.splice(index, 1)
	},

	select(item) {
		this.selected = item
	},

	run() {
		this.rows = buildData(1000)
		this.selected = null
	},

	add() {
		this.rows = this.rows.concat(buildData(1000))
		this.selected = null
	},

	update() {
		for (let i = 0; i < this.rows.length; i += 10) {
			this.rows[i].label += ' !!!'
		}
		this.selected = null
	},

	runLots() {
		this.rows = buildData(10000)
		this.selected = null
	},

	clear() {
		this.rows = []
		this.selected = null
	},

	swap() {
		if (this.rows.length > 998) {
			const a = this.rows[1]
			this.rows[1] = this.rows[998]
			this.rows[998] = a
		}
	}
}).mount()