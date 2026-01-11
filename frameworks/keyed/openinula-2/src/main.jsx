import { render } from '@openinula/next';

let idCounter = 1;

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
];

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
    };
  }
  return data;
}

function Button({ id, text, fn }) {
  return (
    <div class="col-sm-6 smallpad">
      <button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>
        {text}
      </button>
    </div>
  );
}

function App() {
  let data = [];
  let selected = null;

  function run() {
    data = buildData(1000);
  }

  function runLots() {
    data = buildData(10000);
  }

  function add() {
    data.push(...buildData(1000));
  }

  function update() {
    for (let i = 0; i < data.length; i += 10) {
      data[i].label += ' !!!';
    }
  }

  function swapRows() {
    if (data.length > 998) {
      [data[1], data[998]] = [data[998], data[1]];
    }
  }

  function clear() {
    data = [];
  }

  function remove(id) {
    data = data.filter(d => d.id !== id);
  }

  function select(id) {
    selected = id;
  }

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Inula-next Keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <for each={data}>
            {({ id, label }) => (
              <tr key={id} className={selected === id ? 'danger' : ''}>
                <td className="col-md-1" textContent={id} />
                <td className="col-md-4">
                  <a onClick={select.bind(this, id)} textContent={label} />
                </td>
                <td className="col-md-1">
                  <a onClick={remove.bind(this, id)}>
                    <span className="glyphicon glyphicon-remove" aria-hidden="true" />
                  </a>
                </td>
                <td className="col-md-6" />
              </tr>
            )}
          </for>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}

render(App(), document.getElementById('main'));
