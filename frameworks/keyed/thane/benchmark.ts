import { Component, registerComponent, signal } from "thane";

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = (arr: string[]) => arr[Math.round(Math.random() * 1000) % arr.length]!;
const buildLabel = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;

interface RowData {
  id: number;
  label: string;
}

let nextId = 1;

const buildData = (count: number): RowData[] => {
  const data: RowData[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = { id: nextId++, label: buildLabel() };
  }
  return data;
};

export const Benchmark = registerComponent(
  { selector: 'bench-mark', type: 'page' },
  class extends Component {
    private _rows = signal<RowData[]>([]);
    private _selectedEl: HTMLElement | null = null;

    render = () => {
      return html`
        <div class="container">
          <div class="jumbotron">
            <div class="row">
              <div class="col-md-6">
                <h1>Thane Benchmark</h1>
              </div>
              <div class="col-md-6">
                <div class="row">
                  <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="run" @click=${this._run}>Create 1,000 rows</button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${this._runLots}>Create 10,000 rows</button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="add" @click=${this._add}>Append 1,000 rows</button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="update" @click=${this._update}>Update every 10th row</button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="clear" @click=${this._clear}>Clear</button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${this._swapRows}>Swap Rows</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table class="table table-hover table-striped test-data">
            <tbody id="tbody" @click=${this._handleTableClick}>
              ${repeat(
                this._rows(),
                (row) => html`
                  <tr data-id="${row.id}">
                    <td class="col-md-1">${row.id}</td>
                    <td class="col-md-4">
                      <a data-action="select">${row.label}</a>
                    </td>
                    <td class="col-md-1">
                      <a data-action="remove">
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                      </a>
                    </td>
                    <td class="col-md-6"></td>
                  </tr>
                `,
                null,
                (row) => row.id,
              )}
            </tbody>
          </table>
          <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
      `;
    };

    private _handleTableClick = (e: Event) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const row = target.closest('tr') as HTMLElement | null;
      
      if (!row) return;

      const actionEl = target.closest('[data-action]') as HTMLElement | null;
      const action = actionEl?.getAttribute('data-action');

      if (action === 'remove') {
        const id = parseInt(row.getAttribute('data-id') || '0', 10);
        if (id) this._remove(id);
      } else if (action === 'select') {
        if (this._selectedEl) this._selectedEl.className = '';
        this._selectedEl = row;
        row.className = 'danger';
      }
    };

    private _run = () => {
      this._rows(buildData(1000));
      this._selectedEl = null;
    };

    private _runLots = () => {
      this._rows(buildData(10000));
      this._selectedEl = null;
    };

    private _add = () => {
      this._rows([...this._rows(), ...buildData(1000)]);
    };

    private _update = () => {
      const data = this._rows();
      const newData = [...data];
      for (let i = 0; i < newData.length; i += 10) {
        const item = newData[i]!;
        newData[i] = { ...item, label: item.label + ' !!!' };
      }
      this._rows(newData);
    };

    private _clear = () => {
      this._rows([]);
      this._selectedEl = null;
    };

    private _swapRows = () => {
      const data = this._rows();
      if (data.length > 998) {
        const newData = [...data];
        const temp = newData[1]!;
        newData[1] = newData[998]!;
        newData[998] = temp;
        this._rows(newData);
      }
    };

    private _remove = (id: number) => {
      const data = this._rows();
      const idx = data.findIndex(d => d.id === id);
      if (idx !== -1) {
        this._rows(data.slice(0, idx).concat(data.slice(idx + 1)));
      }
    };

    static styles = css``;
  },
);
