/*eslint indent:0 quotes:0*/
var el = require('pico-dom').element,
    menu = require('./menu'),
    table = require('./table'),
    Store = require('./store')

var title = 'picoDom-keyed',
    store = new Store()

el(document.body,
  el('div#main',
    el('div.container',
      el('div.jumbotron',
        el('div.row',
          el('div.col-md-6',
            el('h1', title)
          ),
          el('div.col-md-6', menu)
        )
      ),
      table,
      el('span.preloadicon.glyphicon.glyphicon-remove[aria-hidden]')
    )
  )
)
menu.update(store)
