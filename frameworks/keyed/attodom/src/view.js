/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/
var h = require('attodom/el'),
    list = require('attodom/list')

var TITLE = 'attodom v0.12.0',
    selected = null

module.exports = function(store) {
  function clickHandlerMenu(e) {
    var key = e.target.id
    if (key) {
      e.preventDefault()
      store[key === 'runlots' ? 'runLots' : key === 'swaprows' ? 'swapRows' : key]()
      if (!store.selected && selected) {
        selected.className = ''
        selected = null
      }
      rowList.update(store.data)
    }
  }

  function updateRow(v) {
    this.$label.data = v.label
  }

  function makeRow(rec) {
    var $label
    var row = h('tr',
      h('td', {class: 'col-md-1'}, rec.id),
      h('td', {class: 'col-md-4', onClick: clickHandlerSelect},
        h('a', {class: 'lbl'}, $label = document.createTextNode(rec.label))
      ),
      h('td', {class: 'col-md-1', onClick: clickHandlerDelete},
        h('a', {class: 'remove'},
          h('span', {class: 'glyphicon glyphicon-remove remove', 'aria-hidden': 'true'})
        )
      ),
      h('td', {class: 'col-md-6'})
    )
    row.id = rec.id
    row.update = updateRow
    row.$label = $label
    return row
  }

  function clickHandlerSelect(e) {
    e.preventDefault()
    store.select(this.parentNode.id)
    if (selected) selected.className = ''
    selected = this.parentNode
    selected.className = 'danger'
  }

  function clickHandlerDelete(e) {
    var row = this.parentNode
    e.preventDefault()
    row.parentNode.removeChild(row)
    store.delete(+row.id)
  }

  var rowList = list(h('tbody', {id: 'tbody'}), makeRow, {key: 'id'})

  return h('div', {id: 'main', update: function() { rowList.update(store.data) }},
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
      h('table', {class: 'table table-hover table-striped test-data'}, rowList.parent),
      h('span', {class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': ''})
    )
  )
}

function button(id, tx) {
  return h('div', {class: 'col-sm-6 smallpad'},
    h('button', {id: id, class: 'btn btn-primary btn-block', type: 'button'}, tx)
  )
}
