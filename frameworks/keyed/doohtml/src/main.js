'use strict'

import {render, createTemplate, append, version} from '../lib/doohtml.mjs'

const _random = max => Math.random() * max | 0

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const lenA = adjectives.length, lenB = colours.length, lenC = nouns.length

const DEFAULT_SIZE = 1000, DEFAULT_SIZE_RUN_LOTS = 10000, SWAP_ROW = 998, BANG = ' !!!', DANGER = 'danger'

let rows = [], ID = 1, selectedRow = undefined, tbody = null 


const buildData = (count = DEFAULT_SIZE) => {
	const data = Array(count)
	for (let i = 0; i < count; i = i + 1) {
		const label = `${adjectives[_random(lenA)]} ${colours[_random(lenB)]} ${nouns[_random(lenC)]}`
		const id = ID++
		data[i] = { id, label }
	}
	return data	
}

const getIndex = (key) => {
	for (let i = 0; i < rows.length; i = i + 1) {
		if (rows[i].id === key) {
			return i
		}
	}
	return -1
}

const deleteRow = (elem) => {
	const row = elem.closest('tr')
	if (row) {
		const key = row.key 
		const idx = getIndex(key)
		if (key  && idx > -1) {
			rows.splice(idx, 1)
			row.remove()
		}
	}
}

const run = () => {
	if (rows.length) clear()
	rows = buildData()
	render(tbody, rows)
}

const add = () => {
	let start = rows.length
	rows = rows.concat(buildData())
	append(tbody, rows, start)
}

const runLots = () => {
	if (rows.length) clear()
	rows = buildData(DEFAULT_SIZE_RUN_LOTS)
	render(tbody, rows)
}

const update = () => {
	for (let i = 0, len = rows.length; i < len; i += 10) {
		tbody.childNodes[i].childNodes[1].childNodes[0].lastChild.nodeValue  = rows[i].label = `${rows[i].label}${BANG}`
	}
}

const select = (elem) => {
	if (selectedRow) {
		selectedRow.className = ''
		selectedRow = undefined
	}
	
	if (elem) {
		const row = elem.closest('tr')
		if (row) {
			selectedRow = row
			row.className = DANGER
		}
	}	
}

const clear = () => {
	selectedRow = undefined
	tbody.textContent = null
	rows = []	
}

const swapRows = () => {
	if (rows.length > SWAP_ROW) {
		let node1 = tbody.firstChild.nextSibling, 
			swapRow = tbody.children[SWAP_ROW],
			node999 = swapRow.nextSibling,
			row1 = rows[1]
		
		rows[1] = rows[SWAP_ROW]
		rows[SWAP_ROW] = row1
		
		tbody.insertBefore(node1.parentNode.replaceChild(swapRow, node1), node999)
	}
}

const init = async () => {
	tbody = await createTemplate('table', rows)
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
	document.getElementById("main").addEventListener('click', e => actions.runAction(e))    
}

document.querySelector(".ver").innerHTML += `${version} (keyed)`
document.title += ` (keyed)`
addEventListeners()
init()
