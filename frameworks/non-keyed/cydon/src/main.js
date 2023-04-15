import { CydonElement } from 'cydon'

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

class MainApp extends CydonElement {
	rows = []

	selected = null

	constructor() {
		super()
		this.$limits.set('selected', 2)
	}

	delete() {
		const id = this.item.id
		const index = this.rows.findIndex(item => item.id == id)
		this.rows.splice(index, 1)
	}

	select() {
		this.selected = this.item
	}

	run() {
		this.rows = buildData(1000)
		this.selected = null
	}

	add() {
		this.rows = this.rows.concat(buildData(1000))
		this.selected = null
	}

	update() {
		const rows = this.rows
		for (let i = 0; i < rows.length; i += 10) {
			rows[i].label += ' !!!'
		}
		this.selected = null
	}

	runLots() {
		this.rows = buildData(10000)
		this.selected = null
	}

	clear() {
		this.rows = []
		this.selected = null
	}

	swap() {
		const rows = this.rows
		if (rows.length > 998) {
			const { ...a } = rows[1]
			rows[1] = rows[998]
			rows[998] = a
		}
	}
}

customElements.define('main-app', MainApp)