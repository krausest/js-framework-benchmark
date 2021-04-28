import {
  reactive,
  getValue,
  ternary,
  $,
  setReactivity,
  observe,
  template,
} from "hydro-js";

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

setReactivity($("#main")!, { run, runLots, add, update, clear, swapRows });

const data = reactive<Array<{ id: number; label: string }>>([]);
const selected = reactive(-1);

observe(data, (newData: typeof data, oldData: typeof data) => {
  merge(newData, oldData);
  if (!newData.length || !oldData.length) selected(-1);
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
  getValue(data).forEach((item: typeof data[number], index: number) => {
    if (index % 10 === 0) item.label += " !!!";
  });
}
function swapRows() {
  data((prev: typeof data) => {
    if (prev.length > 998) {
      fixSelectedOnSwap(prev);

      [prev[1], prev[998]] = [prev[998], prev[1]];
    }
  });
}

function remove(id: number) {
  const index = getValue(data).findIndex(
    (i: typeof data[number]) => i.id === id
  );
  data[index].setter(null);
  data((curr: typeof data) => {
    curr.splice(index, 1);
  });
}

function fixSelectedOnSwap(prev: typeof data) {
  const second = prev[1].id;
  const secondLast = prev[998].id;
  if ([second, secondLast].includes(getValue(selected))) {
    selected((prev: typeof selected) =>
      prev === second ? secondLast : second
    );
  }
}

function merge(newData: typeof data, oldData: typeof data) {
  for (let i = 0; i < oldData.length && newData.length; i++) {
    oldData[i].id = newData[i].id;
    oldData[i].label = newData[i].label;
    newData[i] = oldData[i];
  }

  for (let i = oldData.length; i < newData.length; i++) {
    renderItem(newData[i], i);
  }
}

function renderItem(item: typeof data[number], i: number) {
  const tr = template(
    $("#singleRow")!,
    {
      ternaryClass: ternary(
        (val: number) => val === item.id,
        "danger",
        "",
        selected
      ),
      bindData: data[i],
      dataId: data[i].id,
      dataLabel: data[i].label,
    },
    {
      remove: () => remove(item.id),
      select: () => selected(item.id),
    }
  )!;
  $("tbody")!.appendChild(tr);
}
