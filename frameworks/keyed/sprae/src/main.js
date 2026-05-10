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
  selected: 0,
  run()      { this.data = buildData(1000); this.selected = 0 },
  runLots()  { this.data = buildData(10000); this.selected = 0 },
  add()      { this.data.push(...buildData(1000)) },
  update()   { for (let i = 0, d = this.data; i < d.length; i += 10) d[i].label += ' !!!' },
  clear()    { this.data = []; this.selected = 0 },
  swapRows() {
    let d = this.data;
    if (d.length > 998) { let tmp = d[1]; d[1] = d[998]; d[998] = tmp }
  },
  select(id) { this.selected = id },
  remove(id) {
    let idx = this.data.findIndex(d => d.id === id);
    this.data.splice(idx, 1);
  }
});
