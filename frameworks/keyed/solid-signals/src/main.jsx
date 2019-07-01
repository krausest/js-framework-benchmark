import { createRoot, createSignal, freeze, selectWhen } from 'solid-js'

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const [label, setLabel] = createSignal(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`);
    data[i] = {
      id: idCounter++,
      label, setLabel
    }
  }
  return data;
}

const Button = ({ id, text, fn }) =>
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>

const App = () => {
  const [data, setData] = createSignal([]),
    [selected, setSelected] = createSignal(null, (a, b) => a === b);

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>SolidJS Keyed</h1></div>
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
      <$ each={ data() } afterRender={ selectWhen(selected, 'danger') }>{ row =>
        <tr model={ row.id }>
          <td class='col-md-1' textContent={ row.id } />
          <td class='col-md-4'><a onClick={ select }>{ row.label }</a></td>
          <td class='col-md-1'><a onClick={ remove }><span class='glyphicon glyphicon-remove' aria-hidden='true'/></a></td>
          <td class='col-md-6'/>
        </tr>
      }</$>
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>

  function select(e, id) { setSelected(id); }

  function remove(e, id) {
    const d = data();
    d.splice(d.findIndex(d => d.id === id), 1);
    setData(d);
  }

  function run() {
    freeze(() => {
      setData(buildData(1000));
      setSelected(null);
    });
  }

  function runLots() {
    freeze(() => {
      setData(buildData(10000));
      setSelected(null);
    });
  }

  function add() { setData(data().concat(buildData(1000))); }

  function update() {
    freeze(() => {
      const d = data();
      let index = 0;
      while (index < d.length) {
        d[index].setLabel(d[index].label() + ' !!!');
        index += 10;
      }
    });
  }

  function swapRows() {
    const d = data();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      setData(d);
    }
  }

  function clear() {
    freeze(() => {
      setData([]);
      setSelected(null);
    });
  }
}

createRoot(() => document.getElementById("main").appendChild(<App />))
