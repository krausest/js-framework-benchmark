import { a, td, tr } from '@rendrjs/core';
import { makeIcon } from './RemoveIcon';

let icon = makeIcon();
let emptyTd = td({ class: 'col-md-6' });

export let Row = ({ hi, sel, item: { id, label }, del }) => {
  return tr({
    class: hi ? 'danger' : undefined,
    slot: [
      td({ class: 'col-md-1', slot: `${id}` }),
      td({
        class: 'col-md-4',
        slot: a({
          onclick: () => sel(id),
          slot: label,
        }),
      }),
      td({
        class: 'col-md-1',
        slot: a({
          onclick: () => del(id),
          slot: icon,
        }),
      }),
      emptyTd,
    ],
  });
};
