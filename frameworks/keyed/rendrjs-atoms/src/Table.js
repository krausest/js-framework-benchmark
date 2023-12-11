import { table, tbody, rendr, useAtomValue } from '@rendrjs/core';
import { dataAtom } from './store';
import { Row } from './Row';

export let Table = () => {
  let data = useAtomValue(dataAtom);

  return table({
    class: 'table table-hover table-striped test-data',
    slot: tbody({
      slot: data.map(item => rendr(Row, { key: item.id, item, memo: [item.label] })),
    }),
  });
};