/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var el = require('attodom/el'),
    co = require('attodom/co'),
    root = require('attodom/root')

module.exports = function(rec) {
  var label = el('a', {class: 'lbl'}, rec.label)
  return co(el('tr'), {key: rec.id, update: updateRow, label: label},
    el('td', {class: 'col-md-1'}, rec.id),
    el('td', {class: 'col-md-4'}, label),
    el('td', {class: 'col-md-1'},
      el('a', {class: 'remove'},
        el('span', {class: 'glyphicon glyphicon-remove remove', 'aria-hidden': ''})
      )
    ),
    el('td', {class: 'col-md-6'})
  )
}

function updateRow(v) {
  this.label.textContent = v.label
  this.node.className = (this.key === root.store.selected) ? 'danger' : ''
}
