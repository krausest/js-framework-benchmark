import { rendr, useCallback, useState } from '@rendrjs/core';
import Jumbotron from './Jumbotron';
import Row from './Row';

let random = (max) => Math.round(Math.random() * 1000) % max;

let A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
let C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
let N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let nextId = 1;

let buildData = (count) => {
  let data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};

let preloadIcon = rendr('span', {
  class: 'preloadicon glyphicon glyphicon-remove',
  'aria-hidden': true,
});

let App = () => {
  let [state, setState] = useState({ arr: [], sel: 0 });

  let run = useCallback(() => setState({ arr: buildData(1000), sel: 0 }), []);
  let lots = useCallback(() => setState({ arr: buildData(10000), sel: 0 }), []);
  let clear = useCallback(() => setState({ arr: [], sel: 0 }), []);
  let update = useCallback(() => setState(old => {
    for (let i = 0; i < old.arr.length; i += 10) {
      old.arr[i].label += ' !!!';
    }
    return { ...old };
  }), []);
  let swap = useCallback(() => setState(old => {
    if (old.arr.length > 998) {
      let one = old.arr[1];
      old.arr[1] = old.arr[998];
      old.arr[998] = one;
    }
    return { ...old, sel: 0 };
  }), []);
  let push = useCallback(() => setState(old => ({ arr: old.arr.concat(buildData(1000)), sel: old.sel })), []);
  let del = useCallback((id) => setState(old => {
    old.arr.splice(old.arr.findIndex((d) => d.id === id), 1);
    return { ...old };
  }), []);
  let select = useCallback((id) => setState(old => ({ ...old, sel: id })), []);

  return rendr('div', {
    class: 'container',
    slot: [
      rendr(Jumbotron, { run, lots, clear, update, swap, push, memo: [] }),
      rendr('table', {
        class: 'table table-hover table-striped test-data',
        slot: rendr('tbody', {
          slot: state.arr.map(item => rendr(Row, {
            key: `${item.id}`,
            item,
            sel: state.sel === item.id,
            select,
            del,
            memo: [item.id === state.sel, item.label],
          })),
        }),
      }),
      preloadIcon,
    ],
  });
};

export default App;
