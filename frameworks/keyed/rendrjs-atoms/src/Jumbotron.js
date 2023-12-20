import { div, h1, useAtomSetter, button } from '@rendrjs/core';
import { dataAtom, selectedAtom } from './store';

let random = arr => arr[Math.round(Math.random() * 1000) % arr.length];

let A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
let C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
let N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let nextId = 1;

let buildData = (count = 1000) => {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${random(A)} ${random(C)} ${random(N)}`,
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
})

export let Jumbotron = () => {
  let setData = useAtomSetter(dataAtom);
  let setSelected = useAtomSetter(selectedAtom);

  return div({
    class: 'jumbotron',
    slot: div({
      class: 'row',
      slot: [
        div({
          class: 'col-md-6',
          slot: h1('Rendrjs atoms'),
        }),
        div({
          class: 'col-md-6',
          slot: div({
            class: 'row',
            slot: [
              btn('run', 'Create 1,000 rows', () => {
                setData(buildData());
                setSelected(0);
              }),
              btn('runlots', 'Create 10,000 rows', () => {
                setData(buildData(10000));
                setSelected(0);
              }),
              btn('add', 'Append 1,000 rows', () => setData(old => old.concat(buildData()))),
              btn('update', 'Update every 10th row', () => setData(old => {
                for (let i = 0; i < old.length; i += 10) {
                  old[i].label += ' !!!';
                }
                return [ ...old ];
              })),
              btn('clear', 'Clear', () => {
                setData([]);
                setSelected(0);
              }),
              btn('swaprows', 'Swap rows', () => {
                setData(old => {
                  let two = old[998];
                  if (two) {
                    old[998] = old[1];
                    old[1] = two;
                  }
                  return [ ...old ];
                });
                setSelected(0);
              }),
            ],
          }),
        }),
      ],
    }),
  });
};
