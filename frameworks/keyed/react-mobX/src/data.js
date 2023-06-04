import { RowStore } from './RowStore';

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

let id = 1;

const random = (max) => Math.round(Math.random() * 1000) % max;

export const buildData = (count) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push(
      new RowStore(
        id++,
        adjectives[random(adjectives.length)] +
          ' ' +
          colours[random(colours.length)] +
          ' ' +
          nouns[random(nouns.length)]
      )
    );
  }

  return data;
};
