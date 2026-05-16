import { atom, map } from "nanostores";

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
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
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

let nextId = 1;
const random = (max) => Math.round(Math.random() * 1000) % max;

const buildData = (count) => {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`,
    };
  }
  return data;
};

export const rows = map({});
export const selectedId = atom(null);
export const actions = atom(null);

let ids = [];

export const run = () => {
  const data = buildData(1000);
  const obj = {};
  ids = [];
  for (const d of data) {
    obj[d.id] = d;
    ids.push(d.id);
  }
  actions.set({ type: "set", ids: ids.slice(), data: obj });
};

export const runLots = () => {
  const data = buildData(10000);
  const obj = {};
  ids = [];
  for (const d of data) {
    obj[d.id] = d;
    ids.push(d.id);
  }
  actions.set({ type: "set", ids: ids.slice(), data: obj });
};

export const add = () => {
  const data = buildData(1000);
  const newIds = data.map((d) => d.id);
  ids = [...ids, ...newIds];
  actions.set({ type: "append", data, ids: newIds });
};

export const update = () => {
  const updated = [];
  for (let i = 0; i < ids.length; i += 10) updated.push(ids[i]);
  actions.set({ type: "update", ids: updated });
};

export const clear = () => {
  actions.set({ type: "clear" });
};

export const swapRows = () => {
  if (ids.length <= 998) return;
  const a = ids[1],
    b = ids[998];
  ids[1] = b;
  ids[998] = a;
  actions.set({ type: "swap", a, b });
};

export const removeRow = (id) => {
  const idx = ids.indexOf(id);
  if (idx < 0) return;
  ids.splice(idx, 1);
  actions.set({ type: "remove", id });
};

export const select = (id) => selectedId.set(id);
