'use strict'

var bindObject = require('simulacra')
var bindEvents = bindObject.bindEvents

var state = { rows: [] }

var labelEvents = bindEvents({
  click: function (event, path) {
    bench('select', function () {
      var i = 0, j = path.root.rows.length

      for (; i < j; i++)
        if (path.root.rows[i].isSelected)
          path.root.rows[i].isSelected = false

      path.target.isSelected = true
    })
  }
})

var binding = [ '#main', {
  rows: [ 'tr', {
    id: 'td:nth-of-type(1)',
    label: [ 'td:nth-of-type(2) a', function (node, value) {
      labelEvents.apply(null, arguments)
      return value
    } ],
    isSelected: function (node, value) {
      node.className = value ? 'danger' : ''
    }
  }, function (node) {
    bindEvents({
      click: function (event, path) {
        if (event.target.tagName === 'SPAN') {
          bench('delete', function () {
            var id = node.querySelector('td:nth-of-type(1)').textContent

            path.root.rows.splice(path.root.rows.findIndex(function (obj) {
              return obj.id === id
            }), 1)
          })
        }
      }
    }).apply(null, arguments)
  } ]
} ]

var methods = {
  run: create('run', 1000),
  add: function () {
    bench('add', function () {
      state.rows.push.apply(state.rows, buildData(1000))
    })
  },
  runlots: create('runLots', 10000),
  update: function () {
    bench('update', function () {
      var i

      for (i = 0; i < state.rows.length; i++)
        if (i % 10 === 0) state.rows[i].label += ' !!!'
    })
  },
  swaprows: function () {
    bench('swapRows', function () {
      var a, b

    	if (state.rows.length > 10) {
        a = Object.assign({}, state.rows[1])
  		  b = Object.assign({}, state.rows[998])
        Object.assign(state.rows[1], b)
        Object.assign(state.rows[998], a)
    	}
    })
  },
  clear: function () {
    bench('clear', function () {
      state.rows = []
    })
  }
}

document.body.appendChild(bindObject(state, binding))
document.body.addEventListener('click', function (event) {
  var id = event.target.id
  if (id) methods[id]()
})

var adjectives = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
  "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
  "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap",
  "expensive", "fancy"
]

var colours = [
  "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
  "white", "black", "orange"
]

var nouns = [
  "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
  "sandwich", "burger", "pizza", "mouse", "keyboard"
]

var id = 0

function create (label, number) {
  return function () {
    bench(label, function () {
      var i = 0, data = buildData(number)

      for (; i < number; i++) {
        if (i < state.rows.length) {
          state.rows[i].id = data[i].id
          state.rows[i].label = data[i].label
        }
        else state.rows.push(data[i])
      }

      state.rows.splice(number, state.rows.length - number)
    })
  }
}

function random (max) {
  return Math.round(Math.random() * 1000) % max
}

function buildData (count) {
  var data = [], i

  for (i = 0; i < count; i++) {
    id++
    data.push({
      id: '' + id,
      label:
        adjectives[random(adjectives.length)] + " " +
        colours[random(colours.length)] + " " +
        nouns[random(nouns.length)]
    })
  }

  return data
}

function bench (label, fn) {
  var t0 = performance.now(), t1
  fn()
  window.setTimeout(function () {
    t1 = performance.now()
    console.log(label + ' took ' + (t1 - t0))
  }, 0);
}
