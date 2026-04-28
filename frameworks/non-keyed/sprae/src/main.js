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
  selected: null,
  run()      { this.data = buildData(1000); this.selected = null },
  runLots()  { this.data = buildData(10000); this.selected = null },
  add()      { this.data = this.data.concat(buildData(1000)) },
  update()   { for (let i = 0, d = this.data; i < d.length; i += 10) d[i].label += ' !!!' },
  clear()    { this.data = []; this.selected = null },
  swapRows() {
    let d = this.data;
    if (d.length > 998) { let tmp = d[1]; d[1] = d[998]; d[998] = tmp }
  },
  select(item) { this.selected = item },
  remove(item) {
    let idx = this.data.findIndex(d => d.id === item.id);
    this.data.splice(idx, 1);
  }
});
