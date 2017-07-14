/*eslint indent:0, quotes:0, no-multi-spaces:0 */
import {template, list, find, element as el} from 'pico-dom'
import time from './time'

var rowTemplate = el('tr')
.event('click', rowClickHandler)
.extra('update', function(v) {
  this.node.className = (this.key === this.root.store.selected) ? "danger" : ""
  this.updateChildren(v)
})
.append(
  el('td').class('col-md-1').extra('update', function(v) {
    this.text(v.id)
    this.update = null
  }),
  el('td', {class: 'col-md-4'},
    el('a').class('lbl')
    .extra('update', function (v) { this.text(v.label) })
    .extra('key', 'select')
  ),
  el('td', {class: 'col-md-1'},
    el('a', {class: 'remove'},
      el('span')
      .class('glyphicon glyphicon-remove remove')
      .attr('aria-hidden')
      .extra('key', 'delete')
    )
  ).extra('update', null),
  template(
    el('td', {class: 'col-md-6'}).create().node // pre-create static branch
  ).extra('update', null)
)

export var tableTemplate = el('table', {class: 'table table-hover table-striped test-data'},
  el('tbody')
  .attr('id', 'tbody')
  .extra('update', null) //TODO
  .append(
    list(rowTemplate).call(function() {
      this.getKey = function(v) { return v.id }
      this.root.refs.rows = this
      this.update = function() { this.updateChildren(this.root.store.data) }
    })
  )
)


function rowClickHandler(e) {
  var key = this.key,
      comp = find(e.target),
      act = comp && comp.key,
      store = this.root.store
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
  this.root.refs.rows.update()
  time.stop()
}
