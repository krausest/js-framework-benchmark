import { render } from 'million';

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = [
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
const C = [
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
  'orange',
];
const N = [
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

let nextId = 1;
const generate = () => {
  return {
    id: nextId++,
    label: `${A[random(A.length)]} ${C[random(C.length)]} ${
      N[random(N.length)]
    }`,
  };
};

const list = [];
let selected = 0;

const clear = () => {
  selected = 0;
  list.splice(0, list.length);
  rerender();
};

const append = (count) => {
  for (let i = 0; i < count; i++) {
    list.push(generate());
  }
  rerender();
};

const create1k = () => {
  clear();
  append(1000);
  rerender();
};

const create10k = () => {
  clear();
  append(10000);
  rerender();
};

const append1k = () => {
  append(1000);
  rerender();
};

const updateEvery10 = () => {
  for (let i = 0; i < list.length; i += 10) {
    const item = list[i];
    list[i] = { id: item.id, label: item.label + ' !!!' };
  }
  rerender();
};

const swapRows = () => {
  if (list.length >= 999) {
    list.splice(1, 1, list.splice(998, 1, list[1])[0]);
  }
  rerender();
};

const remove = (id) => {
  list.splice(
    list.findIndex((z) => z.id === id),
    1
  );
  rerender();
};

function rerender() {
  render(
    document.getElementById('main'),
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div class="col-md-6">
            <h1>Million</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="run"
                  onClick={() => {
                    create1k();
                  }}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="runlots"
                  onClick={() => {
                    create10k();
                  }}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="add"
                  onClick={() => {
                    append1k();
                  }}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="update"
                  onClick={() => {
                    updateEvery10();
                  }}
                >
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="clear"
                  onClick={() => {
                    clear();
                  }}
                >
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="swaprows"
                  onClick={() => {
                    swapRows();
                  }}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          {list.map((item) => (
            <Row item={item} selected={selected} remove={remove} />
          ))}
        </tbody>
      </table>
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
}

function Row({ item, selected, remove }) {
  return (
    <tr className={selected === item.id ? 'danger' : ''}>
      <td class="col-md-1">{item.id}</td>
      <td class="col-md-4">
        <a
          onClick={() => {
            selected = item.id;
            rerender();
          }}
        >
          {item.label}
        </a>
      </td>
      <td class="col-md-1">
        <a
          onClick={() => {
            remove(item.id);
          }}
        >
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6" />
    </tr>
  );
}

rerender();
