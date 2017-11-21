import { updateNextFrame } from "ivi";
import { createStore, mut } from "ivi-state";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count = 1000) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

export const store = createStore(
  { data: mut([]), selected: null },
  function (state, action) {
    const data = state.data.ref;
    switch (action.type) {
      case "delete":
        data.splice(data.indexOf(action.item), 1);
        return { data: mut(data), selected: state.selected };
      case "run":
        return { data: mut(buildData(1000)), selected: null };
      case "add":
        return { data: mut(state.data.ref.concat(buildData(1000))), selected: state.selected };
      case "update":
        for (let i = 0; i < data.length; i += 10) {
          const r = data[i];
          data[i] = { id: r.id, label: r.label + " !!!" };
        }
        return { data: state.data, selected: state.selected };
      case "select":
        return { data: state.data, selected: action.item };
      case "runlots":
        return { data: mut(buildData(10000)), selected: null };
      case "clear":
        return { data: mut([]), selected: null };
      case "swaprows":
        if (data.length > 998) {
          const a = data[1];
          data[1] = data[998];
          data[998] = a;
        }
        return { data: mut(data), selected: state.selected };
    }
    return state;
  },
  updateNextFrame
);
