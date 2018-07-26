/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var list = require('attodom/list'),
    el = require('attodom/el'),
    update = require('attodom/update'),
    createRow = require('./create-row'),
    core = require('attodom/core'),
    time = require('./time')

var rows = list(createRow, function(v) { return v.id })

core.update = function() {
  //@ts-ignore
  update(rows, core.store.data)
}

module.exports = el('table', {class: 'table table-hover table-striped test-data'},
  el('tbody', {id: 'tbody', onclick: clickHandler}, rows)
)

function clickHandler(e) {
  var tgt = e.target,
      act = tgt.className === 'lbl' ? 'select' : tgt.classList.contains('remove') ? 'delete' : ''

  while ((tgt = tgt.parentNode)) if (tgt.tagName === 'TR') break
  if (!act || !tgt) return

  var key = +tgt.firstChild.textContent
  e.preventDefault()
  time.start(act)
  core.store[act](key)
  core.update()
  time.stop()
}
