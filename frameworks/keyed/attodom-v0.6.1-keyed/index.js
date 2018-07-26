/*eslint indent: ["warn", 2, { "VariableDeclarator": 2 }]*/

var el = require('attodom/el'),
    core = require('attodom/core'),
    Store = require('./src/store'),
    menu = require('./src/menu'),
    table = require('./src/table')

core.store = new Store
core.update()

document.body.appendChild(
  el('div', {id: 'main'},
    el('div', {class: 'container'},
      menu,
      table,
      el('span', {class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': ''})
    )
  )
)
