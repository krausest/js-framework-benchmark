'use strict'

import {render, createTemplate, append, version} from '../lib/doohtml.mjs';
const _random = max => Math.random() * max | 0

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length

const DEFAULT_SIZE = 1000
const DEFAULT_SIZE_RUN_LOTS = 10000
const SWAP_ROW = 998
const BANG = ' !!!' 
const DANGER = 'danger'
class Main  {
	constructor() {
		this.rows = []
		this.ID = 1
		this.add = this.add.bind(this)
		this.run = this.run.bind(this)
		this.runLots = this.runLots.bind(this)
		this.update = this.update.bind(this)
		this.clear = this.clear.bind(this)
		this.swapRows = this.swapRows.bind(this)
		this.addEventListeners()
		this.selectedRow = undefined
		document.querySelector(".ver").innerHTML += `${version} (keyed)`
		document.title += ` (keyed)`
	}

	async init() {
		this.tbody  = await createTemplate('table', [])
		render(this.tbody, this.rows)
		this.firstDataBindNode = document.querySelector('#tbody')
		this.dooAfterRender()
	}	

	async dooAfterRender() {
		this.firstDataBindNode.addEventListener('click', e => {
			e.preventDefault()
			if (e.target.parentElement.matches('.remove')) {
				this.delete(e.target.parentElement)
			} else if (e.target.tagName === 'A') {
				this.select(e.target)
			}
		})
	}

	getParentRow(elem) {
		while (elem) {
			if (elem.tagName === "TR") {return elem}
			elem = elem.parentNode
		}
		return undefined
	}

	buildData(count = DEFAULT_SIZE) {
		const data = Array(count);
		for (let i = 0; i < count; i=i+1) {
			const label = `${adjectives[_random(lenA)]}  ${colours[_random(lenB)]} ${nouns[_random(lenC)]}`
			const id = this.ID++
			data[i] = { id, label }
		}
		return data	
	}

	getIndex(row) {
		let idx =  this.rows.findIndex((item, i) => {
			if (item.id === row.key) {
				return i
			}
		}) 
		return idx
	}

	delete(elem) {
		let row = this.getParentRow(elem)
		if (row) {
			row.parentElement.removeChild(row)
			let idx = this.getIndex(row)
			if (idx !== undefined) {
				this.rows.splice(idx,1)
			}

		}
	}  

	run() {
		this.select(undefined)
		if (this.rows.length) this.clear()
		this.rows = this.buildData()
		render(this.tbody, this.rows)
	}

	add() {
		let start = this.rows.length
		this.rows = this.rows.concat(this.buildData())
		append(this.tbody, this.rows, start)
	}   

	runLots() {
		this.select(undefined)
		if (this.rows.length) this.clear()
		this.rows = this.buildData(DEFAULT_SIZE_RUN_LOTS)
		render(this.tbody, this.rows)
	}

	update() {
		const len = this.rows.length
		for (let i = 0; i < len; i += 10) {
			this.firstDataBindNode.childNodes[i].querySelector('a').append(BANG)
		}
	}

	select(elem) {
		if (this.selectedRow) {
			this.selectedRow.className = ''
			this.selectedRow = undefined
		}
		
		if (elem) {
			const row = this.getParentRow(elem)
			if (row) {
				this.selectedRow = row
				row.className = DANGER
			}
		}	
	}


	clear() {
		this.firstDataBindNode.textContent = null
		this.rows = []	
	}

	swapRows() {
		if (this.rows.length > SWAP_ROW) {
			let node1 = this.firstDataBindNode.firstChild.nextSibling, 
				swapRow = this.firstDataBindNode.childNodes[SWAP_ROW],
				node999 = swapRow.nextSibling,
				row1 = this.rows[1]
			
			this.rows[1] = this.rows[SWAP_ROW];
			this.rows[SWAP_ROW] = row1
			
			this.firstDataBindNode.insertBefore(node1.parentNode.replaceChild(swapRow, node1), node999)
		}
	}

	addEventListeners() {
		const actions = {
			'run': this.run,
			'runlots': this.runLots,
			'add': this.add,
			'update': this.update,
			'clear': this.clear,
			'swaprows': this.swapRows,
			runAction: (e) => {
				e.preventDefault()
				if (actions[e.target.id]) {
					actions[e.target.id]()
				}	
			}
		}	
		document.getElementById("main").addEventListener('click', e => actions.runAction(e))    
	}
}
const main = new Main()
main.init()
