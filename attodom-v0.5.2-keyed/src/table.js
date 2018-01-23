/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var list = require('attodom/list'),
    el = require('attodom/el'),
    co = require('attodom/co'),
    createRow = require('./create-row'),
    root = require('attodom/root'),
    time = require('./time')

var body = co(el('tbody', {id: 'tbody', onclick: clickHandler}),
  list(createRow, function(v) { return v.id })
)

root.update = function() {
  body.update(root.store.data)
}

module.exports = el('table', {class: 'table table-hover table-striped test-data'}, body)


function clickHandler(e) {
  var tgt = e.target,
      act = tgt.className === 'lbl' ? 'select' : tgt.classList.contains('remove') ? 'delete' : ''

  while ((tgt = tgt.parentNode)) if (tgt.tagName === 'TR') break
  if (!act || !tgt) return

  var key = +tgt.firstChild.textContent
  e.preventDefault()
  time.start(act)
  root.store[act](key)
  root.update()
  time.stop()
}
