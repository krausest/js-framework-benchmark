import { useState } from 'octane';

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
  'fancy'
];
const colours = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange'
];
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
  'keyboard'
];

function random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

interface Row {
  id: number;
  label: string;
}

let rowId = 1;

function buildData(count = 1000): Row[] {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: rowId++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`,
    };
  }
  return data;
}

export default function App() @{
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<number | undefined>(undefined);

  const add = () => {
    setItems((current) => current.concat(buildData(1000)));
  };

  const clear = () => {
    setItems([]);
  };

  const partialUpdate = () => {
    setItems((current) => {
      const clone = current.slice();
      for (let i = 0; i < clone.length; i += 10) {
        const row = clone[i];
        clone[i] = {
          id: row.id,
          label: row.label + ' !!!',
        };
      }
      return clone;
    });
  };

  const remove = (row: Row) => {
    setItems((current) => {
      const clone = current.slice();
      clone.splice(clone.indexOf(row), 1);
      return clone;
    });
  };

  const run = () => {
    setItems(buildData(1000));
  };

  const runLots = () => {
    setItems(buildData(10000));
  };

  const swapRows = () => {
    setItems((current) => {
      if (current.length <= 998) {
        return current;
      }
      const clone = current.slice();
      const tmp = clone[1];
      clone[1] = clone[998];
      clone[998] = tmp;
      return clone;
    });
  };

  const select = (id: number) => {
    setSelected(id);
  };

  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Octane</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="run" onClick={run}>
                Create 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="runlots" onClick={runLots}>
                Create 10,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="add" onClick={add}>
                Append 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="update" onClick={partialUpdate}>
                Update every 10th row
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="clear" onClick={clear}>
                Clear
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="swaprows" onClick={swapRows}>
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>
        @for (const row of items; key row.id) {
          const id = row.id;

          <tr class={selected === id ? 'danger' : ''}>
            <td class="col-md-1">{id as string}</td>
            <td class="col-md-4">
              <a onClick={() => select(id)}>{row.label as string}</a>
            </td>
            <td class="col-md-1">
              <a onClick={() => remove(row)}>
                <span class="glyphicon glyphicon-remove" aria-hidden="true" />
              </a>
            </td>
            <td class="col-md-6" />
          </tr>
        }
      </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
}
