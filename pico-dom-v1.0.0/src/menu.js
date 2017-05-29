/*eslint indent:0, quotes:0, no-multi-spaces:0 */
import {list, element as el} from 'pico-dom'
import time from './time'


var buttonT = el('div', {class: 'col-sm-6 smallpad'},
  el('button')
  .class('btn btn-primary btn-block')
  .attr('type', 'button')
  .extra('update', function(cfg) {
    this.attr('id', cfg.id).text(cfg.tx)
  })
)


export var menuTemplate = el('div', {
    class: 'row',
    events: {click: handleClick}
  },
  list(
    buttonT
  ).call(function() {
    this.update([
      {id: 'run', tx: 'Create 1,000 rows'},
      {id: 'runlots', tx: 'Create 10,000 rows'},
      {id: 'add', tx: 'child 1,000 rows'},
      {id: 'update', tx: 'Update every 10th row'},
      {id: 'clear', tx: 'Clear'},
      {id: 'swaprows', tx: 'Swap Rows'}
    ])
    this.update = null
  })
)

function handleClick(e) {
  var key = e.target.id,
      store = this.root.store
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
  this.root.refs.rows.update()
  time.stop()
}
