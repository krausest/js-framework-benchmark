import { rendr } from '@rendrjs/core';
import { colMd1, colMd4, colMd6 } from './classes';
import { makeIcon } from './RemoveIcon';

let icon = makeIcon();
let emptyTd = rendr('td', { class: colMd6 });

export let Row = ({ hi, sel, item, del }) => {
  return rendr('tr', {
    class: hi ? 'danger' : undefined,
    slot: [
      rendr('td', {
        class: colMd1,
        slot: `${item.id}`,
      }),
      rendr('td', {
        class: colMd4,
        slot: rendr('a', {
          onclick: () => sel(item.id),
          slot: item.label,
        }),
      }),
      rendr('td', {
        class: colMd1,
        slot: rendr('a', {
          onclick: () => del(item.id),
          slot: icon,
        }),
      }),
      emptyTd,
    ],
  });
};
