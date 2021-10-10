'use strict'

const _random = max => Math.random() * max | 0

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length

import Timer from './doo.timer.js'

const rowTemplate = document.createElement("tr");
rowTemplate.innerHTML = "<td class='col-md-1'></td><td class='col-md-4'><a class='lbl'></a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";


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
			Timer.start('build') 
			let label, labelStr

			
			const data = []
			for (let i = 0; i < count; i++) 
				// data.push({id: this.ID++,label: adjectives[_random(lenA)] + " " + colours[_random(lenB)] + " " + nouns[_random(lenC)]})

			{
				label = [adjectives[_random(lenA)],colours[_random(lenB)],nouns[_random(lenC)]]
				labelStr = label.join(' ')
				//id = this.ID++
				data.push({id:this.ID++, label:labelStr})
			}
/*
			const data = new Map()
			Object.defineProperty(data, 'length', {
				get() { return data.size },
			})
			let id = this.ID
			for (let i = 0; i < count; i++) {
				label = [adjectives[_random(lenA)],colours[_random(lenB)],nouns[_random(lenC)]]
				labelStr = label.join(' ')

				data.set(id + i,{id: id+i,label: labelStr})
				//data.set(id + i,{id: id+i,label: adjectives[_random(lenA)] + " " + colours[_random(lenB)] + " " + nouns[_random(lenC)]})

			}
			this.ID = id + count
*/
			Timer.stop('build') 


			return data	
		}

		getIndex() {
			return  this.data.rows.some((item, i) => {
				if (item.id === item.key) {
					return i
				}
			}) 
		}

		delete(elem) {
			let row = this.getParentRow(elem)
			if (row) {
				this.tbody.removeChild(row)
				let idx = this.getIndex(row)
				this.data.rows.splice(idx,1)
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

/*
		async renderTable(dataSet=this.data[this.defaultDataSet]) {
			let tableRef = this.place[0].parentElement
	
			let rowList = []
			let rowList2 = []
			let len = dataSet.length
			for (let i=0;i<len;i++) {
				let newRow = tableRef.insertRow(-1)
				rowList.push(newRow)
				rowList2.push(this.renderNode(this.place[0], this.data.rows, i  , 1 ))
	
			}
			for (let i=0;i<len;i++) {
				rowList[i].innerHTML = rowList2[i]
	
			}
			rowList = undefined
			rowList2 = undefined
			return
		}	
*/	

		runLots(e) {
			Timer.start('tot')
			this.clear(e)
			this.data.rows = this.buildData(10000)
			this.renderTable()
			//e.target.blur()
			Timer.start('add')
			Timer.stop('add')

			Timer.stop('tot')
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
	//		console.log('coolio', this.getParentRow(elem).rowIndex, this?.selectedRow?.rowIndex, this.getParentRow(elem).key)

			// if (row) {
			// 	row.classList.toggle('danger')
			// 	this.selectedRow = row
			// }    
		}
/*
		select(elem) {
			if (this.selectedRow) {
				let selectedKey = this.selectedRow.key
				let selectedRow = this.data.some((item => item.id === selectedKey))
				selectedRow.selected = ''
				//this.selectedRow.classList.remove('danger')
				this.update(this.selectedRow, selectedRow )
				this.selectedRow = undefined
			}
			  
			this.update(this.getParentRow(elem), selectedRow )

//			this.toggleSelect(this.getParentRow(elem))
			// if (row) {
			// 	row.classList.toggle('danger')
			// 	this.selectedRow = row
			// }    
		}
*/



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
			this.tbody.textContent = ''
			Timer.stop('clear')

		}
/*
		swapRows(e) {
			Timer.start('tot')
			if (this.data.rows.length>10) {
				let node1 = this.tbody.childNodes[1]
				let node2 = this.tbody.childNodes[998]

				let row1 = this.data.rows[1]
				let isSelected = false
				if (this?.selectedRow?.rowIndex === 1 ) {
//					this.toggleSelect(this.tbody.childNodes[998])
					this.selectedRow = this.tbody.childNodes[998] 
					this.toggleSelect(this.tbody.childNodes[1])

					isSelected === true
				}
				this.data.rows[1] = this.data.rows[998]
				this.data.rows[998] = row1
				this.update(this.tbody.childNodes[1], this.data.rows[1])
				this.update(this.tbody.childNodes[998], this.data.rows[998])
		
				// if (this.selectedRow) {

				if (isSelected) {
				 	//	this.toggleSelect(this.tbody.childNodes[1])
				 		this.toggleSelect(this.tbody.childNodes[998])

						 // 		this.selectedRow = this.tbody.childNodes[998]
				// 	} else if (this.selectedRow.rowIndex === 998) {
				// 		this.toggleSelect(this.tbody.childNodes[998])
				// 		this.toggleSelect(this.tbody.childNodes[1])
				// 		this.selectedRow = this.tbody.childNodes[1] 
				// 	}	
				 }

			}
			Timer.stop('tot')
		}
*/
		swapRows(e) {
			Timer.start('SWAP')
			if (this.data.rows.length>998) {
				let node1 = this.tbody.childNodes[1]
				let node2 = this.tbody.childNodes[998]

				let row1 = this.data.rows[1];
				this.data.rows[1] = this.data.rows[998];
				this.data.rows[998] = row1
				
				this.tbody.insertBefore(node2, node1)
				this.tbody.insertBefore(node1, this.tbody.childNodes[999])

			}
			Timer.stop('SWAP')

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