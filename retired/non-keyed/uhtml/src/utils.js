// variant of https://github.com/krausest/js-framework-benchmark/blob/master/frameworks/keyed/vanillajs-lite/src/Main.js

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const { round, random } = Math;
const pick = list => list[round(random() * 1000) % list.length];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;

let TR, ID = 1, SEL = 0, SIZE = 0, DATA = [];

// creats rows but it keep track of created data so
// that it's possible to modify it and reflect next time it's needed
export const create = (count, add) => {
  if (count < 1) {
    if (count < 0) return DATA;
    else TR = null;
  }
  if (add) count += SIZE;
  else DATA = [];
  for (let i = add ? SIZE : 0; i < count; i++) {
    const id = ID++;
    DATA[i] = { id, label: label(), selected: SEL === id };
  }
  SIZE = count;
  return DATA;
};

// create once a handler that keep data state updated
// by selecting something or removing it
export const handle = type => ({ currentTarget }) => {
  const tr = currentTarget.closest('tr');
  const id = +tr.id;
  switch (type) {
    case 'select': {
      if (SEL === id) return;
      if (TR) TR.className = '';
      tr.className = 'danger';
      TR = tr;
      SEL = id;
      break;
    }
    case 'remove': {
      if (SEL === id) {
          TR = null;
          SEL = 0;
      }
      DATA.splice(DATA.findIndex(row => row.id === id), 1);
      SIZE--;
      tr.remove();
      break;
    }
  }
};
