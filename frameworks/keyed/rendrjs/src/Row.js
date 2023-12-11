import { a, td, tr } from '@rendrjs/core';
import { makeIcon } from './RemoveIcon';

let icon = makeIcon();
let emptyTd = td({ class: 'col-md-6' });

export let Row = ({ hi, sel, item, del }) => {
  return tr({
    class: hi ? 'danger' : undefined,
    slot: [
      td({ class: 'col-md-1', slot: `${item.id}` }),
      td({
        class: 'col-md-4',
        slot: a({
          onclick: () => sel(item.id),
          slot: item.label,
        }),
      }),
      td({
        class: 'col-md-1',
        slot: a({
          onclick: () => del(item.id),
          slot: icon,
        }),
      }),
      emptyTd,
    ],
  });
};
