import { rendr } from '@rendrjs/core';
import Button from './Button';

const Jumbotron = (props) => {
  return rendr('div', {
    className: 'jumbotron',
    slot: rendr('div', {
      className: 'row',
      slot: [
        rendr('div', {
          className: 'col-md-6',
          slot: rendr('h1', { slot: 'Rendrjs keyed' }),
        }),
        rendr('div', {
          className: 'col-md-6',
          slot: rendr('div', {
            className: 'row',
            slot: [
              rendr(Button, { id: 'run', title: 'Create 1,000 rows', cb: props.onRun }),
              rendr(Button, { id: 'runlots', title: 'Create 10,000 rows', cb: props.onRunlots }),
              rendr(Button, { id: 'add', title: 'Append 1,000 rows', cb: props.onAppend }),
              rendr(Button, { id: 'update', title: 'Update every 10th row', cb: props.onUpdate }),
              rendr(Button, { id: 'clear', title: 'Clear', cb: props.onClear }),
              rendr(Button, { id: 'swaprows', title: 'Swap rows', cb: props.onSwap }),
            ],
          }),
        }),
      ],
    }),
  });
};

export default Jumbotron;
