import {
  h,
  reactive,
  getValue,
  ternary,
  $,
  setReactivity,
  view,
  setReuseElements,
  unset,
  onCleanup,
} from "hydro-js";

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
    data[i] = {
      id: nextId++,
      label:
        ADJECTIVES[random(len_ADJECTIVES)] +
        " " +
        COLOURS[random(len_COLOURS)] +
        " " +
        NOUNS[random(len_NOUNS)],
    };
  }
  return data;
}
function random(max: number) {
  return (Math.random() * max) | 0;
}

setReuseElements(false);
setReactivity($("#main")!, { run, runLots, add, update, clear, swapRows });

const data = reactive<Array<{ id: number; label: string }>>([]);
const selected = reactive(-1);

//@ts-ignore
view("tbody", data, (item, i) => {
  const className = ternary(
    (val: number) => val === item.id,
    "danger",
    "",
    selected
  );

  const tr = (
    <tr class={className} bind={data[i]}>
      <td class="col-md-1">{data[i].id}</td>
      <td class="col-md-4">
        <a onclick={() => selected(item.id)}>{data[i].label}</a>
      </td>
      <td class="col-md-1">
        <a onclick={() => remove(item.id)}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  );

  onCleanup(unset, tr, className);
  return tr;
});

function add() {
  data((prev: typeof data) => [...prev, ...buildData(1000)]);
}
function run() {
  selected(null);
  data(buildData(1000));
}
function runLots() {
  selected(null);
  data(buildData(10000));
}
function clear() {
  data([]);
  selected(null);
}
function update() {
  const d = getValue(data);
  let index = 0;
  while (index < d.length) {
    data[index].setter((item: typeof data[number]) => {
      item.label += " !!!";
    });
    index += 10;
  }
}
function swapRows() {
  data((prev: typeof data) => {
    if (prev.length > 998) {
      [prev[1], prev[998]] = [prev[998], prev[1]];
    }
  });
}
function remove(id: number) {
  const index = getValue(data).findIndex(
    (i: typeof data[number]) => i?.id === id
  );
  data((curr: typeof data) => {
    curr[index] = null;
  });
}
