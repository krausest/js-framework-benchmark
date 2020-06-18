const ADJECTIVES = [
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
const COLOURS = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const NOUNS = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

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

/*
 * As, in the vanilla-wc integration, selected row is only reflected in DOM for delete and select,
 * most ignored re-initialisations were commented for this integration
 *
 * This is inconsistent with the lit-element integration, which has to render id & class for each row.
 */
export class Store {
  constructor() {
    this.data = [];
    this.selected = null;
  }

  run() {
    this.data = buildData(1000);
    // this.selected = null;
  }

  runLots() {
    this.data = buildData(10000);
    // this.selected = null;
  }

  add() {
    const newData = buildData(1000);
    this.data = this.data.concat(newData);
    // this.selected = null;
    return newData;
  }

  update() {
    const updated = new Map();
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += ' !!!';
      updated.set(i, this.data[i]);
    }
    return updated;
    // this.selected = null;
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
    if (id === this.selected) {
      this.selected = null;
    }
  }

  select(id) {
    this.selected = id;
  }
}
