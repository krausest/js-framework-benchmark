import { rendr } from '@rendrjs/core';

const Button = (props) => {
  return rendr('div', {
    className: 'col-sm-6 smallpad',
    slot: rendr('button', {
      id: props.id,
      onclick: props.cb,
      type: 'button',
      className: 'btn btn-primary btn-block',
      slot: props.title,
    }),
  });
};

export default Button;
