import { rendr } from '@rendrjs/core';

let Row = props => {
  return rendr('tr', {
    class: props.sel ? 'danger' : undefined,
    slot: [
      rendr('td', {
        class: 'col-md-1',
        slot: `${props.item.id}`,
      }),
      rendr('td', {
        class: 'col-md-4',
        slot: rendr('a', {
          onclick: () => props.select(props.item.id),
          slot: props.item.label,
        }),
      }),
      rendr('td', {
        class: 'col-md-1',
        slot: rendr('a', {
          onclick: () => props.del(props.item.id),
          slot: rendr('span', {
            class: 'glyphicon glyphicon-remove',
            'aria-hidden': true,
          }),
        }),
      }),
      rendr('td', {
        class: 'col-md-6',
      }),
    ],
  });
};

export default Row;
