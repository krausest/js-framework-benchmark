import { createState, customElement, GemElement, html, repeat, template } from '@mantou/gem';

interface Row {
  id: number;
  label: string;
}

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const random = (max: number) => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count: number): Row[] =>
  Array.from({ length: count }, () => ({
    id: nextId++,
    label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`,
  }));

@customElement('app-root')
export class AppRootElement extends GemElement {
  #state = createState({ rows: [] as Row[], selected: 0 });

  #run = () => this.#state({ rows: buildData(1000), selected: 0 });

  #runLots = () => this.#state({ rows: buildData(10000), selected: 0 });

  #add = () => this.#state({ rows: this.#state.rows.concat(buildData(1000)) });

  #update = () => {
    const { rows } = this.#state;
    for (let i = 0; i < rows.length; i += 10) {
      rows[i] = { ...rows[i], label: `${rows[i].label} !!!` };
    }
    this.#state({ rows });
  };

  #clear = () => this.#state({ rows: [], selected: 0 });

  #swapRows = () => {
    const { rows } = this.#state;
    if (rows.length > 998) {
      [rows[1], rows[998]] = [rows[998], rows[1]];
      this.#state({ rows });
    }
  };

  #onClick = (evt: MouseEvent) => {
    const target = evt.target as HTMLElement;
    const id = Number(target.closest('tr')?.id);
    if (target.matches('.col-md-4 > a')) {
      this.#state({ selected: id });
    } else if (target.matches('.glyphicon-remove')) {
      this.#state({ rows: this.#state.rows.filter((row) => row.id !== id) });
    }
  };

  @template()
  #content = () => html`
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6"><h1>Gem keyed</h1></div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="run" @click=${this.#run}>Create 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${this.#runLots}>Create 10,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="add" @click=${this.#add}>Append 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="update" @click=${this.#update}>Update every 10th row</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="clear" @click=${this.#clear}>Clear</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${this.#swapRows}>Swap Rows</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data" @click=${this.#onClick}>
        <tbody>
          ${repeat(
            this.#state.rows,
            (row) => row.id,
            (row) => html`
              <tr id=${row.id} class=${row.id === this.#state.selected ? 'danger' : ''}>
                <td class="col-md-1">${row.id}</td>
                <td class="col-md-4"><a>${row.label}</a></td>
                <td class="col-md-1">
                  <a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
                </td>
                <td class="col-md-6"></td>
              </tr>
            `,
          )}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `;
}
