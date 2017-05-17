// @ts-check
/*eslint indent:0 quotes:0*/
import {element as el} from 'pico-dom'
import {menuTemplate} from './menu'
import {tableTemplate} from './table'
import {Store} from './store'

var TITLE = 'picoDOM v0.33.0',
    config = {common: {store: new Store}},
    table = tableTemplate.create(config)

config.common.table = table
table.update()

el('div', {attr: ['id', 'main']},
  el('div', {class: 'container'},
    el('div', {class: 'jumbotron'},
      el('div', {class: 'row'},
        el('div', {class: 'col-md-6'},
          el('h1', TITLE)
        ),
        el('div', {class: 'col-md-6'}, menuTemplate.create(config))
      )
    ),
    table,
    el('span', {class: 'preloadicon glyphicon glyphicon-remove', attr:'aria-hidden'})
  )
).create().moveTo(document.body)
