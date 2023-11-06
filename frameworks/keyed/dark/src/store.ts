import { type Atom, atom } from "@dark-engine/core";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

let rowId = 1;
const adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const colours = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
];
const nouns = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];

export type Item = {
  id: number;
  label$: Atom<string>;
};

function buildData(count: number) {
  const result: Array<Item> = [];

  for (let i = 0; i < count; i++) {
    result.push({
      id: rowId++,
      label$: atom(
        adjectives[random(adjectives.length)] +
          " " +
          colours[random(colours.length)] +
          " " +
          nouns[random(nouns.length)]
      ),
    });
  }

  return result;
}

type State = {
  data$: Atom<Array<Item>>;
  selected$: Atom<number>;
};

class Store {
  private state: State = {
    data$: atom([]),
    selected$: atom(),
  };

  getState() {
    return this.state;
  }

  run() {
    this.state.data$.set(buildData(1000));
  }

  runLots() {
    this.state.data$.set(buildData(10000));
  }

  add() {
    const data = this.state.data$.get();
    data.push(...buildData(1000));
    this.state.data$.set(data);
  }

  update() {
    const data = this.state.data$.get();
    for (let i = 0; i < data.length; i += 10) {
      const item = data[i];
      item.label$.set(item.label$.get() + " !!!");
    }
  }

  clear() {
    this.state.data$.set([]);
  }

  swapRows() {
    if (this.state.data$.get().length <= 998) return;
    const data = this.state.data$.get();
    const a = data[1];
    data[1] = data[998];
    data[998] = a;
    this.state.data$.set(data);
  }

  remove(id: number) {
    const data = this.state.data$.get();
    const idx = data.findIndex((x) => x.id === id);
    if (idx === -1) return;
    data.splice(idx, 1);
    this.state.data$.set(data);
  }

  select(id: number) {
    this.state.selected$.set(id);
  }
}

export { Store };
