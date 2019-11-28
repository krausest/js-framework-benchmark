import { html, render } from '../node_modules/lighterhtml/esm/index.js';

let did = 1;
const buildData = (count) => {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: did++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    }
    return data;
};

const _random = max => Math.round(Math.random() * 1000) % max;

const scope = {
    add() {
        scope.data = scope.data.concat(buildData(1000));
        update(main, scope);
    },
    run() {
        scope.data = buildData(1000);
        update(main, scope);
    },
    runLots() {
        scope.data = buildData(10000);
        update(main, scope);
    },
    clear() {
        scope.data = [];
        update(main, scope);
    },
    update() {
        const {data} = scope;
        for (let i = 0, {length} = data; i < length; i += 10)
            data[i].label += ' !!!';
        update(main, scope);
    },
    swapRows() {
        const {data} = scope;
        if (data.length > 998) {
            const tmp = data[1];
            data[1] = data[998];
            data[998] = tmp;
        }
        update(main, scope);
    },
    interact(event) {
      event.preventDefault();
      const a = event.target.closest('a');
      const id = parseInt(a.closest('tr').id, 10);
      scope[a.dataset.action](id);
    },
    delete(id) {
        const {data} = scope;
        const idx = data.findIndex(d => d.id === id);
        data.splice(idx, 1);
        update(main, scope);
    },
    select(id) {
        scope.selected = id;
        update(main, scope);
    },
    selected: -1,
    data: [],
};

const main = document.getElementById('container');
update(main, scope);

function update(
  where,
  {data, selected, run, runLots, add, update, clear, swapRows, interact}
) {
  render(where, html`
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>lighterhtml keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="run" onclick=${run}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="runlots" onclick=${runLots}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="add" onclick=${add}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="update" onclick=${update}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="clear" onclick=${clear}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="swaprows" onclick=${swapRows}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table onclick=${interact} class="table table-hover table-striped test-data">
      <tbody>${
      data.map(item => {
        const {id, label} = item;
        return html.for(item)`
        <tr id=${id} class=${id === selected ? 'danger' : ''}>
          <td class="col-md-1">${id}</td>
          <td class="col-md-4">
            <a data-action='select'>${label}</a>
          </td>
          <td class="col-md-1">
            <a data-action='delete'>
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </a>
          </td>
          <td class="col-md-6"></td>
        </tr>`;
      })
      }</tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>`);
}
