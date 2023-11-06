import ko from "knockout";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

class HomeViewModel {
  constructor() {
    this.id = 1;
    this.selected = ko.observable(null);
    this.data = ko.observableArray();
  }

  #random(max) {
    return Math.round(Math.random() * 1000) % max;
  }

  buildData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(
        new ItemViewModel(
          {
            id: this.id++,
            label: adjectives[this.#random(adjectives.length)] + " " + colours[this.#random(colours.length)] + " " + nouns[this.#random(nouns.length)],
          },
          this,
        ),
      );
    }
    return data;
  }

  run() {
    this.data(this.buildData(1000));
    this.selected(null);
  }

  runLots() {
    this.data(this.buildData(10000));
    this.selected(null);
  }

  add() {
    this.data.push.apply(this.data, this.buildData(1000));
  }

  update() {
    const tmp = this.data();
    for (let i = 0; i < tmp.length; i += 10) {
      tmp[i].label(tmp[i].label() + " !!!");
    }
  }

  clear() {
    this.data.removeAll();
    this.selected(null);
  }

  swapRows() {
    const tmp = this.data();
    if (tmp.length > 998) {
      const a = tmp[1];
      tmp[1] = tmp[998];
      tmp[998] = a;
      this.data(tmp);
    }
  }

  select(id) {
    this.selected(id);
  }

  del(item) {
    const tmp = this.data();
    const idx = tmp.findIndex((d) => d.id === item.id);
    this.data.splice(idx, 1);
  }
}

class ItemViewModel {
  constructor(data, parent) {
    this.id = ko.observable(data.id);
    this.label = ko.observable(data.label);
    this.parent = parent;
  }

  del() {
    this.parent.del(this);
  }

  select() {
    this.parent.select(this.id());
  }
}

const main = document.getElementById("main");
const homeView = new HomeViewModel();

ko.applyBindings(homeView, main);
