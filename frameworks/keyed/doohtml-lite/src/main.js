'use strict'


const _random = max => Math.random() * max | 0

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length

import DooFn from './DooFn.js'

const DEFAULT_SIZE = 1000
const DEFAULT_SIZE_RUN_LOTS = 10000
const SWAP_ROW = 998
const BANG = ' !!!' 



Doo.define(class Main extends Doo {
			constructor() {
			super(100)
			this.defaultDataSet = 'rows'
			this.ID = 1
			this.data = {
				[this.defaultDataSet]: []
			}
			this.add = this.add.bind(this)
			this.run = this.run.bind(this)
			this.runLots = this.runLots.bind(this)
			this.update = this.update.bind(this)
			this.clear = this.clear.bind(this)
			this.swapRows = this.swapRows.bind(this)
			this.addEventListeners()
			this.selectedRow = undefined
			document.querySelector(".ver").innerHTML += ` ${Doo.version} (keyed)`
			document.title += ` ${Doo.version} (keyed)`
		}

		async dooAfterRender() {
			this.tbody = document.querySelector('#tbody')
			this.tbody.addEventListener('click', e => {
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
			const data = [];
			for (let i = 0; i < count; i++) {
				data.push({id: this.ID++,label: adjectives[_random(lenA)] + " " + colours[_random(lenB)] + " " + nouns[_random(lenC)]})
			}
			return data	
		}
		getIndex(row) {
			let idx =  this.data.rows.findIndex((item, i) => {
				if (item.id === row.key) {
					return i
				}
			}) 
			return idx
		}

		delete(elem) {
			let row = this.getParentRow(elem)
			if (row) {
				this.tbody.removeChild(row)
				let idx = this.getIndex(row)
				if (idx !== undefined) {
					this.data.rows.splice(idx,1)
				}

			}
		}  

		run() {
			this.select(undefined)
			if (this.data.rows.length) this.clear()
			this.data.rows = this.buildData()
			DooFn.renderTable(this.data.rows, this.tbody)
		}

		add() {
			let start = this.data.rows.length
			this.data.rows = this.data.rows.concat(this.buildData())
			DooFn.append(this.data.rows, this.tbody, start)
		}   

		runLots() {
			this.select(undefined)
			if (this.data.rows.length) this.clear()
			this.data.rows = this.buildData(DEFAULT_SIZE_RUN_LOTS)
			DooFn.renderTable(this.data.rows, this.tbody)
		}

		update() {
			const len = this.data.rows.length
			for (let i = 0; i < len; i += 10) {
				this.data.rows[i].label += BANG
				this.tbody.childNodes[i].querySelector('a').firstChild.nodeValue = this.data.rows[i].label
			}
		}

		select(elem) {
			if (this.selectedRow) {
				this.selectedRow.classList.remove('danger')
				this.selectedRow = undefined
			}
			if (elem) {
				this.toggleSelect(this.getParentRow(elem))
			}	
		}

		toggleSelect(row) {
			if (row) {
				row.classList.toggle('danger')
				if (row.classList.contains('danger')) {
					this.selectedRow = row
				}	
			}    
		}

		clear() {
			this.tbody.textContent = null
			this.data.rows = []	
		}

		swapRows() {
			if (this.data.rows.length > SWAP_ROW) {
				let node1 = this.tbody.firstChild.nextSibling, 
					swapRow = this.tbody.childNodes[SWAP_ROW],
					node999 = swapRow.nextSibling,
					row1 = this.data.rows[1]
				
				this.data.rows[1] = this.data.rows[SWAP_ROW];
				this.data.rows[SWAP_ROW] = row1
				
 				this.tbody.insertBefore(node1.parentNode.replaceChild(swapRow, node1), node999)
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
	
		async connectedCallback() {
			super.connectedCallback()
		}
	
	})
