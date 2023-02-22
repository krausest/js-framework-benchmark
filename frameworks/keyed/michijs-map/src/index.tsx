import { store, createCustomElement, List } from '@michijs/michijs';

function _random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

type Row = { label: string, id: number };
function buildData(count = 1000) {
  const data = new Array<Row>();
  for (let i = 0; i < count; i++)
    data.push({ id: state.nextId++, label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}` });
  return data;
}

const { state, transactions, ...storeSubscribable } = store({
  state: {
    data: new Array<Row>(),
    selected: null as number | null,
    nextId: 1
  },
  transactions: {
    updateData(mod = 10) {
      for (let i = 0; i < state.data.length; i += mod) {
        state.data[i].label += ' !!!';
        // this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
      }
    },
    delete(id: number) {
      // state.data = state.data.filter(x => x.id !== id);
      const index = state.data.findIndex(x => x.id === id);
      state.data.splice(index, 1);

      // const idx = this.data.findIndex(d => d.id == id);
      // this.data = this.data.filter((_e, i) => i != idx);
      // return this;
    },
    run() {
      state.data = buildData();
      state.selected = null;
    },
    add() {
      // state.data = state.data.concat(buildData());
      state.data.push(...buildData());
      state.selected = null;
    },
    update() {
      transactions.updateData();
      state.selected = null;
    },
    select(id: number) {
      state.selected = id;
    },
    runLots() {
      state.data = buildData(10000);
      state.selected = null;
    },
    clear() {
      state.data = [];
      state.selected = null;
    },
    swapRows() {
      if (state.data.length > 998) {
        const a = state.data[1];
        state.data[1] = state.data[998];
        state.data[998] = a;
      }
    }
  }
});

export const Table = createCustomElement('michi-table',
  {
    extends: {
      tag: 'table',
      class: HTMLTableElement
    },
    subscribeTo: {
      storeSubscribable
    },
    fakeRoot: false,
    render() {
      return <List data={state.data} as="tbody" _id="tbody" renderItem={({ label, id }) => (
        <tr key={id} class={id === state.selected ? 'danger' : undefined}>
          <td _className="col-md-1">{id}</td>
          <td _className="col-md-4">
            <a _onclick={() => transactions.select(id)}>{label}</a>
          </td>
          <td _className="col-md-1">
            <a _onclick={() => transactions.delete(id)}>
              <span _className="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td _className="col-md-6" />
        </tr>
      )} />
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
            <button _type="button" _className="btn btn-primary btn-block" id="run" onclick={transactions.run}>
              Create 1,000 rows
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="runlots" onclick={transactions.runLots}>
              Create 10,000 rows
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="add" onclick={transactions.add}>
              Append 1,000 rows
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="update" onclick={transactions.update}>
              Update every 10th row
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="clear" onclick={transactions.clear}>
              Clear
            </button>
          </div>
          <div _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="swaprows" onclick={transactions.swapRows}>
              Swap Rows
            </button>
          </div>
        </div>
      );
    }
  }
);