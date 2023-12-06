import { button, div } from '@rendrjs/core';
import { colSm6 } from './classes';

export let Button = (props) => {
  return div({
    class: `${colSm6} smallpad`,
    slot: button({
      id: props.id,
      onclick: props.cb,
      type: 'button',
      class: 'btn btn-primary btn-block',
      slot: props.text,
    }),
  });
};
