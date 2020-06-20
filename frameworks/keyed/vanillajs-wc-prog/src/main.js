import { Store } from './store.js';

const store = new Store();

/**
 * component without shadow dom, for css
 *
 * designed for programmatic usage only.
 */
class BenchmarkRowComponent extends HTMLTableRowElement {
  #rowId;
  #label;
  #connected = false;
  #content;

  constructor(rowId, label) {
    super();
    this.#rowId = rowId;
    this.#label = label;

    this.addEventListener('click', (e) => {
      const el = /** @type {HTMLElement} */ (e.target);
        if(el.closest('.row-link')) {
          this._fireEvent('select');
        } else if (el.closest('.remove-btn')) {
          this._fireEvent('delete');
        }
    })

    this.#content = this._buildContent();
  }

  set rowLabel(val) {
    this.#label = val;
    if (this.#connected) {
      this.querySelector('.row-link').textContent = val;
    }
  }

  set rowId(val) {
    this.#rowId = val;
    if (this.#connected) {
      this.querySelector('.row-id').textContent = val;
      this.querySelector('.row-link').setAttribute('data-id', val);
    }
  }

  get rowId() {
    return this.#rowId;
  }

  // TODO: store elements
  _buildContent() {
    const content = [];
    
    const td1 = document.createElement('td');
    td1.classList.add("row-id", "col-md-1");
    td1.textContent = this.#rowId;
    content.push(td1);

    const link = document.createElement('a');
    link.classList.add("row-link");
    link.setAttribute('data-action', "select");
    link.setAttribute('data-id', this.#rowId);
    link.textContent = this.#label;
    const td2 = document.createElement('td');
    td2.classList.add("col-md-4");
    td2.appendChild(link);
    content.push(td2);

    const rmIcon = document.createElement('span');
    rmIcon.classList.add("remove-btn", "glyphicon", "glyphicon-remove");
    rmIcon.setAttribute('aria-hidden', 'true');
    const iconLink = document.createElement('a');
    iconLink.appendChild(rmIcon);
    const td3 = document.createElement('td');
    td3.classList.add("col-md-1");
    td3.appendChild(iconLink);
    content.push(td3);

    const td4 = document.createElement("td");
    td4.classList.add('col-md-6');
    content.push(td4);

    return content;
  }

  connectedCallback() {
    if (!this.#connected) {
      // createRows 303.4 ± 22.6
      // createMany 2,691.9 ± 9.8
      this.append(...this.#content);
      this.#connected = true;
    }
  }

  _fireEvent(action) {
    this.dispatchEvent(
      new CustomEvent('benchmark-row-action', {
        bubbles: true,
        detail: {
          action,
          rowId: this.#rowId,
        },
      })
    );
  }
}

customElements.define('benchmark-row', BenchmarkRowComponent, { extends: 'tr' });

class BenchmarkAppComponent extends HTMLElement {
  /**
   * @type {BenchmarkRowComponent[]}
   */
  #rows = [];
  /**
   * @type {HTMLElement}
   */
  #tbody;
  /**
   * @type {HTMLTemplateElement}
   */
  #template;
  /**
   * @type {BenchmarkRowComponent}
   */
  #selectedRow;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.#template = document.createElement('template');

    this.#template.innerHTML = /* HTML */ `
      <link href="/css/currentStyle.css" rel="stylesheet" />
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>VanillaJS Web Component DX keyed</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="run">
                    Create 1,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="runlots">
                    Create 10,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="add">
                    Append 1,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="update">
                    Update every 10th row
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="clear">Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type="button" class="btn btn-primary btn-block" id="swaprows">
                    Swap Rows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="table table-hover table-striped test-data">
          <tbody id="rows-container"></tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
    `;

    this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
    this.#tbody = this.shadowRoot.getElementById('rows-container');
    this.#tbody.addEventListener('benchmark-row-action', (e) => {
        const {action, rowId} = e.detail;
        if (action === "delete") {
            this._delete(rowId);
        } else if (action === "select") {
            this._select(rowId)
        }
    });

    this.shadowRoot.getElementById('run').addEventListener('click', () => {
      this._run();
    });
    this.shadowRoot.getElementById('runlots').addEventListener('click', () => {
      this._runLots();
    });
    this.shadowRoot.getElementById('add').addEventListener('click', () => {
      this._add();
    });
    this.shadowRoot.getElementById('update').addEventListener('click', () => {
      this._update();
    });
    this.shadowRoot.getElementById('clear').addEventListener('click', () => {
      this._clear();
    });
    this.shadowRoot.getElementById('swaprows').addEventListener('click', () => {
      this._swapRows();
    });
  }

  _handleClick(e) {
    const { action, id } = e.target.dataset;
    if (action && id) {
      this['_' + action](id);
    }
  }

  _add() {
    const newData = store.add();
    this._appendRows(newData);
  }

  _runLots() {
    store.runLots();
    this._resetRows();
  }

  _clear() {
    store.clear();
    this.#tbody.textContent = '';
    this.#rows = [];
  }

  _swapRows() {
    if (this.#rows.length > 998) {
      store.swapRows();

      this.#tbody.insertBefore(this.#rows[998], this.#rows[2]);
      this.#tbody.insertBefore(this.#rows[1], this.#rows[999]);

      const tmp = this.#rows[998];
      this.#rows[998] = this.#rows[1];
      this.#rows[1] = tmp;
    }
  }

  _appendRows(newData) {
    const newRows = newData.map((item) => new BenchmarkRowComponent(item.id, item.label));
    this.#tbody.append(...newRows);
    this.#rows.push(...newRows);
  }

  _resetRows() {
    this.#tbody.textContent = '';
    this.#rows = [];
    this._appendRows(store.data);
  }

  _run() {
    store.run();
    this._resetRows();
  }

  _update() {
    const updated = store.update();
    for (const [i, item] of updated) {
      this.#rows[i].rowLabel = item.label;
      // this is ignored for consistency with the vanilla-wc implementation
      // this.#rows[i].rowId = item.id;
    }
  }

  _delete(id) {
    const i = this._findRowIndexById(id);
    store.delete(id);
    const row = this.#rows[i];
    this.#rows.splice(i, 1);
    if (this.#selectedRow === row) {
      this.#selectedRow = null;
    }
    row.remove();
  }

  _select(id) {
      store.select(id);
      if (this.#selectedRow) {
        this.#selectedRow.classList.remove('danger');
      }
      this.#selectedRow = this.#rows[this._findRowIndexById(id)];
      this.#selectedRow.classList.add('danger');
  }

  _findRowIndexById(id) {
    return store.data.findIndex(d => d.id === id);
  }
}

customElements.define('main-element', BenchmarkAppComponent);
