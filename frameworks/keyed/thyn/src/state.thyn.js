let rowId = 1;
export const data = $signal([]);
export const selected = $signal();

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = dict => dict[Math.round(Math.random() * 1000) % dict.length];

export const buildData = (count) => {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: rowId++,
      label: $signal(`${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`),
    };
  }
  return data;
};
