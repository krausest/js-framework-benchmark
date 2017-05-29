'use strict'

var {Store, startMeasure, stopMeasure} = require('./store.js')
var {version, render, h} = require("dio.js")

class Main {
  printDuration() {
		stopMeasure()
  }
  componentDidUpdate() {
		this.printDuration()
  }
  componentDidMount() {
		this.printDuration()
  }
  run() {
		startMeasure("run")
		this.state.store.run()
		this.forceUpdate()
  }
	  add() {
		startMeasure("add")
		this.state.store.add()
		this.forceUpdate()
  }
  update() {
		startMeasure("update")
		this.state.store.update()
		this.forceUpdate()
  }
  select(id) {
		startMeasure("select")
		this.state.store.select(id)
		this.forceUpdate()
  }
  delete(id) {
		startMeasure("delete")
		this.state.store.delete(id)
		this.forceUpdate()
  }
  runLots() {
		startMeasure("runLots")
		this.state.store.runLots()
		this.forceUpdate()
  }
  clear() {
		startMeasure("clear")
		this.state.store.clear()
		this.forceUpdate()
  }
  swapRows() {
		startMeasure("swapRows")
		this.state.store.swapRows()
		this.forceUpdate()
  }
	handleClick(e) {
		// event delegation
		var target = e.target
		var value = target.value
		var fn
		var id

		if (value !== void 0) {
			fn = value.fn
			id = value.id
		} else {
			value = target.parentNode.value

			if (value !== void 0) {
				fn = value.fn
				id = value.id
			}
		}

		if (fn !== void 0) {
			fn.call(this, id)
		}
	}
	getInitialState() {
		return {store: new Store()}
	}
  render() {
		var {data, selected} = this.state.store

		return h('div', {className: 'container'},
		  h('div', {className: 'jumbotron'},
			h('div', {className: 'row'},
				h('div', {className: 'col-md-6'}, h('h1', 'dio v'+version)),
				h('div', {className: 'col-md-6'},
					h('div', {className: 'row'},
						h('div', {className: 'col-sm-6 smallpad'},
							h('button', {id: 'run', className: 'btn btn-primary btn-block', onClick: this.run}, 'Create 1,000 rows')
						),
						h('div', {className: 'col-sm-6 smallpad'},
							h('button', {id: 'runlots', className: 'btn btn-primary btn-block', onClick: this.runLots}, 'Create 10,000 rows')
						),
						h('div', {className: 'col-sm-6 smallpad'},
							h('button', {id: 'add', className: 'btn btn-primary btn-block', onClick: this.add}, 'Append 1,000 rows')
						),
						h('div', {className: 'col-sm-6 smallpad'},
							h('button', {id: 'update', className: 'btn btn-primary btn-block', onClick: this.update}, 'Update every 10th row')
						),
						h('div', {className: 'col-sm-6 smallpad'},
							h('button', {id: 'clear', className: 'btn btn-primary btn-block', onClick: this.clear}, 'Clear')
						),
						h('div', {className: 'col-sm-6 smallpad'},
							h('button', {id: 'swaprows', className: 'btn btn-primary btn-block', onClick: this.swapRows}, 'Swap Rows')
						)
					)
				)
			)
		  ),
		  h('table', {className: 'table table-hover table-striped test-data'},
			h('tbody', {onClick: this.handleClick}, data.map(({id, label}) => {
					return h('tr', {className: id === selected ? 'danger' : ''},
						h('td', {className: 'col-md-1'}, id),
						h('td', {className: 'col-md-4'},
							h('a', {value: {id: id, fn: this.select}}, label)
						),
						h('td', {className: 'col-md-1'},
							h('a', {value: {id: id, fn: this.delete}},
								h('span', {className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true'})
							)
						),
						h('td', {className: 'col-md-6'})
					)
				})
			)
		  ),
		  h('span', {className: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true'})
		)
  }
}

render(h(Main), document.getElementById('main'))
