import sprae from './sprae.js';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let id = 1;
const random = (max) => Math.round(Math.random() * 1000) % max;
const buildData = (n) => Array.from({ length: n }, () => ({
  id: id++,
  label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`
}));

sprae(document.getElementById('main'), {
  data: [],
  labels: {},
  selected: 0,
  setData(rows) {
    let labels = {};
    let ids = new Array(rows.length);
    for (let i = 0; i < rows.length; i++) {
      labels[rows[i].id] = rows[i].label;
      ids[i] = rows[i].id;
    }
    this.labels = labels;
    this.data.splice(0, this.data.length, ...ids);
    this.selected = 0;
  },
  run()      { this.setData(buildData(1000)) },
  runLots()  { this.setData(buildData(10000)) },
  add()      {
    let rows = buildData(1000);
    for (let row of rows) this.labels[row.id] = row.label;
    this.data.push(...rows.map(row => row.id));
  },
  update()   { for (let i = 0, d = this.data; i < d.length; i += 10) this.labels[d[i]] += ' !!!' },
  clear()    { this.data.length = 0; this.labels = {}; this.selected = 0 },
  swapRows() {
    let d = this.data;
    if (d.length > 998) { let tmp = d[1]; d[1] = d[998]; d[998] = tmp }
  },
  select(id) { this.selected = id },
  remove(id) {
    let idx = this.data.indexOf(id);
    this.data.splice(idx, 1);
  }
});
