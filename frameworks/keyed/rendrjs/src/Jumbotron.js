import { rendr } from '@rendrjs/core';
import { Button } from './Button';
import { colMd6 } from './classes';

let h1 = rendr('div', {
  class: colMd6,
  slot: rendr('h1', { slot: 'Rendrjs keyed' }),
});

export let Jumbotron = (props) => {
  return rendr('div', {
    class: 'jumbotron',
    slot: rendr('div', {
      class: 'row',
      slot: [
        h1,
        rendr('div', {
          class: colMd6,
          slot: rendr('div', {
            class: 'row',
            slot: [
              rendr(Button, { id: 'run', text: 'Create 1,000 rows', cb: props.run }),
              rendr(Button, { id: 'runlots', text: 'Create 10,000 rows', cb: props.lots }),
              rendr(Button, { id: 'add', text: 'Append 1,000 rows', cb: props.push }),
              rendr(Button, { id: 'update', text: 'Update every 10th row', cb: props.update }),
              rendr(Button, { id: 'clear', text: 'Clear', cb: props.clear }),
              rendr(Button, { id: 'swaprows', text: 'Swap rows', cb: props.swap }),
            ],
          }),
        }),
      ],
    }),
  });
};
