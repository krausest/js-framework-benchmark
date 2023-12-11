import { div, h1, rendr } from '@rendrjs/core';
import { Button } from './Button';

let header = div({
  class: 'col-md-6',
  slot: h1({ slot: 'Rendrjs keyed' }),
});

export let Jumbotron = (props) => {
  return div({
    class: 'jumbotron',
    slot: div({
      class: 'row',
      slot: [
        header,
        div({
          class: 'col-md-6',
          slot: div({
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
