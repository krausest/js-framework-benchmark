import { rendr, useCallback, useState } from '@rendrjs/core';
import Jumbotron from './Jumbotron';
import Row from './Row';

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let nextId = 1;

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};

const preloadIcon = rendr('span', {
  className: 'preloadicon glyphicon glyphicon-remove',
  'aria-hidden': true,
});

const App = () => {
  const [state, setState] = useState({ data: [], selected: 0 });

  const onRun = useCallback(() => setState({ data: buildData(1000), selected: 0 }), []);
  const onRunlots = useCallback(() => setState({ data: buildData(10000), selected: 0 }), []);
  const onClear = useCallback(() => setState({ data: [], selected: 0 }), []);
  const onUpdate = useCallback(() => setState(old => {
    const newData = old.data.slice(0);
    for (let i = 0; i < newData.length; i += 10) {
      const r = newData[i];
      newData[i] = { id: r.id, label: r.label + ' !!!' };
    }
    return { data: newData, selected: old.selected };
  }), []);
  const onSwap = useCallback(() => setState(old => {
    if (old.data.length > 998) {
      const d1 = old.data[1];
      const d998 = old.data[998];
      old.data[1] = d998;
      old.data[998] = d1;
      return { ...old };
    }
    return { data: old.data, selected: 0 };
  }), []);
  const onAppend = useCallback(() => setState(old => {
    return { data: old.data.concat(buildData(1000)), selected: old.selected };
  }), []);
  const onDelete = useCallback((id) => setState(old => {
    old.data.splice(old.data.findIndex((d) => d.id === id), 1);
    return { ...old };
  }), []);
  const onSelect = useCallback((id) => setState(old => ({ ...old, selected: id })), []);

  return rendr('div', {
    className: 'container',
    slot: [
      rendr(Jumbotron, { onRun, onRunlots, onClear, onUpdate, onSwap, onAppend, memo: [] }),
      rendr('table', {
        className: 'table table-hover table-striped test-data',
        slot: rendr('tbody', {
          slot: state.data.map(item => rendr(Row, {
            key: `${item.id}`,
            item: item,
            selected: state.selected === item.id,
            onSelect,
            onDelete,
            memo: [item.id === state.selected, item.label],
          })),
        }),
      }),
      preloadIcon,
    ],
  });
};

export default App;
