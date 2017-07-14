// @ts-check
/*eslint indent:0 quotes:0*/
import {element as el} from 'pico-dom'
import {menuTemplate} from './menu'
import {tableTemplate} from './table'
import {Store} from './store'

var TITLE = 'picoDOM v1.0.0'

el('div', {attrs: {id: 'main'}},
  el('div', {class: 'container'},
    el('div', {class: 'jumbotron'},
      el('div', {class: 'row'},
        el('div', {class: 'col-md-6'},
          el('h1', TITLE)
        ),
        el('div', {class: 'col-md-6'}, menuTemplate)
      )
    ),
    tableTemplate,
    el('span', {class: 'preloadicon glyphicon glyphicon-remove', attr:'aria-hidden'})
  )
)
.create()
.extra('store', new Store)
.update()
.moveTo(document.body)
