import { h, reactive, view, render, observe, getValue } from "uhydro";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: HTMLElement & any;
    }
  }
}

const ADJECTIVES = [
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
const COLOURS = [
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
const NOUNS = [
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
const len_ADJECTIVES = ADJECTIVES.length;
const len_COLOURS = COLOURS.length;
const len_NOUNS = NOUNS.length;
let nextId = 1;
function buildData(count: number) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = reactive({
      id: nextId++,
      label:
        ADJECTIVES[random(len_ADJECTIVES)] +
        " " +
        COLOURS[random(len_COLOURS)] +
        " " +
        NOUNS[random(len_NOUNS)],
    });
  }
  return data;
}
function random(max: number) {
  return (Math.random() * max) | 0;
}

const $ = document.querySelector.bind(document);

render(
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
  </div>,
  $(".col-md-6 > .row")!
);

const data = reactive<Array<{ id: number; label: string }>>([]);
const selected = reactive(-1);

view("tbody", data, (item) => {
  const className = reactive<"" | "danger">("");

  const tr = (
    <tr class={className}>
      <td class="col-md-1">{item.id}</td>
      <td class="col-md-4">
        <a onclick={() => selected(item.id)}>{item.label}</a>
      </td>
      <td class="col-md-1">
        <a onclick={() => remove(item.id)}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  ) as HTMLTableRowElement;

  observe(selected, (val: number) => {
    if (val === item.id) {
      className("danger");
    } else {
      className("");
    }
  });

  return tr;
});

function add() {
  data((prev: typeof data) => [...prev, ...buildData(1000)]);
}
function run() {
  data(buildData(1000));
}
function runLots() {
  data(buildData(10000));
}
function clear() {
  data([]);
}
function update() {
  const d = getValue(data);
  let index = 0;
  while (index < d.length) {
    //@ts-ignore
    d[index]((curr: typeof d[number]) => ({
      ...curr,
      label: (curr.label += " !!!"),
    }));
    index += 10;
  }
}
function swapRows() {
  const d = getValue(data);
  if (d.length > 998) {
    const tmp = getValue(d[1]);
    //@ts-ignore
    d[1](getValue(d[998]));
    //@ts-ignore
    d[998](tmp);
  }
}
function remove(id: number) {
  //@ts-ignore
  const copy = [...getValue(data)];

  const index = copy.findIndex((i: typeof data[number]) => i?.id === id);
  copy.splice(index, 1);

  data(copy);
}
