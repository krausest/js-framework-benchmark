// Реализация для js-framework-benchmark (keyed): https://github.com/krausest/js-framework-benchmark
// Разметка и id кнопок фиксированы правилами бенчмарка, менять их нельзя.
import {
  a,
  batch,
  button,
  createRoot,
  createSelector,
  div,
  each,
  h1,
  signal,
  span,
  table,
  tbody,
  td,
  tr,
  type ReactiveSignal,
} from "@rwcjs/core";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const random = (max: number) => Math.round(Math.random() * 1000) % max;

/** Строка таблицы: label — сигнал, чтобы «обновить каждую 10-ю» трогала только текст. */
type Row = { id: number; label: ReactiveSignal<string> };

let nextId = 1;

const buildData = (count: number): Row[] => {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: signal(`${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`),
    };
  }
  return data;
};

const rows = signal<Row[]>([]);
const selected = signal<number | null>(null);
/** Выбор строки будит только две строки, а не все. */
const isSelected = createSelector(selected);

const actions = {
  run: () => rows.set(buildData(1000)),
  runLots: () => rows.set(buildData(10000)),
  add: () => rows.set([...rows.peek(), ...buildData(1000)]),
  update: () =>
    batch(() => {
      const data = rows.peek();
      for (let i = 0; i < data.length; i += 10) data[i]!.label.update((label) => `${label} !!!`);
    }),
  clear: () => rows.set([]),
  swapRows: () => {
    const data = rows.peek();
    if (data.length <= 998) return;
    const next = data.slice();
    const tmp = next[1]!;
    next[1] = next[998]!;
    next[998] = tmp;
    rows.set(next);
  },
  remove: (id: number) => rows.set(rows.peek().filter((row) => row.id !== id)),
};

const actionButton = (id: string, text: string, onClick: () => void) =>
  div(
    { class: "col-sm-6 smallpad" },
    button({ class: "btn btn-primary btn-block", attrs: { type: "button", id }, "@click": onClick }, text),
  );

createRoot(() => {
  document.getElementById("main")!.append(
    div(
      { class: "container" },
      div(
        { class: "jumbotron" },
        div(
          { class: "row" },
          div({ class: "col-md-6" }, h1("rwc-\"keyed\"")),
          div(
            { class: "col-md-6" },
            div(
              { class: "row" },
              actionButton("run", "Create 1,000 rows", actions.run),
              actionButton("runlots", "Create 10,000 rows", actions.runLots),
              actionButton("add", "Append 1,000 rows", actions.add),
              actionButton("update", "Update every 10th row", actions.update),
              actionButton("clear", "Clear", actions.clear),
              actionButton("swaprows", "Swap Rows", actions.swapRows),
            ),
          ),
        ),
      ),
      table(
        { class: "table table-hover table-striped test-data" },
        tbody(
          { attrs: { id: "tbody" } },
          each(
            rows,
            (row) => {
              const { id, label } = row.peek();
              return tr(
                { class: { danger: () => isSelected(id) } },
                td({ class: "col-md-1" }, String(id)),
                td({ class: "col-md-4" }, a({ "@click": () => selected.set(id) }, label)),
                td(
                  { class: "col-md-1" },
                  a(
                    { "@click": () => actions.remove(id) },
                    span({ class: "glyphicon glyphicon-remove", attrs: { "aria-hidden": "true" } }),
                  ),
                ),
                td({ class: "col-md-6" }),
              );
            },
            (row) => row.id,
          ),
        ),
      ),
      span({ class: "preloadicon glyphicon glyphicon-remove", attrs: { "aria-hidden": "true" } }),
    ),
  );
});
