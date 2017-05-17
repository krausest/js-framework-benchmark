/*eslint indent:0, quotes:0, no-multi-spaces:0 */
import {element as el} from 'pico-dom'
import time from './time'


var buttonTemplate = el('button', {
  attrs: {
    class: 'btn btn-primary btn-block',
    type: 'button'
  }
})


export var menuTemplate = el('div', {
    class: 'row',
    on: {click: handleClick}
  },
  buttonTemplate.config({attr: ['id', 'run'],      append: 'Create 1,000 rows'}),
  buttonTemplate.config({attr: ['id', 'runlots'],  append: 'Create 10,000 rows'}),
  buttonTemplate.config({attr: ['id', 'add'],      append: 'Append 1,000 rows'}),
  buttonTemplate.config({attr: ['id', 'update'],   append: 'Update every 10th row'}),
  buttonTemplate.config({attr: ['id', 'clear'],    append: 'Clear'}),
  buttonTemplate.config({attr: ['id', 'swaprows'], append: 'Swap Rows'})
)

function handleClick(e) {
  var key = e.target.id,
      store = this.common.store
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
  this.common.table.update()
  time.stop()
}
