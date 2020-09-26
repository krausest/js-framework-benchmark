import { ref } from "@vue/reactivity";
import { render, map } from 'vuerx-jsx';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const label = `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`;
    data[i] = {
      id: idCounter++,
      label
    }
  }
  return data;
}

const Button = ({ id, text, fn }) =>
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>

const App = () => {
  const data = ref([]),
    selected = ref(null);

  const list = map(() => data.value, row => {
    const rowId = row.id;
    return <tr class={selected.value === rowId ? "danger" : ""}>
      <td class='col-md-1' textContent={ rowId } />
      <td class='col-md-4'><a onClick={[setSelected, rowId]} textContent={ row.label } /></td>
      <td class='col-md-1'><a onClick={[remove, rowId]}><span class='glyphicon glyphicon-remove' aria-hidden="true" /></a></td>
      <td class='col-md-6'/>
    </tr>
  })

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>VueRX JSX Keyed</h1></div>
      <div class='col-md-6'><div class='row'>
        <Button id='run' text='Create 1,000 rows' fn={ run } />
        <Button id='runlots' text='Create 10,000 rows' fn={ runLots } />
        <Button id='add' text='Append 1,000 rows' fn={ add } />
        <Button id='update' text='Update every 10th row' fn={ update } />
        <Button id='clear' text='Clear' fn={ clear } />
        <Button id='swaprows' text='Swap Rows' fn={ swapRows } />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody>
      {list}
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>;

  function setSelected(id) { selected.value = id; }

  function remove(id) {
    const d = data.value.slice();
    d.splice(d.findIndex(d => d.id === id), 1);
    data.value = d;
  }

  function run() {
    data.value = buildData(1000);
    selected.value = null;
  }

  function runLots() {
    data.value = buildData(10000);
    selected.value = null;
  }

  function add() { data.value = data.value.concat(buildData(1000)); }

  function update() {
    const d = data.value;
    let index = 0;
    while (index < d.length) {
      d[index].label += ' !!!';
      index += 10;
    }
  }

  function swapRows() {
    const d = data.value.slice();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      data.value = d;
    }
  }

  function clear() {
    data.value = [];
    selected.value = null;
  }
}

render(App, document.getElementById("main"));
