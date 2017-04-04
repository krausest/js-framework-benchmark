/*eslint indent:0 quotes:0*/
var pico = require('pico-dom'),
    time = require('./time')

var el = pico.element,
    co = pico.component,
    list = pico.list,
    extra = pico.extra

var store = null

var rows = list(co('tr', {
    extra: { key: -1, update: updateRow, init: function() { this.node.onclick = rowClickHandler } }
  }, [
    co('td.col-md-1', {
      extra: { init: function(v) { this.setText(v && v.id) } }
    }),
    co('td.col-md-4',
      co('a.lbl', {
        extra: { key: 'select', update: updateLabel }
      })
    ),
    el('td.col-md-1',
      el('a.remove',
        co('span.glyphicon.glyphicon-remove.remove[aria-hidden]', {
          extra: { key: 'delete' }
        })
      )
    ),
    el('td.col-md-6')
  ]),
  'id'
)

var table = module.exports = co('table.table.table-hover.table-striped.test-data',
  co('tbody#tbody', {
    extra: { update: function(str) {
      store = str
      this.update = function(s) { rows.update(s.data) } // run-once switcharoo
      this.update(store)
  }}},
  rows)
)

function updateLabel(v) {
  this.setText(v.label)
}
function updateRow(v) {
  var className = this.key === store.selected ? "danger" : ""
  if (this.node.className !== className) this.node.className = className
  this.updateChildren(v)
}
function rowClickHandler(e) {
  var key = extra.get(this).key,
      tgt = extra.get(e.target),
      act = tgt && tgt.key
  if (!act) return

  e.preventDefault()
  time.start(act)
  switch (act) {
    case 'select':
      store.select(key)
      break
    case 'delete':
      store.delete(key)
      break
  }
  table.update(store)
  time.stop()
}
