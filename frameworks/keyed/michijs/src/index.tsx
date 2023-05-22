import { createCustomElement, ElementList } from '@michijs/michijs';

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

type Row = { label: string; id: number; selected?: boolean };
let nextId = 1;
let selectedId: number | null = null;
function buildData(count = 1000) {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++)
    data[i] = {
      id: nextId++,
      label: `${adjectives[_random(adjectivesLength)]} ${
        colours[_random(coloursLength)]
      } ${nouns[_random(nounsLength)]}`,
    };
  return data;
}
const rows = new ElementList<Row>();
const run = () => rows.replace(...buildData());
const runLots = () => rows.replace(...buildData(10000));
const add = () => rows.push(...buildData());
const update = () => {
  for (let i = 0; i < rows.getData().length; i += 10) {
    rows.update(i, (value) => {
      value.label += " !!!";
      return value;
    });
  }
};
const clear = () => rows.clear();
const select = (id: number) => {
  const index = rows.getData().findIndex((x) => x.id === id);
  rows.update(index, (value) => {
    if (selectedId) {
      const selectedIndex = rows.getData().findIndex((x) => x.selected);
      if (selectedIndex >= 0)
        rows.update(selectedIndex, (value) => {
          value.selected = undefined;
          return value;
        });
    }
    value.selected = true;
    selectedId = value.id;
    return value;
  });
};
const deleteItem = (id: number) =>
  rows.remove(rows.getData().findIndex((x) => x.id === id));
const swapRows = () => rows.swap(1, 998);

export const Table = createCustomElement("michi-table", {
  extends: {
    tag: "table",
    class: HTMLTableElement,
  },
  fakeRoot: false,
  render() {
    return (
      <rows.List
        as="tbody"
        _={{ id: "tbody" }}
        renderItem={({ label, id, selected }) => (
          <tr class={selected ? "danger" : undefined}>
            <td _={{ className: "col-md-1" }}>{id}</td>
            <td _={{ className: "col-md-4" }}>
              <a _={{ onclick: () => select(id) }}>{label}</a>
            </td>
            <td _={{ className: "col-md-1" }}>
              <a onclick={() => deleteItem(id)}>
                <span
                  _={{
                    className: "glyphicon glyphicon-remove",
                    ariaHidden: "true",
                  }}
                />
              </a>
            </td>
            <td _={{ className: "col-md-6" }} />
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
  fakeRoot: false,
  render() {
    return (
      <div _={{ className: "row" }}>
        <div _={{ className: "col-sm-6 smallpad" }}>
          <button
            _={{
              type: "button",
              className: "btn btn-primary btn-block",
              id: "run",
              onclick: run,
            }}
          >
            Create 1,000 rows
          </button>
        </div>
        <div _={{ className: "col-sm-6 smallpad" }}>
          <button
            _={{
              type: "button",
              className: "btn btn-primary btn-block",
              id: "runlots",
              onclick: runLots,
            }}
          >
            Create 10,000 rows
          </button>
        </div>
        <div _={{ className: "col-sm-6 smallpad" }}>
          <button
            _={{
              type: "button",
              className: "btn btn-primary btn-block",
              id: "add",
              onclick: add,
            }}
          >
            Append 1,000 rows
          </button>
        </div>
        <div _={{ className: "col-sm-6 smallpad" }}>
          <button
            _={{
              type: "button",
              className: "btn btn-primary btn-block",
              id: "update",
              onclick: update,
            }}
          >
            Update every 10th row
          </button>
        </div>
        <div _={{ className: "col-sm-6 smallpad" }}>
          <button
            _={{
              type: "button",
              className: "btn btn-primary btn-block",
              id: "clear",
              onclick: clear,
            }}
          >
            Clear
          </button>
        </div>
        <div _={{ className: "col-sm-6 smallpad" }}>
          <button
            _={{
              type: "button",
              className: "btn btn-primary btn-block",
              id: "swaprows",
              onclick: swapRows,
            }}
          >
            Swap Rows
          </button>
        </div>
      </div>
    );
  },
});
