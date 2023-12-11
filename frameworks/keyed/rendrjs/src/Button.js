import { button, div } from '@rendrjs/core';

export let Button = (props) => {
  return div({
    class: 'col-sm-6 smallpad',
    slot: button({
      id: props.id,
      onclick: props.cb,
      type: 'button',
      class: 'btn btn-primary btn-block',
      slot: props.text,
    }),
  });
};
