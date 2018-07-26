/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var el = require('attodom/el'),
    time = require('./time'),
    core = require('attodom/core')

var TITLE = 'attodom v0.6.1'

module.exports = el('div', {class: 'jumbotron'},
  el('div', {class: 'row'},
    el('div', {class: 'col-md-6'},
      el('h1', TITLE)
    ),
    el('div', {class: 'col-md-6'},
      el('div', {class: 'row', onclick: handleClick},
        createButton('run', 'Create 1,000 rows'),
        createButton('runlots', 'Create 10,000 rows'), //TODO error
        createButton('add', 'Append 1,000 rows'),
        createButton('update', 'Update every 10th row'),
        createButton('clear', 'Clear'),
        createButton('swaprows', 'Swap Rows')
      )
    )
  )
)

function createButton(id, tx) {
  return el('div', {class: 'col-sm-6 smallpad'},
    el('button', {id: id, class: 'btn btn-primary btn-block', type: 'button'}, tx)
  )
}

function handleClick(e) {
  var key = e.target.id,
      store = core.store
  if (!key) return

  e.preventDefault()
  time.start(key)
  switch (key) {
  case 'run':
    store.clear()
    store.run()
    break
  case 'add':
    store.add()
    break
  case 'runlots':
    store.clear()
    store.runLots()
    break
  case 'update':
    store.update()
    break
  case 'clear':
    store.clear()
    break
  case 'swaprows':
    if (store.data.length>10) store.swapRows()
  }
  core.update()
  time.stop()
}
