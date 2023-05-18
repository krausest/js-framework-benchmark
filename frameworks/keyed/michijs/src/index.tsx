import { createCustomElement, ElementList } from '@michijs/michijs';

function _random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const adjectivesLength = adjectives.length;
const coloursLength = colours.length;
const nounsLength = nouns.length;

type Row = { label: string; id: number; selected?: boolean };
let nextId = 1;
let selectedId: number | null = null;
function buildData(count = 1000) {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++)
    data[i] = ({
      id: nextId++,
      label: `${adjectives[_random(adjectivesLength)]} ${colours[_random(coloursLength)]
        } ${nouns[_random(nounsLength)]}`,
    });
  return data;
}
const rows = new ElementList<Row>();
const run = () => rows.replace(...buildData());
const runLots = () => rows.replace(...buildData(10000));
const add = () => rows.push(...buildData());
const update = () => {
  for (let i = 0; i < rows.getData().length; i += 10) {
    rows.update(i, value => {
      value.label += ' !!!';
      return value;
    });
  }
};
const clear = () => rows.clear();
const select = (id: number) => {
  const index = rows.getData().findIndex(x => x.id === id);
  rows.update(index, value => {
    if (selectedId) {
      const selectedIndex = rows.getData().findIndex(x => x.selected);
      if (selectedIndex >= 0)
        rows.update(selectedIndex, value => {
          value.selected = undefined;
          return value;
        });
    }
    value.selected = true;
    selectedId = value.id;
    return value;
  });
};
const deleteItem = (id: number) => rows.remove(rows.getData().findIndex(x => x.id === id));
const swapRows = () => rows.swap(1, 998);

export const Table = createCustomElement('michi-table',
  {
    extends: {
      tag: 'table',
      class: HTMLTableElement
    },
    fakeRoot: false,
    render() {
      return (
        <rows.List as="tbody" _id="tbody" renderItem={({ label, id, selected }) => (
          <tr class={selected ? 'danger' : undefined}>
            <td _className="col-md-1">{id}</td>
            <td _className="col-md-4">
              <a _onclick={() => select(id)}>{label}</a>
            </td>
            <td _className="col-md-1" >
              <a onclick={() => deleteItem(id)}>
                <span _className="glyphicon glyphicon-remove" _ariaHidden="true" />
              </a>
            </td>
            <td _className="col-md-6" />
          </tr>
        )} />
      );
    }
  }
);

export const TableManager = createCustomElement('michi-table-manager',
  {
    extends: {
      tag: 'div',
      class: HTMLDivElement
    },
    fakeRoot: false,
    render() {
      return (
        <div _className="row">
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="run" _onclick={run}>
              Create 1,000 rows
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" _id="runlots" _onclick={runLots}>
              Create 10,000 rows
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" _id="add" _onclick={add}>
              Append 1,000 rows
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" _id="update" _onclick={update}>
              Update every 10th row
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" _id="clear" _onclick={clear}>
              Clear
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" _id="swaprows" _onclick={swapRows}>
              Swap Rows
            </button>
          </div>
        </div>
      );
    }
  }
);