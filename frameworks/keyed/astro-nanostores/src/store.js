import { atom } from "nanostores";

const adjectives = ["pretty","large","big","small","tall","short","long","handsome","plain",
  "quaint","clean","elegant","easy","angry","crazy","helpful","mushy","odd","unsightly",
  "adorable","important","inexpensive","cheap","expensive","fancy"];
const colours = ["red","yellow","blue","green","pink","brown","purple","brown","white","black","orange"];
const nouns = ["table","chair","house","bbq","desk","car","pony","cookie","sandwich","burger",
  "pizza","mouse","keyboard"];

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

export const rows = atom([]);
export const orderedIds = atom([]);
export const selectedId = atom(null);

export const run = () => {
  const data = buildData(1000);
  rows.set(data);
  orderedIds.set(data.map((d) => d.id));
  selectedId.set(null);
};

export const runLots = () => {
  const data = buildData(10000);
  rows.set(data);
  orderedIds.set(data.map((d) => d.id));
  selectedId.set(null);
};

export const add = () => {
  const newData = buildData(1000);
  rows.set([...rows.get(), ...newData]);
  orderedIds.set([...orderedIds.get(), ...newData.map((d) => d.id)]);
};

export const update = () => {
  const current = rows.get().slice();
  for (let i = 0; i < current.length; i += 10) {
    current[i] = { id: current[i].id, label: current[i].label + " !!!" };
  }
  rows.set(current);
};

export const clear = () => {
  rows.set([]);
  orderedIds.set([]);
  selectedId.set(null);
};

export const swapRows = () => {
  const ids = orderedIds.get().slice();
  if (ids.length <= 998) return;
  const tmp = ids[1];
  ids[1] = ids[998];
  ids[998] = tmp;
  orderedIds.set(ids);
};

export const removeRow = (id) => {
  const current = rows.get();
  const idx = current.findIndex((d) => d.id === id);
  if (idx < 0) return;
  rows.set([...current.slice(0, idx), ...current.slice(idx + 1)]);
  orderedIds.set(orderedIds.get().filter((x) => x !== id));
};

export const select = (id) => selectedId.set(id);
