import { element, text, useAtomSelector, useAtomSetter } from '@rendrjs/core';
import { makeIcon } from './RemoveIcon';
import { dataAtom, selectedAtom } from './store';
 
let icon = makeIcon();
let emptyTd = element('td', { class: 'col-md-6' });
export let Row = ({ item: { id, label } }) => {
  let setData = useAtomSetter(dataAtom);
  let setSelected = useAtomSetter(selectedAtom);
  let selected = useAtomSelector(selectedAtom, s => s === id);

  return element('tr', {
    class: selected ? 'danger' : undefined,
    slot: [
      element('td', { class: 'col-md-1', slot: text(`${id}`) }),
      element('td', {
        class: 'col-md-4',
        slot: element('a', {
          onclick: () => setSelected(id),
          slot: text(label),
        }),
      }),
      element('td', {
        class: 'col-md-1',
        slot: element('a', {
          onclick: () => setData(old => {
            old.splice(old.findIndex(d => d.id === id), 1);
            return [ ...old ];
          }),
          slot: icon,
        }),
      }),
      emptyTd,
    ],
  });
};
