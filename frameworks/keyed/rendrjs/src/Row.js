import { a, td, tr } from '@rendrjs/core';
import { colMd1, colMd4, colMd6 } from './classes';
import { makeIcon } from './RemoveIcon';

let icon = makeIcon();
let emptyTd = td({ class: colMd6 });

export let Row = ({ hi, sel, item, del }) => {
  return tr({
    class: hi ? 'danger' : undefined,
    slot: [
      td({ class: colMd1, slot: `${item.id}` }),
      td({
        class: colMd4,
        slot: a({
          onclick: () => sel(item.id),
          slot: item.label,
        }),
      }),
      td({
        class: colMd1,
        slot: a({
          onclick: () => del(item.id),
          slot: icon,
        }),
      }),
      emptyTd,
    ],
  });
};
