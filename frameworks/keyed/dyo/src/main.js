import {h, memo, render, useReducer} from 'dyo'

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy",
"angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const random = (max) => {
	return Math.round(Math.random() * 1000) % max
}

const create = (id, data, length) => {
	for (var i = 0; i < length; i++) {
		data.push({id: id++, label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`})
	}
	return {id, data, selected: -1}
}

const run = ({id}) => {
	return create(id, [], 1000)
}

const alot = ({id}) => {
	return create(id, [], 10000)
}

const add = ({id, data}) => {
	return create(id, data, 1000)
}

const update = ({id, data, selected}) => {
	for (var i = 0; i < data.length; i += 10) {
		data[i].label += ' !!!'
	}
	return {id, data, selected}
}

const clear = (state) => {
	return {id: 1, data: [], selected: -1}
}

const swap = ({id, data, selected}) => {
	if (data.length > 998) {
		const temp = data[1]
		data[1] = data[998]
		data[998] = temp
	}
	return {id, data, selected}
}

const remove = ({id, data, selected}, payload) => {
	return {id: id, data: data.filter(({id}) => id !== payload), selected}
}

const select = ({id, data, selected}, payload) => {
	return {id, data, selected: payload}
}

const reducer = (state, {type, payload}) => {
	switch (type) {
		case 'run': return run(state)
		case 'alot': return alot(state)
		case 'add': return add(state)
		case 'update': return update(state)
		case 'clear': return clear(state)
		case 'swap': return swap(state)
		case 'remove': return remove(state, payload)
		case 'select': return select(state, payload)
	}
}

const Jumbo = memo(({dispatch}) => (
	h('div', {className: 'jumbotron'},
		h('div', {className: 'row'},
			h('div', {className: 'col-md-6'}, h('h1', {}, 'Dyo')),
			h('div', {className: 'col-md-6'},
				h('div', {className: 'row'},
					h('div', {className: 'col-sm-6 smallpad'},
						h('button', {className: 'btn btn-primary btn-block', type: 'button', id: 'run', onClick: e => dispatch({type: 'run'})}, 'Create 1,000 rows')
					),
					h('div', {className: 'col-sm-6 smallpad'},
						h('button', {className: 'btn btn-primary btn-block', type: 'button', id: 'runlots', onClick: e => dispatch({type: 'alot'})}, 'Create 10,000 rows')
					),
					h('div', {className: 'col-sm-6 smallpad'},
						h('button', {className: 'btn btn-primary btn-block', type: 'button', id: 'add', onClick: e => dispatch({type: 'add'})}, 'Append 1,000 rows')
					),
					h('div', {className: 'col-sm-6 smallpad'},
						h('button', {className: 'btn btn-primary btn-block', type: 'button', id: 'update', onClick: e => dispatch({type: 'update'})}, 'Update every 10th row')
					),
					h('div', {className: 'col-sm-6 smallpad'},
						h('button', {className: 'btn btn-primary btn-block', type: 'button', id: 'clear', onClick: e => dispatch({type: 'clear'})}, 'Clear')
					),
					h('div', {className: 'col-sm-6 smallpad'},
						h('button', {className: 'btn btn-primary btn-block', type: 'button', id: 'swaprows', onClick: e => dispatch({type: 'swap'})}, 'Swap Rows')
					)
				)
			)
		)
	)
), (prev, next) => true)

const Row = memo(({dispatch, id, label, selected}) => (
	h('tr', {className: selected ? 'danger' : ''},
		h('td', {className: 'col-md-1'}, id),
		h('td', {className: 'col-md-4'}, h('a', {onClick: e => dispatch({type: 'select', payload: id})}, label)),
		h('td', {className: 'col-md-1'}, h('a', {onClick: e => dispatch({type: 'remove', payload: id})},
			h('span', {className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true'}))
		),
		h('td', {className: 'col-md-6'})
	)
), (prev, next) => prev.label === next.label && prev.selected === next.selected)

const Main = (props) => {
	const [{data, selected}, dispatch] = useReducer(reducer, clear)

	return h('div', {className: 'container'},
		h(Jumbo, {dispatch}),
		h('table', {className: 'table table-hover table-striped test-data'},
			h('tbody', {}, data.map(({id, label}) => h(Row, {dispatch, id, label, key: id, selected: id === selected})))
		),
		h('span', {className: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true'})
	)
}

render(h(Main), '#main')
