import { element, useAtomSetter, text } from '@rendrjs/core';
import { dataAtom, selectedAtom } from './store';

let adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
let colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
let nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

  let rand = arr => arr[Math.floor(Math.random() * arr.length)];

  let nextId = 1;
  
  let buildData = (count = 1000) => {
    let data = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = {
        id: nextId++,
        label: rand(adjectives) + ' ' + rand(colors) + ' ' + rand(nouns),
      };
    }
    return data;
  };

let btn = (id, txt, onclick) => element('div', {
  class: 'col-sm-6 smallpad',
  slot: element('button', {
    id,
    onclick,
    type: 'button',
    class: 'btn btn-primary btn-block',
    slot: text(txt),
  }),
})

export let Jumbotron = () => {
  let setData = useAtomSetter(dataAtom);
  let setSelected = useAtomSetter(selectedAtom);

  return element('div', {
    class: 'jumbotron',
    slot: element('div', {
      class: 'row',
      slot: [
        element('div', {
          class: 'col-md-6',
          slot: element('h1', { slot: text('Rendrjs atoms') }),
        }),
        element('div', {
          class: 'col-md-6',
          slot: element('div', {
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
