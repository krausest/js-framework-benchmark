/** @import {Children, SetState} from 'endr' */

import { createRoot, memo, useState } from 'endr';

const { document } = globalThis;

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy'
];

const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];

const nouns = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard'
];

let nextId = 0;

/** @typedef {{ items: { id: number; label: string }[]; selectedId: number | null }} State */

/** @type {State} */
const initialState = { items: [], selectedId: null };

/** @param {string[]} items */
const sample = items => items[Math.floor(Math.random() * items.length)];

/** @param {number} length */
const createItems = length =>
  Array.from({ length }, () => ({ id: ++nextId, label: `${sample(adjectives)} ${sample(colors)} ${sample(nouns)}` }));

const Row = memo(
  /** @param {{ isSelected: boolean; item: State['items'][number]; setState: SetState<State> }} props */
  ({ isSelected, item, setState }) => (
    <tr className={isSelected ? 'danger' : ''}>
      <td className='col-md-1'>{item.id}</td>
      <td className='col-md-4'>
        <a
          onclick={() => {
            if (!isSelected) {
              setState(({ items }) => ({ items, selectedId: item.id }));
            }
          }}
        >
          {item.label}
        </a>
      </td>
      <td className='col-md-1'>
        <a
          onclick={() =>
            setState(({ items, selectedId }) => ({ items: items.filter(other => other !== item), selectedId }))
          }
        >
          <span className='glyphicon glyphicon-remove' aria-hidden='true' />
        </a>
      </td>
      <td className='col-md-6' />
    </tr>
  )
);

/** @param {{ id: string; onclick: () => void; children: Children }} props */
const Button = ({ id, onclick, children }) => (
  <div className='col-sm-6 smallpad'>
    <button type='button' className='btn btn-primary btn-block' id={id} onclick={onclick}>
      {children}
    </button>
  </div>
);

const Jumbotron = memo(
  /** @param {{ setState: SetState<State> }} props */
  ({ setState }) => (
    <div className='jumbotron'>
      <div className='row'>
        <div className='col-md-6'>
          <h1>Endr</h1>
        </div>
        <div className='col-md-6'>
          <div className='row'>
            <Button id='run' onclick={() => setState({ items: createItems(1000), selectedId: 0 })}>
              Create 1,000 rows
            </Button>
            <Button id='runlots' onclick={() => setState({ items: createItems(10000), selectedId: 0 })}>
              Create 10,000 rows
            </Button>
            <Button
              id='add'
              onclick={() => setState(state => ({ ...state, items: [...state.items, ...createItems(1000)] }))}
            >
              Append 1,000 rows
            </Button>
            <Button
              id='update'
              onclick={() =>
                setState(state => ({
                  ...state,
                  items: state.items.map((item, i) => (i % 10 === 0 ? { ...item, label: `${item.label} !!!` } : item))
                }))
              }
            >
              Update every 10th row
            </Button>
            <Button id='clear' onclick={() => setState(initialState)}>
              Clear
            </Button>
            <Button
              id='swaprows'
              onclick={() =>
                setState(state => {
                  const { items } = state;
                  if (items.length < 1000) return state;

                  [items[1], items[998]] = [items[998], items[1]];
                  return { ...state, items };
                })
              }
            >
              Swap Rows
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
);

const Main = () => {
  const [{ items, selectedId }, setState] = useState(initialState);

  return (
    <div className='container'>
      <Jumbotron setState={setState} />
      <table className='table table-hover table-striped test-data'>
        <tbody>
          {items.map(item => (
            <Row item={item} isSelected={selectedId === item.id} setState={setState} key={item.id} />
          ))}
        </tbody>
      </table>
      <span className='preloadicon glyphicon glyphicon-remove' aria-hidden='true' />
    </div>
  );
};

createRoot(/** @type {Element} */ (document.querySelector('#main'))).render(<Main />);
