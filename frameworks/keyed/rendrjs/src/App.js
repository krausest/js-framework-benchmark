import { div, rendr, table, tbody, useState } from '@rendrjs/core';
import { Jumbotron } from './Jumbotron';
import { Row } from './Row';
import { makeIcon } from './RemoveIcon';

let preloadIcon = makeIcon(true);

export let App = () => {
  let [state, setState] = useState({ arr: [] });

  let del = id => setState(old => {
    old.arr.splice(old.arr.findIndex(d => d.id === id), 1);
    return { ...old };
  });
  let sel = id => setState(old => ({ ...old, sel: id }));

  return div({
    class: 'container',
    slot: [
      rendr(Jumbotron, { set: setState, memo: [] }),
      table({
        class: 'table table-hover table-striped test-data',
        slot: tbody({
          slot: state.arr.map(item => rendr(Row, {
            key: item.id,
            item,
            hi: state.sel === item.id,
            sel,
            del,
            memo: [item.id === state.sel, item.label],
          })),
        }),
      }),
      preloadIcon,
    ],
  });
};
