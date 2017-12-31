/*eslint indent:0, quotes:0, no-multi-spaces:0 */
var list = require('attodom/list'),
    find = require('attodom/find'),
    el = require('attodom/el'),
    time = require('./time')

var emptyCell = el('td').a('class', 'col-md-6').node

function updateLabel(v) { this.p('textContent', v.label) }

function updateRow(v) {
  this.node.className = (this.key === this.store.selected) ? "danger" : ""
  this.updateChildren(v)
}

module.exports = function(store) {
  function rowFactory(key) {
    return el('tr')
    .c('key', key)
    .c('store', store)
    .c('update', updateRow)
    .append(
      el('td').a('class', 'col-md-1').append(key).node,
      el('td').a('class', 'col-md-4').append(
        el('a').a('class', 'lbl')
        .c('update', updateLabel)
        .c('act', 'select')
        .c('key', key)
      ),
      el('td').a('class', 'col-md-1').append(
        el('a').a('class', 'remove').append(
          el('span').a('class', 'glyphicon glyphicon-remove remove')
          .a('aria-hidden')
          .c('act', 'delete')
          .c('key', key)
        )
      ),
      emptyCell.cloneNode(false)
    )
  }

  var rows = list(rowFactory, function(v) { return v.id })

  function rowClickHandler(e) {
    var comp = find(e.target),
        key = comp && comp.key,
        act = comp && comp.act
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
    rows.update(store.data)
    time.stop()
  }

  return el('table').a('class', 'table table-hover table-striped test-data').append(
    el('tbody').a('id', 'tbody')
    .append(rows)
    .on('click', rowClickHandler)
  ).c('update', function() {
    rows.update(store.data)
    return this
  })
}
