import {
  ObservableWithValue,
  NonProxiedArray,
  create,
  type TypedMouseEvent,
} from "@michijs/michijs";

interface Row {
  label: ObservableWithValue<string>;
  id: number;
  selected: ObservableWithValue<string | null>;
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
  ],
  colours = [
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
  ],
  nouns = [
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
  ],
  adjectivesLength = adjectives.length,
  coloursLength = colours.length,
  nounsLength = nouns.length,
  _random = (max: number) => Math.round(Math.random() * 1000) % max,
  buildData = (count = 1000) => {
    const data = new Array<Row>(count);
    for (let i = 0; i < count; i++)
      data[i] = {
        selected: new ObservableWithValue<string | null>(null),
        id: nextId++,
        label: new ObservableWithValue(
          `${adjectives[_random(adjectivesLength)]} ${colours[_random(coloursLength)]} ${nouns[_random(nounsLength)]}`,
        ),
      };
    return data;
  },
  rows = new NonProxiedArray<Row>(),
  run = () => rows.$replace(...buildData()),
  runLots = () => rows.$replace(...buildData(10000)),
  add = () => rows.push(...buildData()),
  update = () => {
    for (let i = 0; i < rows.length; i += 10) {
      const label = rows[i].label;
      label.value = `${label.value} !!!`;
    }
  },
  clear = () => rows.$clear(),
  select = (row: Row) => {
    row.selected.value = "danger";
    if (selectedItem) selectedItem.selected.value = null;
    selectedItem = row;
  },
  deleteItem = (id: number) => rows.$remove(rows.findIndex((x) => x.id === id)),
  swapRows = () => rows.$swap(1, 998);

let nextId = 1,
  selectedItem: Row | null = null;

const TableBody = rows.List({
  as: "tbody",
  id: "tbody",
  useTemplate: true,
  renderItem: (row) => (
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
  ),
});
document.querySelector("table")?.appendChild(TableBody);

const rowButton = (
  id: string,
  event: (ev: TypedMouseEvent<HTMLButtonElement>) => any,
  label: string,
) => (
  <div class="col-sm-6 smallpad">
    <button
      type="button"
      class="btn btn-primary btn-block"
      id={id}
      onclick={event}
    >
      {label}
    </button>
  </div>
);

const TableManager = create(
  <div class="row">
    {rowButton("run", run, "Create 1,000 rows")}
    {rowButton("runlots", runLots, "Create 10,000 rows")}
    {rowButton("add", add, "Append 1,000 rows")}
    {rowButton("update", update, "Update every 10th row")}
    {rowButton("clear", clear, "Clear")}
    {rowButton("swaprows", swapRows, "Swap Rows")}
  </div>,
);
document.getElementById("table-manager")?.appendChild(TableManager);
