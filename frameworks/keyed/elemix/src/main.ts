import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

type Row = {
  id: number;
  label: string;
  selected: boolean;
}

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const _random = (max: number): number => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count = 1000): Row[] => {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
      selected: false,
    };
  }
  return data;
};

type State = {
  data: Row[];
}

// #component
export class MainElement extends Component {
  // #state
  state: State = { data: [] };
  selectedRow: Row | null = null;

  run = (): void => {
    this.state.data = buildData(1000);
    this.selectedRow = null;
  };

  runLots = (): void => {
    this.state.data = buildData(10000);
    this.selectedRow = null;
  };

  add = (): void => {
    this.state.data.push(...buildData(1000));
  };

  update = (): void => {
    const data = this.state.data;
    for (let i = 0; i < data.length; i += 10) {
      data[i].label += ' !!!';
    }
  };

  clear = (): void => {
    this.state.data = [];
    this.selectedRow = null;
  };

  swapRows = (): void => {
    const data = this.state.data;
    if (data.length > 998) {
      const next = data.slice();
      const tmp = next[1];
      next[1] = next[998];
      next[998] = tmp;
      this.state.data = next;
    }
  };

  select = (id: number): void => {
    if (this.selectedRow) this.selectedRow.selected = false;
    const next = this.state.data.find((row) => row.id === id);
    if (next) {
      next.selected = true;
      this.selectedRow = next;
    }
  };

  removeRow = (id: number): void => {
    const data = this.state.data;
    const index = data.findIndex((row) => row.id === id);
    if (index !== -1) {
      if (data[index] === this.selectedRow) this.selectedRow = null;
      data.splice(index, 1);
    }
  };

  template = (): Template => tpl`
    <link href="/css/currentStyle.css" rel="stylesheet" />
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Elemix keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="run" @click=${this.run}>Create 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${this.runLots}>Create 10,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="add" @click=${this.add}>Append 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="update" @click=${this.update}>Update every 10th row</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="clear" @click=${this.clear}>Clear</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${this.swapRows}>Swap Rows</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          ${repeat(
            this.state.data,
            (item: Row) => tpl`
              <tr class=${item.selected ? 'danger' : ''}>
                <td class="col-md-1">${item.id}</td>
                <td class="col-md-4">
                  <a @click=${() => this.select(item.id)}>${item.label}</a>
                </td>
                <td class="col-md-1">
                  <a @click=${() => this.removeRow(item.id)}>
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                  </a>
                </td>
                <td class="col-md-6"></td>
              </tr>
            `,
            (item: Row) => item.id,
          )}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `;
}
