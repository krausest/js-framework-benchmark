import {
  type ObservableType,
  createCustomElement,
  useObserve,
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

interface Row { label: string; id: number; selected: string | undefined };
let nextId = 1;
let selectedItem: ObservableType<Row> | null = null;
function buildData(count = 1000) {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++)
    data[i] = {
      selected: undefined,
      id: nextId++,
      label: `${adjectives[_random(adjectivesLength)]} ${
        colours[_random(coloursLength)]
      } ${nouns[_random(nounsLength)]}`,
    };
  return data;
}
const rows = useObserve<Row[]>([]);
const run = () => rows.$replace(...buildData());
const runLots = () => rows.$replace(...buildData(10000));
const add = () => rows.push(...buildData());
const update = () => {
  for (let i = 0; i < rows.length; i += 10) {
    // Will be solved on https://github.com/microsoft/TypeScript/issues/43826
    const label = rows[i].label;
    label(`${label()} !!!`);
  }
};
const clear = () => rows.$clear();
const select = (row: ObservableType<Row>) => {
  row.selected("danger");
  if (selectedItem) selectedItem.selected(undefined);
  selectedItem = row;
};
const deleteItem = (id: ObservableType<number>) =>
  rows.$remove(rows.findIndex((x) => x.id === id));
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
