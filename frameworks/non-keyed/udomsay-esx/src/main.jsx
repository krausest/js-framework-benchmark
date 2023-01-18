// Fully readpted from Solid-js benchmarkk

import {createRender, effect, signal, batch} from 'udomsay/preact';
const render = createRender();

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: signal(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`)
    }
  }
  return data;
}

const Button = ({ id, text, fn }) => (
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>
);

const Table = () => (
  <table class='table table-hover table-striped test-data'>
    <tbody>{data.value.map(({id: rowId, label}, idx) => (
      <tr>
        <td class='col-md-1' textContent={rowId} />
        <td class='col-md-4'><a onClick={({currentTarget: t}) => { selected.value = t.closest('tr') }}>{ label }</a></td>
        <td class='col-md-1'><a onClick={() => { remove(idx) }}><span class='glyphicon glyphicon-remove' aria-hidden='true' /></a></td>
        <td class='col-md-6'/>
      </tr>
    ))}</tbody>
  </table>
);

const
  data = signal([]),
  selected = signal(null),
  run = () => { data.value = buildData(1000) },
  runLots = () => { data.value = buildData(10000) },
  add = () => { data.value = data.peek().concat(buildData(1000)) },
  update = () => batch(() => {
    for(let i = 0, d = data.peek(), len = d.length; i < len; i += 10)
      d[i].label.value += ' !!!';
  }),
  swapRows = () => {
    const d = data.peek().slice();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      data.value = d;
    }
  },
  clear = () => {
    selected.value = null;
    data.value = [];
  },
  remove = idx => {
    const d = data.peek();
    data.value = [...d.slice(0, idx), ...d.slice(idx + 1)];
  }
;

// handle danger case off the whole App
// as it makes no sense to loop over and over
// the same data to just switch a single class
// that cannot exist in more than two rows
let row = null;
effect(() => {
  const {value} = selected;
  if (value !== row) {
    if (row)
      row.classList.remove('danger');
    if (value)
      value.classList.add('danger');
    row = value;
  }
});

const App = () => (
  <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>udomsay-esx ☣ non-keyed</h1></div>
      <div class='col-md-6'><div class='row'>
      <Button id='run' text='Create 1,000 rows' fn={ run } />
      <Button id='runlots' text='Create 10,000 rows' fn={ runLots } />
      <Button id='add' text='Append 1,000 rows' fn={ add } />
      <Button id='update' text='Update every 10th row' fn={ update } />
      <Button id='clear' text='Clear' fn={ clear } />
      <Button id='swaprows' text='Swap Rows' fn={ swapRows } />
      </div></div>
    </div></div>
    <Table />
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true' />
  </div>
);

render(App, document.getElementById("main"));
