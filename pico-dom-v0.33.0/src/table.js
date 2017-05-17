/*eslint indent:0, quotes:0, no-multi-spaces:0 */
import {list, find, element as el} from 'pico-dom'
import time from './time'

var rowTemplate = el('tr', {
    on: {click: rowClickHandler},
    update: function(v) {
      this.node.className = (this.key === this.common.store.selected) ? "danger" : ""
      this.updateChildren(v)
    }
  },
  el('td', {
    class: 'col-md-1',
    update: function(v) { this.text(v.id) }
  }),
  el('td', {class: 'col-md-4'},
    el('a', {
      class: 'lbl',
      key: 'select',
      update: function (v) { this.text(v.label) }
    })
  ),
  el('td', {class: 'col-md-1'},
    el('a', {class: 'remove'},
      el('span', {
        class: 'glyphicon glyphicon-remove remove',
        attr: 'aria-hidden',
        key: 'delete'
      })
    )
  ),
  el('td', {class: 'col-md-6'})
)

export var tableTemplate = el('table', {class: 'table table-hover table-striped test-data'},
  el('tbody', {
      attr: ['id', 'tbody'],
      update: function() { this.updateChildren(this.common.store.data) }
    },
    list(rowTemplate, {
      getKey: function(v) { return v.id }
    })
  )
)


function rowClickHandler(e) {
  var key = this.key,
      comp = find(e.target),
      act = comp && comp.key
  if (!act) return

  e.preventDefault()
  time.start(act)
  switch (act) {
    case 'select':
      this.common.store.select(key)
      break
    case 'delete':
      this.common.store.delete(key)
      break
  }
  this.common.table.update()
  time.stop()
}
