let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random(max) { return Math.round(Math.random() * 1000) % max; }

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
    };
  }
  return data;
}

Micra.define("main", {
  // Micra's proxy is shallow by design: every action REPLACES state.data with
  // a new array (and new objects only for changed rows), which is what drives
  // the keyed diff. `selected` starts at 0 — row ids start at 1.
  state: { data: [], selected: 0 },

  run() {
    this.state.data = buildData(1000);
    this.state.selected = 0;
  },
  runLots() {
    this.state.data = buildData(10000);
    this.state.selected = 0;
  },
  add() {
    this.state.data = this.state.data.concat(buildData(1000));
  },
  update() {
    const d = this.state.data;
    const next = new Array(d.length);
    for (let i = 0; i < d.length; i++) {
      next[i] = i % 10 === 0 ? { id: d[i].id, label: d[i].label + " !!!" } : d[i];
    }
    this.state.data = next;
  },
  clear() {
    this.state.data = [];
    this.state.selected = 0;
  },
  select(e) {
    this.state.selected = Number(e.currentTarget.dataset.id);
  },
  remove(e) {
    const id = Number(e.currentTarget.dataset.id);
    this.state.data = this.state.data.filter((d) => d.id !== id);
  },
  swapRows() {
    const d = this.state.data;
    if (d.length > 998) {
      const next = d.slice();
      next[1] = d[998];
      next[998] = d[1];
      this.state.data = next;
    }
  },
});

Micra.start();
