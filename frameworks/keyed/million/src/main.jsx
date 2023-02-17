import {
  createBlock,
  fragment,
} from '/Users/aidenybai/Projects/aidenybai/million/packages/block/index';

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
const colors = [
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

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
let list = [];
let main;
let selected = 0;

const clear = () => {
  list = [];
  main.children = [];
  main.remove();
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

const create1k = (event) => {
  event.stopPropagation();
  if (list.length) clear();
  list = buildData(1000);
  update();
};

const create10k = (event) => {
  event.stopPropagation();
  if (list.length) clear();
  list = buildData(10000);
  update();
};

const append1k = (event) => {
  event.stopPropagation();
  list = list.concat(buildData(1000));
  update();
};

const updateEvery10 = (event) => {
  event.stopPropagation();
  let i = 0;
  while (i < list.length) {
    list[i].label = `${list[i].label} !!!`;
    i += 10;
  }
  update();
};

const swapRows = (event) => {
  event.stopPropagation();
  if (list.length > 998) {
    const item = list[1];
    list[1] = list[998];
    list[998] = item;
  }
  update();
};

const select = (id) => {
  selected = id;
  update();
};

const remove = (id) => {
  list.splice(
    list.findIndex((z) => z.id === id),
    1
  );
  update();
};

const shouldUpdate = (oldProps, newProps) => {
  return (
    oldProps.label !== newProps.label ||
    oldProps.className !== newProps.className
  );
};

const Main = createBlock(({ rows }) => (
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
                onClick={(event) => {
                  event.stopPropagation();
                  clear();
                  update();
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
      <tbody>{rows}</tbody>
    </table>
    <span
      class="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    ></span>
  </div>
));

const Row = createBlock(({ className, id, select, remove, label }) => {
  return (
    <tr class={className}>
      <td class="col-md-1">{id}</td>
      <td class="col-md-4">
        <a onClick={select}>{label}</a>
      </td>
      <td class="col-md-1">
        <a onClick={remove}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  );
});

function Rows({ oldCache, newCache }) {
  return fragment(
    list.map((item) => {
      const isSelected = selected === item.id;
      const cachedItem = oldCache[item.id];
      if (cachedItem) {
        const [cachedLabel, cachedIsSelected] = cachedItem._data;
        if (cachedLabel === item.label && cachedIsSelected === isSelected) {
          return (newCache[item.id] = cachedItem);
        }
      }
      const row = (
        <Row
          id={item.id}
          label={item.label}
          className={isSelected ? 'danger' : ''}
          remove={(event) => {
            event.stopPropagation();
            remove(item.id);
          }}
          select={(event) => {
            event.stopPropagation();
            select(item.id);
          }}
        />
      );
      row._data = [item.label, isSelected];
      row.key = String(item.id);
      row.shouldUpdate = shouldUpdate;
      newCache[item.id] = row;
      return row;
    })
  );
}

function render(oldCache, newCache) {
  return <Rows oldCache={oldCache} newCache={newCache} />;
}

let oldCache = {};

main = render({}, oldCache);
(<Main rows={main} />).mount(document.getElementById('main'));

function update() {
  let newCache = {};
  main.patch(render(oldCache, newCache));
  oldCache = newCache;
}
