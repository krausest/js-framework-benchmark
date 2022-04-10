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
			document.querySelector(".ver").innerHTML += ` ${Doo.version} (keyed)`
			document.title += ` ${Doo.version} (keyed)`
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
		run(e) {
			Timer.start('tot')
			this.clear(e)
			this.data.rows = this.buildData()
			this.renderTable()
	//		e.target.blur()
			Timer.start('add')
			Timer.stop('add')
			Timer.stop('tot')
		}

		add(e) {
			Timer.start('tot')
			this.data.rows = this.data.rows.concat(this.buildData())
			this.renderTable(this.data.rows)
			Timer.stop('tot')
		}    

		runLots(e) {
			Timer.start('tot')
			this.clear(e)
			this.data.rows = this.buildData(10000)	
			this.renderTable()
			//e.target.blur()
			Timer.stop('tot')
		}

		async renderTable(dataSet=this.data[this.defaultDataSet]) {
			let len = dataSet.length
			let elem = document.createElement('tbody')
			elem.innerHTML = this.renderNode(this.place[0], dataSet, 0 , len) 
			let tableRows = elem.querySelectorAll('tr')
	
			for (let i=0;i<len;i++) {
				this.place[0].appendChild(tableRows.item(i))
			}	
			return
		}	
	

		update(e) {
			for (let i=0, len = this.data.rows.length;i<len;i+=10) {
				this.tbody.childNodes[i].childNodes[1].childNodes[0].innerText = this.data.rows[i].label += ' !!!'
			}
		}

		select(elem) {
			if (this.selectedRow) {
				this.selectedRow.classList.remove('danger')
				this.selectedRow = undefined
			}
			this.toggleSelect(this.getParentRow(elem))
		}

		toggleSelect(row) {
			if (row) {
				row.classList.toggle('danger')
				if (row.classList.contains('danger')) {
					this.selectedRow = row
				}	
			}    
		}

		clear(e) {
			Timer.start('clear')

			this.data.rows = []
//		    this.data.rows = this.buildData(1)
			this.tbody.textContent = ''
			this.renderTable()
			Timer.stop('clear')
		}
/*
		swapRows(e) {
			if (this.data.rows.length>10) {
				let node1 = this.tbody.childNodes[1]
				let node2 = this.tbody.childNodes[998]

				let row1 = this.data.rows[1];
				this.data.rows[1] = this.data.rows[998];
				this.data.rows[998] = row1
				
				this.tbody.insertBefore(node2, node1)
				this.tbody.insertBefore(node1, this.tbody.childNodes[999])
			}
		}
*/
		swapRows(e) {
			if (this.data.rows.length > 998) {

				let tmp = this.data.rows[998];
				this.rows.data[998] = this.rows.data[1];
				this.rows.data[1] = tmp;

				let a = this.tbody.firstChild.nextSibling,
					b = a.nextSibling,
					c = this.tbody.childNodes[998],
					d = c.nextSibling;

				this.tbody.insertBefore(c, b);
				this.tbody.insertBefore(a, d);
			}	
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
					this.update(e)
				} else if (e.target.matches('#clear')) {
					this.clear(e)
				} else if (e.target.matches('#swaprows')) {
					this.swapRows(e)
				}
			})    
    	}
	}
)