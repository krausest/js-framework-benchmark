'use strict'
const _random = max => Math.random() * max | 0

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length
const DEFAULT_SIZE = 1000
const CHILD_1 = 1
const CHILD_998 = 998
const BANG = ' !!!'
const DANGER = 'danger'
Doo.define(
  	class Main extends Doo {
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
			this.tbody = this.shadow.querySelector('#tbody')
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
			const data = new Array(count)
			for (let i = 0; i < count; i++) {
				data[i] = {id: this.ID++,label: `${adjectives[_random(lenA)]} ${colours[_random(lenB)]}  ${nouns[_random(lenC)]}`}
			}
			return data	
		}
		getIndex(row) {
			return this.data.rows.findIndex((item) => item.id === row.key) 
		}

		delete(elem) {
			let row = this.getParentRow(elem)
			if (row) {
				this.tbody.removeChild(row)
				if (row.key !== undefined) {
					this.data.rows.splice(row,1)
				}
			}
		}  

		run() {
			this.clear()
			this.data.rows = this.buildData()
			this.renderTable()
		}

		add() {
			let start = this.data.rows.length
			this.data.rows = this.data.rows.concat(this.buildData())
			this.append(this.data.rows, this.tbody, start)
		}    

		runLots() {
			this.clear()
			this.data.rows = this.buildData(10000)
			this.renderTable()
		}

		update() {
			for (let i=0, len = this.data.rows.length;i<len;i+=10) {
				this.tbody.childNodes[i].childNodes[1].childNodes[0].firstChild.nodeValue  = this.data.rows[i].label = `${this.data.rows[i].label}${BANG}`
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
			this.tbody.textContent = ''
			this.data.rows = []
		}

		swapRows() {
			if (this.data.rows.length > CHILD_998) {
				let node1 = this.tbody.childNodes[CHILD_1], 
					swapRow = this.tbody.childNodes[CHILD_998],
					node999 = swapRow.nextSibling,
					row1 = this.data.rows[CHILD_1]
				
				this.data.rows[CHILD_1] = this.data.rows[CHILD_998];
				this.data.rows[CHILD_998] = row1
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
