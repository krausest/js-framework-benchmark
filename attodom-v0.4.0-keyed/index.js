// @ts-check
/*eslint indent:0 quotes:0*/
var el = require('attodom/el')
var tableFactory = require('./src/table')
var Store = require('./src/store')
var time = require('./src/time')

var TITLE = 'attodom v0.1.0',
    store = new Store,
    table = tableFactory(store).update()

el('div').a('id', 'main').append(
  el('div').a('class', 'container').append(
    el('div').a('class', 'jumbotron').append(
      el('div').a('class', 'row').append(
        el('div').a('class', 'col-md-6').append(
          el('h1').p('textContent', TITLE)
        ),
        el('div').a('class', 'col-md-6').append(
          el('div').a('class', 'row')
          .on('click', handleClick).append(
            createButton('run', 'Create 1,000 rows'),
            createButton('runlots', 'Create 10,000 rows'), //TODO error
            createButton('add', 'child 1,000 rows'),
            createButton('update', 'Update every 10th row'),
            createButton('clear', 'Clear'),
            createButton('swaprows', 'Swap Rows')
          )
        )
      )
    ),
    table,
    el('span').a('class', 'preloadicon glyphicon glyphicon-remove').a('aria-hidden')
  )
).moveTo(document.body)

function createButton(id, tx) {
  return el('div').a('class', 'col-sm-6 smallpad').append(
    el('button').a('id', id).a('class', 'btn btn-primary btn-block')
    .a('type', 'button')
    .p('textContent', tx)
  )
}

function handleClick(e) {
  var key = e.target.id
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
  table.update()
  time.stop()
}
