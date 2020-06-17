import { createOvermind } from "overmind";
import { createHook } from "overmind-react";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = [
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
const C = [
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
const N = [
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

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }
  return data;
}

export const app = createOvermind({
  state: {
    data: [],
    selected: 0,
  },
  actions: {
    run({ state }) {
      state.data = buildData(1000);
    },
    runLots({ state }) {
      state.data = buildData(10000);
    },
    add({ state }) {
      state.data.push(...buildData(1000));
    },
    update({ state }) {
      const data = state.data;
      for (let i = 0; i < data.length; i += 10) {
        const item = data[i];
        data[i] = { id: item.id, label: item.label + " !!!" };
      }
    },
    select(_, item) {
      if (item.selected) {
        delete item.selected;
      } else {
        item.selected = true;
      }
    },
    remove({ state }, item) {
      const data = state.data;
      data.splice(data.indexOf(item), 1);
    },
    clear({ state }) {
      state.data = [];
    },
    swapRows({ state }) {
      const data = state.data;
      if (data.length > 998) {
        let temp = data.splice(1, 1)[0];
        temp = data.splice(997, 1, temp)[0];
        data.splice(1, 0, temp);
      }
    },
  },
});

export const useApp = createHook();
