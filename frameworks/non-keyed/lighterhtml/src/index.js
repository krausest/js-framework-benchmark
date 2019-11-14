import { html, render } from '../node_modules/lighterhtml/esm/index.js';

const adjectives = [
  'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let data = [];
let did = 1;
let selected = -1;

const add = () => {
  data = data.concat(buildData(1000));
  _render();
};
const run = () => {
  data = buildData(1000);
  _render();
};
const runLots = () => {
  data = buildData(10000);
  _render();
};
const clear = () => {
  data = [];
  _render();
};
const interact = event => {
  event.preventDefault();
  const a = event.target.closest('a');
  const id = parseInt(a.closest('tr').id, 10);
  const idx = data.findIndex(item => item.id === id);
  switch (a.dataset.action) {
    case 'delete':
      data.splice(idx, 1);
      _render();
      break;
    case 'select':
      if (selected !== idx) {
        if (-1 < selected)
          data[selected] = { ...data[selected], selected: false };
        selected = idx;
        data[selected] = { ...data[selected], selected: true };
        _render();
      }
      break;
  }
};
const swapRows = () => {
  if (data.length > 998) {
    const tmp = data[1]
    data[1] = data[998]
    data[998] = tmp
  }
  _render();
};
const update = () => {
  for(let i = 0; i < data.length; i += 10) {
    data[i].label += ' !!!';
  }
  _render();
};
const buildData = count => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: did++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
      selected: false,
    });
  }
  return data;
};
const _random = max => {
  return Math.round(Math.random() * 1000) % max;
};

const container = document.getElementById('container');
const _render = () => {
  render(container, html`
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>lighterhtml</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="run" onclick=${run}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="runlots" onclick=${runLots}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary
                          btn-block" id="add" onclick=${add}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary
                          btn-block" id="update" onclick=${update}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary
                          btn-block" id="clear" onclick=${clear}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary
                          btn-block" id="swaprows" onclick=${swapRows}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table onclick=${interact} class="table table-hover table-striped test-data">
      <tbody>${data.map(item => html`
        <tr data=${item} class=${item.selected ? 'danger' : ''}>
          <td class="col-md-1">${item.id}</td>
          <td class="col-md-4">
            <a data-action='select'>${item.label}</a>
          </td>
          <td class="col-md-1">
            <a data-action='delete'>
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </a>
          </td>
          <td class="col-md-6"></td>
        </tr>`)
      }
      </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>`);
};

_render();
