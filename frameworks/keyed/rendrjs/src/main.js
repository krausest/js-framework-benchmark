import { mount, element, component, useState, text } from '@rendrjs/core';

let adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
  'fancy'];
let colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'];
let nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let rand = arr => arr[Math.floor(Math.random() * arr.length)];

let nextId = 1;

let buildData = (count = 1000) => {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: rand(adjectives) + ' ' + rand(colors) + ' ' + rand(nouns),
    };
  }
  return data;
};

let btn = (id, txt, onclick) => element('div', {
  class: 'col-sm-6 smallpad',
  slot: element('button', {
    id,
    onclick,
    type: 'button',
    class: 'btn btn-primary btn-block',
    slot: text(txt),
  }),
});

let Jumbotron = ({ set }) => element('div', {
  class: 'jumbotron',
  slot: element('div', {
    class: 'row',
    slot: [
      element('div', {
        class: 'col-md-6',
        slot: element('h1', { slot: text('Rendrjs') }),
      }),
      element('div', {
        class: 'col-md-6',
        slot: element('div', {
          class: 'row',
          slot: [
            btn('run', 'Create 1,000 rows', () => set({ arr: buildData() })),
            btn('runlots', 'Create 10,000 rows', () => set({ arr: buildData(10000) })),
            btn('add', 'Append 1,000 rows', () => set(old => ({ ...old, arr: old.arr.concat(buildData()) }))),
            btn('update', 'Update every 10th row', () => set(old => {
              for (let i = 0; i < old.arr.length; i += 10) {
                old.arr[i].label += ' !!!';
              }
              return { ...old };
            })),
            btn('clear', 'Clear', () => set({ arr: [] })),
            btn('swaprows', 'Swap rows', () => set(old => {
              let two = old.arr[998];
              if (two) {
                old.arr[998] = old.arr[1];
                old.arr[1] = two;
              }
              return { ...old };
            })),
          ],
        }),
      }),
    ],
  }),
});

let makeIcon = preload => element('span', {
  class: (preload ? 'preloadicon ' : '') + 'glyphicon glyphicon-remove',
  'aria-hidden': true,
});
let preloadIcon = makeIcon(true);
let normalIcon = makeIcon();
let emptyTd = element('td', { class: 'col-md-6' });

let Row = ({ hi, set, item: { id, label } }) => element('tr', {
  class: hi ? 'danger' : undefined,
  slot: [
    element('td', { class: 'col-md-1', slot: text(`${id}`) }),
    element('td', {
    class: 'col-md-4',
      slot: element('a', {
        onclick: () => set(old => ({ ...old, sel: id })),
        slot: text(label),
      }),
    }),
    element('td', {
      class: 'col-md-1',
      slot: element('a', {
        onclick: () => set(old => {
          old.arr.splice(old.arr.findIndex(d => d.id === id), 1);
          return { ...old };
        }),
        slot: normalIcon,
      }),
    }),
    emptyTd,
  ],
});

let App = () => {
  let [state, setState] = useState({ arr: [] });

  return element('div', {
    class: 'container',
    slot: [
      component(Jumbotron, { set: setState, memo: [] }),
      element('table', {
        class: 'table table-hover table-striped test-data',
        slot: element('tbody', {
          slot: state.arr.map(item => component(Row, {
            key: item.id,
            item,
            hi: state.sel === item.id,
            set: setState,
            memo: [item.label, item.id === state.sel],
          })),
        }),
      }),
      preloadIcon,
    ],
  });
};

mount(document.body, component(App));
