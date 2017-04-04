/*eslint indent:0 quotes:0*/
var pico = require('pico-dom'),
    table = require('./table'),
    time = require('./time')

var el = pico.element,
    co = pico.component

module.exports = co('div.row', {
    extra: {
      store: null,
      update: function(s) { this.store = s },
      handleEvent: handleClick,
      init: function() { this.node.addEventListener('click', this, true) }
    }
  }, [
  el('div.col-sm-6 smallpad',
    co('button[type=button].btn.btn-primary.btn-block#run', {extra: {key: 'run'}}, 'Create 1,000 rows')
  ),
  el('div.col-sm-6 smallpad',
    co('button[type=button].btn.btn-primary.btn-block#runlots', {extra: {key: 'runLots'}}, 'Create 10,000 rows')
  ),
  el('div.col-sm-6 smallpad',
    co('button[type=button].btn.btn-primary.btn-block#add', {extra: {key: 'add'}}, 'Append 1,000 rows')
  ),
  el('div.col-sm-6 smallpad',
    co('button[type=button].btn.btn-primary.btn-block#update', {extra: {key: 'update'}}, 'Update every 10th row')
  ),
  el('div.col-sm-6 smallpad',
    co('button[type=button].btn.btn-primary.btn-block#clear', {extra: {key: 'clear'}}, 'Clear')
  ),
  el('div.col-sm-6 smallpad',
    co('button[type=button].btn.btn-primary.btn-block#swaprows', {extra: {key: 'swapRows'}}, 'Swap Rows')
  )
])
function handleClick(e) {
  var target = pico.extra.get(e.target),
      key = target && target.key,
      store = this.store
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
    case 'runLots':
      store.clear()
      store.runLots()
      break
    case 'update':
      store.update()
      break
    case 'clear':
      store.clear()
      break
    case 'swapRows':
      if (store.data.length>10) store.swapRows()
  }
  table.update(store)
  time.stop()
}
