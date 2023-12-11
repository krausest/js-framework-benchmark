import { a, td, tr, useAtomSelector, useAtomSetter } from '@rendrjs/core';
import { colMd1, colMd4, colMd6 } from './classes';
import { makeIcon } from './RemoveIcon';
import { dataAtom, selectedAtom } from './store';
 
let icon = makeIcon();
let emptyTd = td({ class: colMd6 });

export let Row = ({ item }) => {
  let setData = useAtomSetter(dataAtom);
  let setSelected = useAtomSetter(selectedAtom);
  let selected = useAtomSelector(selectedAtom, s => s === item.id);

  let del = (id) => setData(old => {
    old.splice(old.findIndex((d) => d.id === id), 1);
    return [ ...old ];
  });

  return tr({
    class: selected ? 'danger' : undefined,
    slot: [
      td({ class: colMd1, slot: `${item.id}` }),
      td({
        class: colMd4,
        slot: a({
          onclick: () => setSelected(item.id),
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
