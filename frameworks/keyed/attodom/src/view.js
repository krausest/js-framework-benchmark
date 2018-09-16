/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var h = require('attodom/el'),
    list = require('attodom/list'),
    t = require('attodom/text')

var TITLE = 'attodom v0.9.0'

module.exports = function(store) {
  function clickHandlerMenu(e) {
    var key = e.target.id
    if (key) {
      e.preventDefault()
      store[key === 'runlots' ? 'runLots' : key === 'swaprows' ? 'swapRows' : key]()
      rows.update(store.data)
    }
  }
  function updateRow(v) {
    this.$label.data = v.label
    this.className = (this.id === store.selected) ? 'danger' : ''
  }
  function clickHandlerSelect(e) {
    e.preventDefault()
    store.select(this.parentNode.id)
    rows.update(store.data)
  }
  function clickHandlerDelete(e) {
    e.preventDefault()
    store.delete(+this.parentNode.id)
    rows.update(store.data)
  }

  var rows = list('id', function(rec) {
    var attr = {id: rec.id, update: updateRow, $label: t(rec.label)}
    return h('tr', attr,
      h('td', {class: 'col-md-1'}, rec.id),
      h('td', {class: 'col-md-4', onclick: clickHandlerSelect},
        h('a', {class: 'lbl'}, attr.$label)
      ),
      h('td', {class: 'col-md-1', onclick: clickHandlerDelete},
        h('a', {class: 'remove'},
          h('span', {class: 'glyphicon glyphicon-remove remove', 'aria-hidden': ''})
        )
      ),
      h('td', {class: 'col-md-6'})
    )
  })

  return h('div', {id: 'main', update: function() { rows.update(store.data) }},
    h('div', {class: 'container'},
      h('div', {class: 'jumbotron'},
        h('div', {class: 'row'},
          h('div', {class: 'col-md-6'},
            h('h1', TITLE)
          ),
          h('div', {class: 'col-md-6'},
            h('div', {class: 'row', onclick: clickHandlerMenu},
              button('run', 'Create 1,000 rows'),
              button('runlots', 'Create 10,000 rows'), //TODO error
              button('add', 'Append 1,000 rows'),
              button('update', 'Update every 10th row'),
              button('clear', 'Clear'),
              button('swaprows', 'Swap Rows')
            )
          )
        )
      ),
      h('table', {class: 'table table-hover table-striped test-data'},
        h('tbody', {id: 'tbody'}, rows)
      ),
      h('span', {class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': ''})
    )
  )
}

function button(id, tx) {
  return h('div', {class: 'col-sm-6 smallpad'},
    h('button', {id: id, class: 'btn btn-primary btn-block', type: 'button'}, tx)
  )
}
