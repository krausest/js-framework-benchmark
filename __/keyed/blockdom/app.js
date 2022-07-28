import { list, mount, patch, createBlock, withKey } from 'blockdom';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random(max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const label = `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`;
    data[i] = {
      id: idCounter++,
      label,
    }
  }
  return data;
}

function createStore(onUpdate) {
  let rows = [];
  let selectedRowId = null;

  return {
    get rows() { return rows },
    get selectedRowId() { return selectedRowId },
    run() {
      rows = buildData(1000);
      selectedRowId = null;
      onUpdate();
    },
    runLots() {
      rows = buildData(10000);
      selectedRowId = null;
      onUpdate()
    },
    add() {
      rows = rows.concat(buildData(1000));
      onUpdate()
    },
    update() {
      let index = 0;
      while (index < rows.length) {
        rows[index].label = rows[index].label + " !!!";
        index += 10;
      }
      onUpdate()
    },
    clear() {
      rows = [];
      selectedRowId = null;
      onUpdate()
    },
    swapRows() {
      if (rows.length > 998) {
        let tmp = rows[1];
        rows[1] = rows[998];
        rows[998] = tmp;
      }
      onUpdate()
    },
    selectRow(id) {
      selectedRowId = id;
      onUpdate()
    },
    removeRow(id) {
      rows.splice(rows.findIndex(row => row.id === id), 1);
      onUpdate()
    }
  }
}

// ---------------------------------------------------------------------------

const rowBlock = createBlock(`          
      <tr block-attribute-2="class">
        <td class="col-md-1"><block-text-0/></td>
        <td class="col-md-4">
            <a block-handler-3="click.synthetic"><block-text-1/></a>
        </td>
        <td class="col-md-1">
            <a block-handler-4="click.synthetic">
              <span class='glyphicon glyphicon-remove' aria-hidden="true" />
            </a>
        </td>
        <td class='col-md-6'/>
      </tr>`);

const mainBlock = createBlock(`
      <div class='container'>
        <div class='jumbotron'>
          <div class='row'>
            <div class='col-md-6'>
              <h1>blockdom keyed</h1>
            </div>
            <div class='col-md-6'>
              <div class='row'>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="run" block-handler-0="click">Create 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="runlots" block-handler-1="click">Create 10,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="add" block-handler-2="click">Append 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="update" block-handler-3="click">Update every 10th row</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="clear" block-handler-4="click">Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="swaprows" block-handler-5="click">Swap Rows</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class='table table-hover table-striped test-data'>
          <tbody>
            <block-child-0/>
          </tbody>
        </table>
        <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
      </div>`);

// ---------------------------------------------------------------------------

function render(store, cache, nextCache) {
  const data = [store.run, store.runLots, store.add, store.update, store.clear, store.swapRows];
  let { rows, selectedRowId } = store;

  return mainBlock(data, [list(rows.map(row => {
    const isSelected = row.id === selectedRowId;
    const elem = cache[row.id]
    if (elem) {
      if (elem.memo[0] === row.label && elem.memo[1] === isSelected) {
        return (nextCache[row.id] = elem);
      }
    }
    const result = rowBlock([
      row.id,
      row.label,
      isSelected ? "danger" : "",
      [store.selectRow, row.id],
      [store.removeRow, row.id],
    ]);
    result.memo = [row.label, isSelected];
    nextCache[row.id] = result;
    return withKey(result, row.id);
  }))])
}

// ---------------------------------------------------------------------------

const store = createStore(update);

let cache = {};
let app = render(store, {}, cache);
mount(app, document.body);

function update() {
  let nextCache = {};
  patch(app, render(store, cache, nextCache));
  cache = nextCache;
}

