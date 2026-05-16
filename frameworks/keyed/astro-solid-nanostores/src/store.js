import { atom } from 'nanostores';

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint',
  'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable',
  'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger',
  'pizza', 'mouse', 'keyboard'];

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
export const selectedId = atom(null);

export const run = () => { rows.set(buildData(1000)); selectedId.set(null); };
export const runLots = () => { rows.set(buildData(10000)); selectedId.set(null); };
export const add = () => rows.set([...rows.get(), ...buildData(1000)]);
export const update = () => {
  const current = rows.get().slice();
  for (let i = 0; i < current.length; i += 10) {
    current[i] = { id: current[i].id, label: current[i].label + ' !!!' };
  }
  rows.set(current);
};
export const clear = () => { rows.set([]); selectedId.set(null); };
export const swapRows = () => {
  const current = rows.get().slice();
  if (current.length <= 998) return;
  const tmp = current[1];
  current[1] = current[998];
  current[998] = tmp;
  rows.set(current);
};
export const removeRow = (id) => {
  const current = rows.get();
  const idx = current.findIndex((d) => d.id === id);
  if (idx < 0) return;
  rows.set([...current.slice(0, idx), ...current.slice(idx + 1)]);
};
export const select = (id) => selectedId.set(id);
