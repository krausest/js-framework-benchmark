'use strict'

import {createTemplate, addWithProvider, renderWithProvider, version} from '../dist/doohtml.mjs'


const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length

const DEFAULT_SIZE = 1000, DEFAULT_SIZE_RUN_LOTS = 10000, SWAP_ROW = 998, BANG = ' !!!', DANGER = 'danger', TR = 'tr'

let globalIdCounter = 1

class Store {
	constructor() {
		this.rows = []
		this.rowsMap = new Map()
		this.selectedRow = null
	}

	create(index = 0) {
		const id = globalIdCounter++
		
		const label = `${adjectives[Math.trunc(Math.random() * lenA) % lenA]} ${colours[Math.trunc(Math.random() * lenB) % lenB]} ${nouns[Math.trunc(Math.random() * lenC) % lenC]}`
		
		const row = { id, label }
	//	this.rows.push(row)
		this.rows[index] = row
		this.rowsMap.set(id, row)
		return row
	}

	getIndex(key) {
		const row = this.rowsMap.get(key)
		return row ? this.rows.indexOf(row) : -1
	}

	clear() {
		this.rows = []
		this.rowsMap.clear()
		this.selectedRow = null
	}
}

const store = new Store()
let selectedRow, tbody = null

const deleteRow = (elem) => {
	const row = elem.closest(TR)
	if (row) {
		const key = row.key 
		const idx = store.getIndex(key)
		if (key && idx > -1) {
			//const deletedRow = store.rows[idx]
			store.rows.splice(idx, 1)
			store.rowsMap.delete(key)
			row.remove()
		}
	}
}

const run = () => {
	if (store.rows.length > 0) {
		store.clear()
		tbody.textContent = null
		selectedRow = undefined
	}
	renderWithProvider(tbody, store.rows, 0, DEFAULT_SIZE, (i) => store.create(i))
}

const add = () => {
	let start = store.rows.length
	addWithProvider(tbody,store.rows, start, DEFAULT_SIZE, (i) => store.create(i))
}

const runLots = () => {
	if (store.rows.length > 0) {
		store.clear()
		tbody.textContent = null
		selectedRow = undefined
	}
	renderWithProvider(tbody, store.rows, 0, DEFAULT_SIZE_RUN_LOTS, (i) => store.create(i))
}

const update = () => {
	for (let i = 0, len = store.rows.length; i < len; i += 10) {
		tbody.childNodes[i].childNodes[1].childNodes[0].lastChild.nodeValue = store.rows[i].label = `${store.rows[i].label}${BANG}`
	}
}

const select = (elem) => {
	if (selectedRow) {
		selectedRow.className = ''
		selectedRow = undefined
	}
	
	if (elem) {
		const row = elem.closest(TR)
		if (row) {
			selectedRow = row
			row.className = DANGER
		}
	}	
}

const clear = () => {
	store.clear()
	selectedRow = undefined
	tbody.textContent = null
}

const swapRows = () => {
	if (store.rows.length > SWAP_ROW) {
		let node1 = tbody.firstChild.nextSibling, 
			swapRow = tbody.children[SWAP_ROW],
			node999 = swapRow.nextSibling,
			row1 = store.rows[1]
		
		store.rows[1] = store.rows[SWAP_ROW]
		store.rows[SWAP_ROW] = row1
		
		tbody.insertBefore(node1.parentNode.replaceChild(swapRow, node1), node999)
	}
}

const init = async () => {
	tbody = await createTemplate('table', store.rows)
	tbody.addEventListener('click', e => {
		e.preventDefault()
		if (e.target.parentElement.matches('.remove')) {
			deleteRow(e.target.parentElement)
		} else if (e.target.tagName === 'A') {
			select(e.target)
		}
	})
}
const addEventListeners = () => {
	const actions = {
		'run': run,
		'runlots': runLots,
		'add': add,
		'update': update,
		'clear': clear,
		'swaprows': swapRows,
		runAction: (e) => {
			e.preventDefault()
			if (actions[e.target.id]) {
				actions[e.target.id]()
			}	
		}
	}	
	globalThis.document.querySelector("#main").addEventListener('click', e => actions.runAction(e))    
}

globalThis.document.querySelector(".ver").innerHTML += `${version} (keyed)`
globalThis.document.title += ` (keyed)`
addEventListeners()
init()
