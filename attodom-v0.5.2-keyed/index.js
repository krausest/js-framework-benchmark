/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/

var el = require('attodom/el'),
    root = require('attodom/root'),
    Store = require('./src/store'),
    menu = require('./src/menu'),
    table = require('./src/table')

root.store = new Store
root.update()

document.body.appendChild(
  el('div', {id: 'main'},
    el('div', {class: 'container'},
      menu,
      table,
      el('span', {class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': ''})
    )
  )
)
