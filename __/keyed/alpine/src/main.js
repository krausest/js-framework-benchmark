import Alpine from 'alpinejs'

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
  }
  return data;
}

window.app = function() {
  return {
    data: [],
    selected: undefined,

    add() { this.data = this.data.concat(buildData(1000)) },
    clear() {
      this.data = [];
      this.selected = undefined;
    },
    update() {
      for (let i = 0; i < this.data.length; i += 10) {
        this.data[i].label += ' !!!';
      }
    },
    remove(id) {
      const idx = this.data.findIndex(d => d.id === id);
      this.data.splice(idx, 1);
    },
    run() {
      this.data = buildData(1000);
      this.selected = undefined;
    },
    runLots() {
      this.data = buildData(10000);
      this.selected = undefined;
    },
    select(id) { this.selected = id },
    swapRows() {
      const d = this.data;
      if (d.length > 998) {
        const tmp = d[998];
        d[998] = d[1];
        d[1] = tmp;
      }
    }
  }
}

Alpine.start();