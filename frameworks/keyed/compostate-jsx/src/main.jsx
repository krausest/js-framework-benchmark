import {
  render,
} from 'compostate-jsx';
import {
  atom,
  map,
  selector,
} from 'compostate';

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
      label: atom(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`)
    };
  }
  return data;
}

const Button = ({ id, text, fn }) => (
  <div class='col-sm-6 smallpad'>
    <button id={id} class='btn btn-primary btn-block' type='button' onClick={fn}>
      {text}
    </button>
  </div>
);

const Main = () => {
  const data = atom([]);
  const selected = atom(null);
  function run() {
    data(buildData(1000));
  }
  function runLots() {
    data(buildData(10000));
  }
  function add() {
    data([...data(), ...buildData(1000)]);
  }
  function update() {
    const state = data();
    for (let i = 0, len = state.length; i < len ; i += 10) {
      const { label } = state[i];
      label(label() + ' !!!');
    }
  }
  function swapRows() {
    const newData = data().slice();
    if (newData.length > 998) {
      let tmp = newData[1];
      newData[1] = newData[998];
      newData[998] = tmp;
      data(newData);
    }
  }
  function clear() {
    data([]);
  }
  function remove(id) {
    const state = data();
    const idx = state.findIndex(d => d.id === id);
    data([...state.slice(0, idx), ...state.slice(idx + 1)]);
  }
  function select(id) {
    selected(id);
  }
  const isSelected = selector(() => selected());

  return (
    <div class='container'>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'>
            <h1>compostate-jsx</h1>
          </div>
          <div class='col-md-6'>
            <div class='row'>
              <Button id='run' text='Create 1,000 rows' fn={run} />
              <Button id='runlots' text='Create 10,000 rows' fn={runLots} />
              <Button id='add' text='Append 1,000 rows' fn={add} />
              <Button id='update' text='Update every 10th row' fn={update} />
              <Button id='clear' text='Clear' fn={clear} />
              <Button id='swaprows' text='Swap Rows' fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class='table table-hover table-striped test-data'>
        <tbody>
          {map(() => data(), () => (row) => {
            const rowId = row.id;
            return (
              <tr class={isSelected(rowId) ? 'danger' : ''}>
                <td class='col-md-1' textContent={rowId} />
                <td class='col-md-4'>
                  <a onClick={[select, rowId]} textContent={row.label()} />
                </td>
                <td class='col-md-1'>
                  <a onClick={[remove, rowId]}>
                    <span class='glyphicon glyphicon-remove' aria-hidden="true" />
                  </a>
                </td>
                <td class='col-md-6'/>
              </tr>
            );
          })}
        </tbody>
      </table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
    </div>
  );
}

const root = document.getElementById('root');

if (root) {
  render(() => <Main />, root);
}