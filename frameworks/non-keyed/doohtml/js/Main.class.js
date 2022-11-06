'use strict'

const _random = max => Math.random() * max | 0

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length

import Timer from './doo.timer.js'

Doo.define(
  	class Main extends Doo {
		constructor() {
			super(100)
			this.scrollTarget = '.table'
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
			this.swaprows = this.swapRows.bind(this)
			this.addEventListeners()
			this.selectedRow = undefined
			document.querySelector(".ver").innerHTML += ` ${Doo.version} (non-keyed)`
			document.title += ` ${Doo.version} (non-keyed)`
		}

		async dooAfterRender() {
			this.tbody = this.shadow.querySelector('#tbody')
			this.shadow.querySelector(this.scrollTarget).addEventListener('click', e => {
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

		buildData(count = 1000) {
			const data = [];
			for (let i = 0; i < count; i++) {
				data.push({id: this.ID++,label: adjectives[_random(lenA)] + " " + colours[_random(lenB)] + " " + nouns[_random(lenC)]})
			}
			return data	
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

		run(e) {
			Timer.start('tot')
			this.data.rows = this.buildData()
			if (this.tbody.childNodes.length > this.data.rows.length) {
				this.tbody.textContent = ''
			}
			this.renderTable()
			e.target.blur()
			Timer.stop('tot')

		}
		add(e) {
			Timer.start('tot')
			//this.clear()
			let start = this.data.rows.length
			this.data.rows = this.data.rows.concat(this.buildData())
			this.append(this.data.rows, this.tbody, start)
			e.target.blur()
			Timer.stop('tot')

		}   

		runLots(e) {
			Timer.start('tot')
			this.data.rows = this.buildData(10000)
			if (this.tbody.childNodes.length > this.data.rows.length) {
				this.tbody.textContent = ''
			}
			this.renderTable()
			e.target.blur()
			Timer.stop('tot')

		}

		update() {
			for (let i=0, len = this.data.rows.length;i<len;i+=10) {
				this.tbody.childNodes[i].childNodes[1].childNodes[0].innerText = this.data.rows[i].label += ' !!!'
			}
		}

		select(elem) {
			if (this.selectedRow) {
				this.selectedRow.classList.remove('danger')
				this.selectedRow = undefined
			}
			let row = this.getParentRow(elem)
			if (row) {
				row.classList.toggle('danger')
				this.selectedRow = row
			}    
		}

		clear() {
			this.data.rows = []
			this.tbody.textContent = ''
		}

		swapRows() {
			if (this.data.rows.length > 998) {
				let node1 = this.tbody.firstChild.nextSibling, 
					node2 = node1.nextSibling,
					node998 = this.tbody.childNodes[998],
					node999 = node998.nextSibling,
					row1 = this.data.rows[1]
				
				this.data.rows[1] = this.data.rows[998];
				this.data.rows[998] = row1
				
				this.tbody.insertBefore(node998, node2)
				this.tbody.insertBefore(node1, node999)
			}
		}
		isRowSelected(elem) {
			return elem.classList.contains('danger')
		}
		swapRows(e) {
			Timer.start('tot')
			const A=1,B=998
			if (this.data.rows.length > B) {
				
				let a = this.tbody.childNodes[A], 
					b = this.tbody.childNodes[B],
					row1 = this.data.rows[1]
				
				this.data.rows[A] = this.data.rows[B];
			 	this.data.rows[B] = row1
			
				const selected1 = this.isRowSelected(a)
				const selected2 = this.isRowSelected(b)
				this.updateRow(A, this.data.rows, this.tbody)
				this.updateRow(B, this.data.rows, this.tbody)
			
 				if (selected1) {
					this.select(this.tbody.childNodes[B])
				}
				if (selected2) 	{
					this.select(this.tbody.childNodes[A])
				}
			}
			Timer.stop('tot')
		}

		addEventListeners() {
			document.getElementById("main").addEventListener('click', e => {
				e.preventDefault()
				if (e.target.matches('#runlots')) {
					this.runLots(e)
				} else if (e.target.matches('#run')) {
					this.run(e)
				} else if (e.target.matches('#add')) {
					this.add(e)
				} else if (e.target.matches('#update')) {
					this.update()
				} else if (e.target.matches('#clear')) {
					this.clear()
				} else if (e.target.matches('#swaprows')) {
					this.swapRows()
				}
			})    
    	}
	}
)