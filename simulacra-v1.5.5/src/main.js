'use strict'

var bindObject = require('simulacra')
var flow = bindObject.flow
var setDefault = bindObject.setDefault
var bindEvents = bindObject.bindEvents

var state = { rows: [] }

var binding = [ '#main', {
  rows: [ 'tr', {
    id: 'td:nth-of-type(1)',
    label: [ 'td:nth-of-type(2) a', flow(
      setDefault,
      bindEvents({
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
    ) ],
    isSelected: function (node, value) {
      node.className = value ? 'danger' : ''
    }
  }, bindEvents({
    click: function (event, path) {
      if (event.target.tagName === 'SPAN') {
        bench('delete', function () {
          var id = event.target.parentNode.parentNode
            .parentNode.childNodes[1].textContent

          path.target.rows.splice(path.target.rows.findIndex(function (obj) {
            return obj.id === id
          }), 1)
        })
      }
    }
  }) ]
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
    		a = Object.assign({}, state.rows[4])
  		  b = Object.assign({}, state.rows[9])
        Object.assign(state.rows[4], b)
        Object.assign(state.rows[9], a)
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
  requestAnimationFrame(function () {
    t1 = performance.now()
    console.log(label + ' took ' + (t1 - t0))
  })
}
