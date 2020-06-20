'use strict';

/**
 * @typedef {{id: number, label: string}} DataItem
 * @typedef {HTMLTableRowElement & { setRowLabel: (arg0: string) => void; setData: (arg0: DataItem) => void}} RowElement
 */

let did = 1;

/**
 *
 * @param {number} count
 * @returns {DataItem[]}
 */
function buildData(count) {
  var adjectives = [
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
  var colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
  var nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
  var data = [];
  for (var i = 0; i < count; i++) {
    data.push({
      id: did++,
      label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)],
    });
  }
  return data;
}

/**
 * @param {number} max
 * @returns {number}
 */
function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const tbody = document.getElementById('tbody');
const rowTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById('row-template'));

class Main {
  constructor() {
    /**
     * @type {RowElement[]}
     */
    this.rows = [];

    /**
     * @type {DataItem[]}
     */
    this.data = [];
    this.selectedRowIndex = -1;

    window.select = this.select.bind(this);
    window.remove = this.remove.bind(this);
    window.run = this.run.bind(this);
    window.runLots = this.runLots.bind(this);
    window.add = this.add.bind(this);
    window.update = this.update.bind(this);
    window.clearRows = this.clearRows.bind(this);
    window.swapRows = this.swapRows.bind(this);
  }

  /**
   * @param {number} index
   */
  select(index) {
    if (index > -1) {
      if (this.selectedRowIndex > -1) {
        tbody.children[this.selectedRowIndex].className = '';
      }
      tbody.children[index].className = 'danger';
      this.selectedRowIndex = index;
    }
  }

  /**
   * @param {number} index
   */
  remove(index) {
    for (let i = index; i < this.data.length - 1; i++) {
      this.rows[i].setData(this.data[i + 1]);
      this.data[i] = this.data[i + 1];
    }
    this.data.pop();
    this.rows.pop();
    tbody.lastElementChild.remove();
  }

  run() {
    this.data = buildData(1000);
    this.rows = this.data.map((item, i) => this.row(item, i));
    this.renderAllRows();
  }

  runLots() {
    this.data = buildData(10000);
    this.rows = this.data.map((item, i) => this.row(item, i));
    this.renderAllRows();
  }

  add() {
    const newData = buildData(1000);
    const newRows = newData.map((item, i) => this.row(item, this.data.length + i));
    tbody.append(...newRows);
    this.data.push(...newData);
    this.rows.push(...newRows);
  }

  update() {
    for (let i = 0; i < this.data.length; i += 10) {
      const oldLabel = this.data[i].label;
      const newLabel = oldLabel.concat(' !!!');
      this.data[i].label = newLabel;
      this.rows[i].setRowLabel(newLabel);
    }
  }

  clearRows() {
    tbody.textContent = '';
    this.rows = [];
    this.data = [];
  }

  swapRows() {
    if (this.rows.length > 998) {
      const tmp = this.data[998];
      this.data[998] = this.data[1];
      this.data[1] = tmp;

      this.rows[1].setData(this.data[1]);
      this.rows[998].setData(this.data[998]);
    }
  }

  renderAllRows() {
    tbody.textContent = '';
    tbody.append(...this.rows);
  }

  /**
   * @param {DataItem} data
   * @param {number} index
   * @return {RowElement}
   */
  row(data, index) {
    const rowNode = /** @type {RowElement} */ (rowTemplate.content.cloneNode(true));
    const [rowId, link, rm] = rowNode.querySelectorAll('[dynamic]');
    // @ts-ignore
    rowId.textContent = data.id;
    link.addEventListener('click', () => {
      this.select(index);
    });
    link.textContent = data.label;
    rm.addEventListener('click', () => {
      this.remove(index);
    });
    rowNode.setRowLabel = (label) => {
      link.textContent = label;
    };
    rowNode.setData = (data) => {
      // @ts-ignore
      rowId.textContent = data.id;
      link.textContent = data.label;
    };
    return rowNode;
  }
}

new Main();
