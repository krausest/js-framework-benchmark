import { div, h1, rendr, useAtomSetter } from '@rendrjs/core';
import { Button } from './Button';
import { colMd6 } from './classes';
import { dataAtom, selectedAtom } from './store';

let header = div({
  class: colMd6,
  slot: h1({ slot: 'Rendrjs atoms keyed' }),
});


let random = (max) => Math.round(Math.random() * 1000) % max;

let A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
let C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
let N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let nextId = 1;

let buildData = (count) => {
  let data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};


export let Jumbotron = () => {
  let setData = useAtomSetter(dataAtom);
  let setSelected = useAtomSetter(selectedAtom);

  let run = () => {
    setData(buildData(1000));
    setSelected(0);
  };
  let lots = () => {
    setData(buildData(10000));
    setSelected(0);
  };
  let clear = () => {
    setData([]);
    setSelected(0);
  };
  let update = () => setData(old => {
    for (let i = 0; i < old.length; i += 10) {
      old[i].label += ' !!!';
    }
    return [ ...old ];
  });
  let swap = () => {
    setData(old => {
      if (old.length > 998) {
        let one = old[1];
        old[1] = old[998];
        old[998] = one;
      }
      return [ ...old ];
    });
    setSelected(0);
  };
  let push = () => setData(old => (old.concat(buildData(1000))));

  return div({
    class: 'jumbotron',
    slot: div({
      class: 'row',
      slot: [
        header,
        div({
          class: colMd6,
          slot: div({
            class: 'row',
            slot: [
              rendr(Button, { id: 'run', text: 'Create 1,000 rows', cb: run }),
              rendr(Button, { id: 'runlots', text: 'Create 10,000 rows', cb: lots }),
              rendr(Button, { id: 'add', text: 'Append 1,000 rows', cb: push }),
              rendr(Button, { id: 'update', text: 'Update every 10th row', cb: update }),
              rendr(Button, { id: 'clear', text: 'Clear', cb: clear }),
              rendr(Button, { id: 'swaprows', text: 'Swap rows', cb: swap }),
            ],
          }),
        }),
      ],
    }),
  });
};
