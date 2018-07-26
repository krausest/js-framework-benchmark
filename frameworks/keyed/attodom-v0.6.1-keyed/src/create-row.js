/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var el = require('attodom/el'),
    core = require('attodom/core')

module.exports = function(rec) {
  return el('tr', {id: rec.id},
    updateRow,
    el('td', {class: 'col-md-1'}, rec.id),
    el('td', {class: 'col-md-4'}, el('a', {class: 'lbl'}, rec.label)),
    el('td', {class: 'col-md-1'},
      el('a', {class: 'remove'},
        el('span', {class: 'glyphicon glyphicon-remove remove', 'aria-hidden': ''})
      )
    ),
    el('td', {class: 'col-md-6'})
  )
}

function updateRow(tr, v) {
  tr.firstChild.nextSibling.firstChild.textContent = v.label
  tr.className = (tr.id === ''+core.store.selected) ? 'danger' : ''
}
