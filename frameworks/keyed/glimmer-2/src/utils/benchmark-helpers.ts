import { tracked } from '@glimmer/tracking';

class TodoItem {
  @tracked label;
  @tracked id;
  constructor({ label, id }) {
    this.label = label;
    this.id = id;
  }
}

interface ItemsSnapshot {
  id: number;
  data: TodoItem[];
}

const _random = (max): number => {
  return Math.round(Math.random() * 1000) % max;
};

const updateData = (data, mod = 10): TodoItem[] => {
  for (let i = 0; i < data.length; i += mod) {
    data[i].label = data[i].label + ' !!!';
  }
  return data;
};

export const buildData = (id, count = 1000): ItemsSnapshot => {
  const adjectives = [
    'pretty',
    'large',
    'big',
    'small',
    'tall',
    'short',
    'long',
    'handsome',
    'plain',
    'quaint',
    'clean',
    'elegant',
    'easy',
    'angry',
    'crazy',
    'helpful',
    'mushy',
    'odd',
    'unsightly',
    'adorable',
    'important',
    'inexpensive',
    'cheap',
    'expensive',
    'fancy',
  ];

  const colours = [
    'red',
    'yellow',
    'blue',
    'green',
    'pink',
    'brown',
    'purple',
    'brown',
    'white',
    'black',
    'orange',
  ];

  const nouns = [
    'table',
    'chair',
    'house',
    'bbq',
    'desk',
    'car',
    'pony',
    'cookie',
    'sandwich',
    'burger',
    'pizza',
    'mouse',
    'keyboard',
  ];

  const data = [];

  for (let i = 0; i < count; i++)
    data.push(
      new TodoItem({
        id: id++,
        label:
          adjectives[_random(adjectives.length)] +
          ' ' +
          colours[_random(colours.length)] +
          ' ' +
          nouns[_random(nouns.length)],
      })
    );

  return { data, id };
};

export const add = (id, data): ItemsSnapshot => {
  const newData = buildData(id, 1000);
  return {data: [ ...data, ...newData.data], id: newData.id};
};

export const run = (id): ItemsSnapshot => {
  return buildData(id);
};

export const runLots = (id): ItemsSnapshot => {
  return buildData(id, 10000);
};

export const update = (data): TodoItem[] => {
  return updateData(data);
};

export const swapRows = (data): TodoItem[] => {
  const newData = [...data];
  if (newData.length > 998) {
    const temp = newData[1];
    newData[1] = newData[998];
    newData[998] = temp;
  }
  return newData;
};

export const deleteRow = (data, id): TodoItem[] => {
  return data.filter((d) => {
    return d.id !== id;
  });
};
