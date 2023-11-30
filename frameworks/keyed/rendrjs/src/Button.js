import { rendr } from '@rendrjs/core';

let Button = (props) => {
  return rendr('div', {
    class: 'col-sm-6 smallpad',
    slot: rendr('button', {
      id: props.id,
      onclick: props.cb,
      type: 'button',
      class: 'btn btn-primary btn-block',
      slot: props.text,
    }),
  });
};

export default Button;
