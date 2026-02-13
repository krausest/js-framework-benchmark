import { defineComponent, signal } from "thane";

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

export const Benchmark = defineComponent('bench-mark', () => {
  const rows = signal<RowData[]>([]);
  let selectedEl: HTMLElement | null = null;

  const select = (row: RowData, e: Event) => {
    if (selectedEl) selectedEl.className = '';
    selectedEl = (e.target as HTMLElement).closest('tr') as HTMLElement;
    selectedEl.className = 'danger';
  };

  const run = () => {
    rows(buildData(1000));
    selectedEl = null;
  };

  const runLots = () => {
    rows(buildData(10000));
    selectedEl = null;
  };

  const add = () => {
    rows([...rows(), ...buildData(1000)]);
  };

  const update = () => {
    const data = rows();
    const newData = [...data];
    for (let i = 0; i < newData.length; i += 10) {
      const item = newData[i]!;
      newData[i] = { ...item, label: item.label + ' !!!' };
    }
    rows(newData);
  };

  const clear = () => {
    rows([]);
    selectedEl = null;
  };

  const swapRows = () => {
    const data = rows();
    if (data.length > 998) {
      const newData = [...data];
      const temp = newData[1]!;
      newData[1] = newData[998]!;
      newData[998] = temp;
      rows(newData);
    }
  };

  const remove = (id: number) => {
    const data = rows();
    const idx = data.findIndex(d => d.id === id);
    if (idx !== -1) {
      rows(data.slice(0, idx).concat(data.slice(idx + 1)));
    }
  };

  return {
    template: html`
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>Thane Benchmark</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="run" @click=${run}>Create 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${runLots}>Create 10,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="add" @click=${add}>Append 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="update" @click=${update}>Update every 10th row</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="clear" @click=${clear}>Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${swapRows}>Swap Rows</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="table table-hover table-striped test-data">
          <tbody id="tbody">
            ${repeat(
              rows(),
              (row) => html`
                <tr>
                  <td class="col-md-1">${row.id}</td>
                  <td class="col-md-4">
                    <a @click=${(e: Event) => select(row, e)}>${row.label}</a>
                  </td>
                  <td class="col-md-1">
                    <a @click=${() => remove(row.id)}>
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
    `
  };
});
