import { cellFor } from '@lifeart/gxt';

export interface Item {
  id: number;
  label: string;
}

function _random(max: number) {
  return (Math.random() * max) | 0;
}

let rowId = 1;

export function buildData(count = 1000) {
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
    ],
    colours = [
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
    ],
    nouns = [
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
    ],
    data = [];
  for (let i = 0; i < count; i++) {
    const label =
      adjectives[_random(adjectives.length)] +
      ' ' +
      colours[_random(colours.length)] +
      ' ' +
      nouns[_random(nouns.length)];

    const item = {
      id: rowId++,
      label,
    };
    // making it reactive
    cellFor(item, 'label');
    data.push(item);
  }
  return data;
}

export const swapRows = (data: Item[]): Item[] => {
  const newData: Item[] = [...data];
  if (newData.length > 998) {
    const temp = newData[1];
    newData[1] = newData[998] as Item;
    newData[998] = temp as Item;
  }
  return newData;
};

export const updateData = (data: Item[], mod = 10): Item[] => {
  for (let i = 0; i < data.length; i += mod) {
    let item = data[i] as Item;
    item.label = item.label + ' !!!';
  }
  return data;
};
