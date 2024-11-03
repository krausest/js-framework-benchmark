import {
  type ObservableType,
  createCustomElement,
  useObserve,
  ProxiedArray,
} from "@michijs/michijs";

function _random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const colours = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
];
const nouns = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];
const adjectivesLength = adjectives.length;
const coloursLength = colours.length;
const nounsLength = nouns.length;

interface Row {
  label: ObservableType<string>;
  id: number;
  selected: ObservableType<string | undefined>;
}
let nextId = 1;
let selectedItem: Row | null = null;
function buildData(count = 1000) {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++)
    data[i] = {
      selected: useObserve<string | undefined>(undefined),
      id: nextId++,
      label: useObserve(
        `${adjectives[_random(adjectivesLength)]} ${colours[_random(coloursLength)]} ${nouns[_random(nounsLength)]}`,
      ),
    };
  return data;
}
const rows = new ProxiedArray<Row>([], undefined, true);
const run = () => rows.$replace(...buildData());
const runLots = () => rows.$replace(...buildData(10000));
const add = () => rows.push(...buildData());
const update = () => {
  const array = rows.$value;
  const length = array.length;
  for (let i = 0; i < length; i += 10) {
    const label = array[i].label;
    label(`${label()} !!!`);
  }
};
const clear = () => rows.$clear();
const select = (row: Row) => {
  row.selected("danger");
  if (selectedItem) selectedItem.selected(undefined);
  selectedItem = row;
};
const deleteItem = (id: number) =>
  rows.$remove(rows.$value.findIndex((x) => x.id === id));
const swapRows = () => rows.$swap(1, 998);

export const Table = createCustomElement("michi-table", {
  extends: {
    tag: "table",
    class: HTMLTableElement,
  },
  render() {
    return (
      <rows.List
        as="tbody"
        id="tbody"
        renderItem={(row) => (
          <tr class={row.selected}>
            <td class="col-md-1">{row.id}</td>
            <td class="col-md-4">
              <a onclick={() => select(row)}>{row.label}</a>
            </td>
            <td class="col-md-1">
              <a onclick={() => deleteItem(row.id)}>
                <span class="glyphicon glyphicon-remove" aria-hidden="true" />
              </a>
            </td>
            <td class="col-md-6" />
          </tr>
        )}
      />
    );
  },
});

export const TableManager = createCustomElement("michi-table-manager", {
  extends: {
    tag: "div",
    class: HTMLDivElement,
  },
  render() {
    return (
      <div class="row">
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="run"
            onclick={run}
          >
            Create 1,000 rows
          </button>
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="runlots"
            onclick={runLots}
          >
            Create 10,000 rows
          </button>
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="add"
            onclick={add}
          >
            Append 1,000 rows
          </button>
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="update"
            onclick={update}
          >
            Update every 10th row
          </button>
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="clear"
            onclick={clear}
          >
            Clear
          </button>
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="swaprows"
            onclick={swapRows}
          >
            Swap Rows
          </button>
        </div>
      </div>
    );
  },
});
