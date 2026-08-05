// js-framework-benchmark keyed implementation for Domphy (@domphy/core).
//
// Idiomatic fine-grained Domphy style:
//   - one keyed `State<Row[]>` for the row list (rows carry `_key`),
//   - per-row `label` states so "update every 10th row" touches only those
//     rows' text (no list re-render, like solid's per-row signals),
//   - one table-level `selected` id state (per benchmark rules); each row
//     derives its `danger` class from it,
//   - each row's element descriptor is created once per row and reused
//     across list re-renders, so unchanged rows skip patching entirely.
//
// DOM structure mirrors frameworks/keyed/vanillajs:
//   tr > td.col-md-1 (id) + td.col-md-4 > a (label)
//      + td.col-md-1 > a > span.glyphicon-remove + td.col-md-6
// Selected row: tr.danger.

import type { DomphyElement } from "@domphy/core";
import { ElementNode, toState } from "@domphy/core";

// ---------------------------------------------------------------------------
// Data generation (verbatim from the krausest reference implementations)
// ---------------------------------------------------------------------------

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
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

let nextId = 1;

interface Row {
  id: number;
  label: ReturnType<typeof toState<string>>;
}

function buildData(count: number): Row[] {
  const data: Row[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: nextId++,
      label: toState(
        ADJECTIVES[_random(ADJECTIVES.length)] +
          " " +
          COLOURS[_random(COLOURS.length)] +
          " " +
          NOUNS[_random(NOUNS.length)],
      ),
    });
  }
  return data;
}

// ---------------------------------------------------------------------------
// Store: one keyed list state + one selected-id state
// ---------------------------------------------------------------------------

const data = toState<Row[]>([]);
const selected = toState<number | null>(null);

function run(count: number): void {
  selected.set(null);
  data.set(buildData(count));
}

function add(count: number): void {
  data.set(data.get().concat(buildData(count)));
}

function update(): void {
  const rows = data.get();
  for (let i = 0; i < rows.length; i += 10) {
    const label = rows[i].label;
    label.set(label.get() + " !!!");
  }
}

function clear(): void {
  selected.set(null);
  data.set([]);
}

function remove(row: Row): void {
  if (selected.get() === row.id) selected.set(null);
  data.set(data.get().filter((r) => r !== row));
}

function swapRows(): void {
  const rows = data.get();
  if (rows.length < 999) return;
  const next = rows.slice();
  const tmp = next[1];
  next[1] = next[998];
  next[998] = tmp;
  data.set(next);
}

// ---------------------------------------------------------------------------
// Row rendering — one stable descriptor per row (created once, reused across
// list re-renders so unchanged rows are skipped by the keyed reconciler)
// ---------------------------------------------------------------------------

const REMOVE_ICON: DomphyElement = {
  span: null,
  class: "glyphicon glyphicon-remove",
  "aria-hidden": "true",
} as DomphyElement;

const elementCache = new WeakMap<Row, DomphyElement>();

function elementFor(row: Row): DomphyElement {
  let element = elementCache.get(row);
  if (element) return element;
  element = {
    tr: [
      { td: row.id, class: "col-md-1" },
      {
        td: [
          {
            a: (l: any) => row.label.get(l),
            onClick: () => selected.set(row.id),
          },
        ],
        class: "col-md-4",
      },
      {
        td: [
          {
            a: [REMOVE_ICON],
            onClick: () => remove(row),
          },
        ],
        class: "col-md-1",
      },
      { td: null, class: "col-md-6" },
    ],
    _key: row.id,
    class: (l: any) => (selected.get(l) === row.id ? "danger" : ""),
  } as DomphyElement;
  elementCache.set(row, element);
  return element;
}

// ---------------------------------------------------------------------------
// Page scaffold (mirrors the krausest index.html structure) + mount
// ---------------------------------------------------------------------------

function actionButton(
  id: string,
  label: string,
  onClick: () => void,
): DomphyElement {
  return {
    div: [
      {
        button: label,
        type: "button",
        class: "btn btn-primary btn-block",
        id,
        onClick,
      },
    ],
    class: "col-sm-6 smallpad",
  } as DomphyElement;
}

const App: DomphyElement = {
  div: [
    {
      div: [
        {
          div: [
            { div: [{ h1: 'Domphy-"keyed"' }], class: "col-md-6" },
            {
              div: [
                {
                  div: [
                    actionButton("run", "Create 1,000 rows", () => run(1000)),
                    actionButton("runlots", "Create 10,000 rows", () =>
                      run(10000),
                    ),
                    actionButton("add", "Append 1,000 rows", () => add(1000)),
                    actionButton("update", "Update every 10th row", update),
                    actionButton("clear", "Clear", clear),
                    actionButton("swaprows", "Swap Rows", swapRows),
                  ],
                  class: "row",
                },
              ],
              class: "col-md-6",
            },
          ],
          class: "row",
        },
      ],
      class: "jumbotron",
    },
    {
      table: [
        {
          tbody: (l: any) => data.get(l).map(elementFor),
          id: "tbody",
        },
      ],
      class: "table table-hover table-striped test-data",
    },
    {
      span: null,
      class: "preloadicon glyphicon glyphicon-remove",
      "aria-hidden": "true",
    },
  ],
  class: "container",
} as DomphyElement;

new ElementNode(App).render(document.getElementById("main")!);
