import {h, clobber} from 'bdc';

var TITLE = 'bdc v0.3.0'

var ADJECTIVES = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
  "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
  "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap",
  "expensive", "fancy"
];

var COLOURS = [
  "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white",
  "black", "orange"
];

var NOUNS = [
  "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich",
  "burger", "pizza", "mouse", "keyboard"
]

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function choice(array) {
  return array[random(array.length)];
}

let data = []
let selected = null
let next_id = 1

function buildData(count) {
  var data = [];
  for (var i=0; i < count; ++i) {
    const adjective = choice(ADJECTIVES);
    const colour = choice(COLOURS);
    const noun = choice(NOUNS);
    data.push({id: next_id++, label: `${adjective} ${colour} ${noun}`});
  }
  return data;
}

function select(id) {
  selected = id;
}

function remove(id) {
  data = data.filter(d => d.id != id);
}

function onClickRun(evt) {
  evt.preventDefault()
  data = buildData(1000);
  selected = null;
  redraw();
}

function onClickRunLots(evt) {
  evt.preventDefault();
  data = buildData(10000);
  selected = null;
  redraw();
}

function onClickAdd(evt) {
  evt.preventDefault();
  data = data.concat(buildData(1000));
  selected = null;
  redraw();
}

function onClickUpdate(evt) {
  evt.preventDefault();
  for (let i = 0; i < data.length; i+=10) {
    data[i].label += ' !!!';
  }
  selected = null;
  redraw();
}

function onClickClear(evt) {
  evt.preventDefault();
  data = [];
  selected = null;
  redraw();
}

function onClickSwapRows(evt) {
  evt.preventDefault();
  if (data.length > 998) {
    var a = data[1];
    data[1] = data[998];
    data[998] = a;
  }
  redraw();
}

function button(attrs, text) {
  return h('div', {class: 'col-sm-6 smallpad'},
    h('button', {
      class: 'btn btn-primary btn-block',
      type: 'button',
      ...attrs
    }, text),
  );
}

function renderButtons() {
  return [
    button({id: 'run', onclick: onClickRun}, 'Create 1,000 rows'),
    button({id: 'runlots', onclick: onClickRunLots}, 'Create 10,000 rows'),
    button({id: 'add', onclick: onClickAdd}, 'Append 1,000 rows'),
    button({id: 'update', onclick: onClickUpdate}, 'Update every 10th row'),
    button({id: 'clear', onclick: onClickClear}, 'Clear'),
    button({id: 'swaprows', onclick: onClickSwapRows}, 'Swap Rows'),
  ];
}

function renderRow(rec) {
  const id = rec.id;
  
  function onClickLabel(evt) {
    evt.preventDefault();
    select(id);
    redraw();
  }
  
  function onClickRemove(evt) {
    evt.preventDefault();
    remove(id);
    redraw();
  }
  
  return h(
    'tr', {
      'class': id === selected ? 'danger':''
    },
    h('td', {class: 'col-md-1'}, "" + id),
    h('td', {class: 'col-md-4', onclick: onClickLabel},
      h('a', {class: 'lbl'}, rec.label)
    ),
    h('td', {class: 'col-md-1', onclick: onClickRemove},
      h('a', {class: 'remove'},
        h('span', {class: 'glyphicon glyphicon-remove remove', 'aria-hidden': 'true'})
      )
    ),
    h('td', {class: 'col-md-6'})
  );
}

function render() {
  return h('div', {id: 'main'},
    h('div', {class: 'container'},
      h('div', {class: 'jumbotron'},
        h('div', {class: 'row'},
          h('div', {class: 'col-md-6'},
            h('h1', TITLE)
          ),
          h('div', {class: 'col-md-6'},
            h('div', {class: 'row'}, renderButtons()),
          )
        )
      ),
      h('table', {class: 'table table-hover table-striped test-data'}, 
        h('tbody', {id: 'tbody'}, data.map(renderRow)),
      ),
      h('span', {class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': ''})
    )
  );
}

let $root;
let redrawQueued = false;

function redraw() {
  if (!redrawQueued) {
    redrawQueued = true;
    window.requestAnimationFrame(() => {
      redrawQueued = false;
      clobber($root, render());
    });
  }
}

export function install($newRoot) {
  $root = $newRoot;
  redraw();
}
