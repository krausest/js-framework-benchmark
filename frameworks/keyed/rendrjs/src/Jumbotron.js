import { div, h1, button } from '@rendrjs/core';

let A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
let C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
let N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let rand = arr => arr[Math.round(Math.random() * 1000) % arr.length];

let nextId = 1;

let buildData = (count = 1000) => {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${rand(A)} ${rand(C)} ${rand(N)}`,
    };
  }
  return data;
};

let btn = (id, slot, onclick) => div({
  class: 'col-sm-6 smallpad',
  slot: button({
    id,
    onclick,
    type: 'button',
    class: 'btn btn-primary btn-block',
    slot,
  }),
});

export let Jumbotron = ({ set }) => div({
  class: 'jumbotron',
  slot: div({
    class: 'row',
    slot: [
      div({
        class: 'col-md-6',
        slot: h1('Rendrjs'),
      }),
      div({
        class: 'col-md-6',
        slot: div({
          class: 'row',
          slot: [
            btn('run', 'Create 1,000 rows', () => set({ arr: buildData() })),
            btn('runlots', 'Create 10,000 rows', () => set({ arr: buildData(10000) })),
            btn('add', 'Append 1,000 rows', () => set(old => ({ ...old, arr: old.arr.concat(buildData()) }))),
            btn('update', 'Update every 10th row', () => set(old => {
              for (let i = 0; i < old.arr.length; i += 10) {
                old.arr[i].label += ' !!!';
              }
              return { ...old };
            })),
            btn('clear', 'Clear', () => set({ arr: [] })),
            btn('swaprows', 'Swap rows', () => set(old => {
              let two = old.arr[998];
              if (two) {
                old.arr[998] = old.arr[1];
                old.arr[1] = two;
              }
              return { ...old };
            })),
          ],
        }),
      }),
    ],
  }),
});
