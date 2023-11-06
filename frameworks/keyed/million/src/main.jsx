import { block, mapArray } from 'million';

// prettier-ignore
const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
// prettier-ignore
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
// prettier-ignore
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
let list = [];
let selected = 0;
let main;

const clear = () => {
  list = [];
  main.x();
};

const buildData = (count) => {
  const data = new Array(count);
  for (let i = 0; i < count; ++i) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${
        colors[random(colors.length)]
      } ${nouns[random(nouns.length)]}`,
    };
  }
  return data;
};

const create1k = () => {
  if (list.length) clear();
  list = buildData(1000);
  update();
  return false;
};

const create10k = () => {
  if (list.length) clear();
  list = buildData(10000);
  update();
  return false;
};

const append1k = () => {
  list = list.concat(buildData(1000));
  update();
  return false;
};

const updateEvery10 = () => {
  let i = 0;
  while (i < list.length) {
    list[i].label = `${list[i].label} !!!`;
    i += 10;
  }
  update();
  return false;
};

const swapRows = () => {
  if (list.length > 998) {
    const item = list[1];
    list[1] = list[998];
    list[998] = item;
  }
  update();
  return false;
};

const select = (id) => {
  selected = id;
  update();
};

const remove = (id) => {
  const index = list.findIndex((item) => item.id === id);
  list.splice(index, 1);
  main.b[index].x();
  main.b.splice(index, 1);
};

const Main = block(({ rows }) => (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
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
                onClick={create1k}
              >
                Create 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="runlots"
                onClick={create10k}
              >
                Create 10,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="add"
                onClick={append1k}
              >
                Append 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="update"
                onClick={updateEvery10}
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
                  update();
                  return false;
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
                onClick={swapRows}
              >
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody
        onClick={(event) => {
          const el = event.target;
          const id = Number(el.closest('tr').firstChild.textContent);
          if (el.matches('.glyphicon-remove')) {
            remove(id);
          } else {
            select(id);
          }
          return false;
        }}
      >
        {rows}
      </tbody>
    </table>
    <span
      class="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    ></span>
  </div>
));

const Row = block(({ className, id, label }) => (
  <tr class={className}>
    <td class="col-md-1">{id}</td>
    <td class="col-md-4">
      <a>{label}</a>
    </td>
    <td class="col-md-1">
      <a>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
));

Main({ rows: (main = mapArray([])) }, null, null).m(
  document.getElementById('main')
);

const shouldUpdate = (oldProps, newProps) => {
  return (
    oldProps.label !== newProps.label ||
    oldProps.className !== newProps.className
  );
};

function update() {
  main.p(
    mapArray(
      list.map((item) =>
        Row(
          {
            id: item.id,
            label: item.label,
            className: selected === item.id ? 'danger' : '',
          },
          String(item.id),
          shouldUpdate
        )
      )
    )
  );
}
