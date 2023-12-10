import { button, div } from '@rendrjs/core';
import { colSm6 } from './classes';

let className = colSm6 + ' smallpad';
export let Button = (props) => {
  return div({
    class: className,
    slot: button({
      id: props.id,
      onclick: props.cb,
      type: 'button',
      class: 'btn btn-primary btn-block',
      slot: props.text,
    }),
  });
};
