import { h, lsStore, createCustomElement } from '@lsegurado/ls-element';

function _random(max) {
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

const { state, transactions, ...store } = lsStore({
  state: {
    data: new Array<Row>(),
    selected: null as number,
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

export const Tbody = createCustomElement(
  {
    tag: 'ls-table-body',
    extends: 'tbody',
    class: HTMLTableSectionElement
  },
  {
    subscribeTo: {
      store
    },
    render() {
      return state.data.map(({ id, label }) => (
        <tr id={`row-${id}`} class={id === state.selected ? 'danger' : undefined} _dynamicAttributes={['class']}>
          <td id={`row-${id}-1`} _className="col-md-1" _dynamicAttributes={[]} _staticChildren _textContent={id.toString()} />
          <td id={`row-${id}-2`} _className="col-md-4" _dynamicAttributes={[]}>
            <a id={`row-${id}-3`} onclick={() => transactions.select(id)} _staticChildren _dynamicAttributes={['_textContent']} _textContent={label} />
          </td>
          <td id={`row-${id}-4`} _className="col-md-1" _dynamicAttributes={[]} _staticChildren>
            <a id={`row-${id}-5`} onclick={() => transactions.delete(id)}>
              <span id={`row-${id}-6`} _className="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td id={`row-${id}-7`} _className="col-md-6" _dynamicAttributes={[]} _staticChildren />
        </tr>)
      );
    }
  }
);

export const TableManager = createCustomElement(
  {
    tag: 'ls-table-manager',
    extends: 'div',
    class: HTMLDivElement
  },
  {
    render() {
      return (
        <>
          <div id="6" _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="run" onclick={transactions.run} _textContent="Create 1,000 rows" />
          </div>
          <div id="7" _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="runlots" onclick={transactions.runLots} _textContent="Create 10,000 rows" />
          </div>
          <div id="8" _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="add" onclick={transactions.add} _textContent="Append 1,000 rows" />
          </div>
          <div id="9" _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="update" onclick={transactions.update} _textContent="Update every 10th row" />
          </div>
          <div id="10" _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="clear" onclick={transactions.clear} _textContent="Clear" />
          </div>
          <div id="11" _className="col-sm-6 smallpad">
            <button _type="button" _className="btn btn-primary btn-block" id="swaprows" onclick={transactions.swapRows} _textContent="Swap Rows" />
          </div>
        </>
      );
    }
  }
);