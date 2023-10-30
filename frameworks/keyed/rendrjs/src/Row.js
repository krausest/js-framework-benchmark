import { rendr } from '@rendrjs/core';

const Row = (props) => {
  return rendr('tr', {
    className: props.selected ? 'danger' : undefined,
    slot: [
      rendr('td', {
        className: 'col-md-1',
        slot: `${props.item.id}`,
      }),
      rendr('td', {
        className: 'col-md-4',
        slot: rendr('a', {
          onclick: () => props.onSelect(props.item.id),
          slot: props.item.label,
        }),
      }),
      rendr('td', {
        className: 'col-md-1',
        slot: rendr('a', {
          onclick: () => props.onDelete(props.item.id),
          slot: rendr('span', {
            className: 'glyphicon glyphicon-remove',
            'aria-hidden': true,
          }),
        }),
      }),
      rendr('td', {
        className: 'col-md-6',
      }),
    ],
  });
};

export default Row;
