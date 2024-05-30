import { element, component, useAtomValue } from '@rendrjs/core';
import { dataAtom } from './store';
import { Row } from './Row';

export let Table = () => {
  let data = useAtomValue(dataAtom);

  return element('table', {
    class: 'table table-hover table-striped test-data',
    slot: element('tbody', {
      slot: data.map(item => component(Row, { key: item.id, item, memo: [item.label] })),
    }),
  });
};
