import s2 from './main.min.js'
//s2.debug=true
cleanupTemplates();

var state = {
  rows: [],
  run: create('run', 1000),
  add: function () {
    bench('add', function () {
      proxy.rows.push(...buildData(1000))
    })
  },
  runlots: create('runLots', 10000),
  update: function () {
    bench('update', function () {
      var i

      for (i = 0; i < proxy.rows.length; i++)
        if (i % 10 === 0) proxy.rows[i].label += ' !!!'
    })
  },
  swaprows: function () {
    bench('swapRows', function () {
      var a

      if (proxy.rows.length > 998) {
        a = proxy.rows[1]
        proxy.rows[1] = proxy.rows[998]
        proxy.rows[998] = a
      }
    })
  },
  clear: function () {
    bench('clear', function () {
      proxy.rows = []
    })
  }
}

function remove () {
  var i = proxy.rows.indexOf(this);
  delete proxy.rows[i];
}

function select () {
  var selected = proxy.rows.find(row => row.cls === 'danger');
  if (selected) selected.cls = '';

  this.cls = 'danger';
}

const [node, proxy] = s2(state, document.querySelector('#main'))
document.body.appendChild(node)
window.p = proxy

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
      proxy.rows = buildData(number)
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
      cls: '',
      label:
        adjectives[random(adjectives.length)] + " " +
        colours[random(colours.length)] + " " +
        nouns[random(nouns.length)],
      select,
      remove,
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

// This isn't entirely necessary but removes empty text nodes as an optimization.
function cleanupTemplates() {
  document.querySelectorAll('template').forEach(function(template) {
    var iter = document.createNodeIterator(template.content, NodeFilter.SHOW_TEXT);
    var node;
    while (node = iter.nextNode()) {
      if (!node.nodeValue.trim().length)
        node.remove();
    }
  });
}
