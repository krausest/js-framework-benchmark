const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let _nextId = 1;
function buildData(count) {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: _nextId++,
      label: `${ADJECTIVES[_random(ADJECTIVES.length)]} ${COLOURS[_random(COLOURS.length)]} ${NOUNS[_random(NOUNS.length)]}`,
    });
  }

  return data;
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

class Store {
  constructor() {
    this.data = [];
    this.selected = null;
  }

  run() {
    this.data = buildData(1000);
    this.selected = null;
  }

  runLots() {
    this.data = buildData(10000);
    this.selected = null;
  }

  add() {
    this.data = this.data.concat(buildData(1000));
    this.selected = null;
  }

  update() {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += " !!!";
    }
    this.selected = null;
  }

  clear() {
    this.data = [];
    this.selected = null;
  }

  swapRows() {
    if (this.data.length > 998) {
      const a = this.data[1];
      this.data[1] = this.data[998];
      this.data[998] = a;
    }
  }

  delete(id) {
    this.data = this.data.filter((d) => d.id !== id);
  }

  select(id) {
    this.selected = id;
  }
}

class BenchmarkApp extends HTMLDivElement {
  constructor() {
    super();
    this._store = new Store();
    this._rows = [];
    this._selectedRow = null;

    this.id = "main";

    const container = document.createElement("div");
    container.className = "container";
    const jumbotron = document.createElement("div");
    jumbotron.className = "jumbotron";
    const jumbotronRow = document.createElement("div");
    jumbotronRow.className = "row";

    // title
    const titleDiv = document.createElement("div");
    titleDiv.className = "col-md-6";
    const titleH1 = document.createElement("h1");
    titleH1.textContent = "VanillaJS-WC-keyed";

    titleDiv.appendChild(titleH1);

    // menu
    const menuDiv = document.createElement("div");
    menuDiv.className = "col-md-6";
    const menuRow = document.createElement("div");
    menuRow.className = "row";

    menuRow.appendChild(createMenuButton("Create 1,000 rows", "run"));
    menuRow.appendChild(createMenuButton("Create 10,000 rows", "runlots"));
    menuRow.appendChild(createMenuButton("Append 1,000 rows", "add"));
    menuRow.appendChild(createMenuButton("Update every 10th row", "update"));
    menuRow.appendChild(createMenuButton("Clear", "clear"));
    menuRow.appendChild(createMenuButton("Swap Rows", "swaprows"));

    menuDiv.appendChild(menuRow);

    jumbotronRow.appendChild(titleDiv);
    jumbotronRow.appendChild(menuDiv);

    jumbotron.appendChild(jumbotronRow);

    // table
    const table = document.createElement("table");
    table.className = "table table-hover table-striped test-data";
    const tbody = this._tbody = document.createElement("tbody");

    table.appendChild(tbody);

    const preloadIcon = document.createElement("span");
    preloadIcon.className = "preloadicon glyphicon glyphicon-remove";
    preloadIcon.setAttribute("aria-hidden", "true");

    container.appendChild(jumbotron);
    container.appendChild(table);
    container.appendChild(preloadIcon);

    this.appendChild(container);

    this.addEventListener("benchmark-action", (ev) => {
      const msg = ev.detail;
      const store = this._store;

      switch (msg.action) {
        case "run":
          store.run();
          this._removeAllRows();
          this._appendRows();
          break;
        case "runlots":
          store.runLots();
          this._removeAllRows();
          this._appendRows();
          break;
        case "add":
          store.add();
          this._appendRows();
          break;
        case "update": {
          store.update();
          const rows = this._rows;
          for (let i = 0; i < rows.length; i += 10) {
            rows[i].rowLabel = store.data[i].label;
          }
          break;
        }
        case "clear":
          store.clear();
          this._removeAllRows();
          break;
        case "swaprows": {
          const rows = this._rows;
          if (rows.length > 998) {
            store.swapRows();

            this._tbody.insertBefore(rows[998], rows[2]);
            this._tbody.insertBefore(rows[1], rows[999]);

            const tmp = rows[998];
            rows[998] = rows[1];
            rows[1] = tmp;
          }
          break;
        }
        case "delete": {
          const id = msg.payload;
          const i = this._findRowIndexById(id);
          store.delete(id);
          const row = this._rows[i];
          this._rows.splice(i, 1);
          if (this._selectedRow === row) {
            this._selectedRow = null;
          }
          row.remove();
          break;
        }
        case "select": {
          const id = msg.payload;
          store.select(id);
          if (this._selectedRow !== null) {
            this._selectedRow.rowSelected = false;
          }
          this._selectedRow = this._rows[this._findRowIndexById(id)];
          this._selectedRow.rowSelected = true;
          break;
        }
      }
    });
  }

  _findRowIndexById(id) {
    return this._store.data.findIndex(d => d.id === id);
  }

  _removeAllRows() {
    this._selectedRow = null;
    this._rows = [];

    this._tbody.textContent = "";
  }

  _appendRows() {
    const tbody = this._tbody;
    const rows = this._rows;
    const storeData = this._store.data;

    for (let i = rows.length; i < storeData.length; i++) {
      const tr = createRow(storeData[i]);
      rows[i] = tr;
      tbody.appendChild(tr);
    }
  }
}

class BenchmarkRow extends HTMLTableRowElement {
  constructor() {
    super();
    this._rowId = null;
    this._rowLabel = null;
    this._rowSelected = false;

    const td1 = this._td1 = td("col-md-1");

    const td2 = td("col-md-4");
    const a2 = this._a2 = document.createElement("a");
    td2.appendChild(a2);

    const td3 = td("col-md-1");
    const a = document.createElement("a");

    const span = document.createElement("span");
    span.className = "glyphicon glyphicon-remove";
    span.setAttribute("aria-hidden", "true");

    a.appendChild(span);
    td3.appendChild(a);

    this.appendChild(td1);
    this.appendChild(td2);
    this.appendChild(td3);
    this.appendChild(td("col-md-6"));

    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.dispatchEvent(new CustomEvent("benchmark-action", {
        bubbles: true,
        detail: { action: "delete", payload: this._rowId },
      }));
    });

    a2.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.dispatchEvent(new CustomEvent("benchmark-action", {
        bubbles: true,
        detail: { action: "select", payload: this._rowId },
      }));
    });
  }

  get rowId() {
    return this._rowId;
  }

  set rowId(v) {
    this._td1.textContent = this._rowId = v;
  }

  get rowLabel() {
    return this._rowLabel;
  }

  set rowLabel(v) {
    this._a2.textContent = this._rowLabel = v;
  }

  get rowSelected() {
    return this._rowSelected;
  }

  set rowSelected(v) {
    if (this._rowSelected !== v) {
      this._rowSelected = v;
      this.className = v ? "danger" : "";
    }
  }
}

function createRow(data) {
  /**
   * @localvoid:
   * 
   * There are two ways how to instantiate WebComponents: with a `new` operator and with `document.createElement()`
   * function. Instantiating WebComponents with a `new` operator has a slightly less overhead (probably because it
   * doesn't involve a hash map lookup to find a component).
   * 
   * The main reason why I've used `document.createElement()` here is because it is an idiomatic way to instantiate
   * components in all popular frameworks that use WebComponents.
   */
  // const e = new BenchmarkRow();
  const e = document.createElement("tr", { is: "benchmark-row" });
  e.rowId = data.id;
  e.rowLabel = data.label;
  return e;
}

function td(className) {
  const td = document.createElement("td");
  td.className = className;
  return td;
}

class BenchmarkMenuButton extends HTMLDivElement {
  constructor() {
    super();
    this._action = null;
    this._content = null;

    const button = this._button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary btn-block";
    button.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.dispatchEvent(new CustomEvent("benchmark-action", { bubbles: true, detail: { action: this._action } }));
    });

    this.className = "col-sm-6 smallpad";
    this.appendChild(button);
  }

  get action() {
    return this._action;
  }

  set action(v) {
    this._button.id = this._action = v;
  }

  get content() {
    return this._content;
  }

  set content(v) {
    this._button.textContent = this._content = v;
  }
}

function createMenuButton(title, action) {
  const e = document.createElement("div", { is: "benchmark-menu-button" });
  e.content = title;
  e.action = action;
  return e;
}

customElements.define("benchmark-menu-button", BenchmarkMenuButton, { extends: "div" });
customElements.define("benchmark-row", BenchmarkRow, { extends: "tr" });
customElements.define("benchmark-app", BenchmarkApp, { extends: "div" });
