import { _, render, Events, onClick, withNextFrame, requestDirtyCheck, elementProto, component, useSelect, selector, TrackByKey, key } from "ivi";
import { h1, div, span, table, tbody, tr, td, a, button } from "ivi-html";

// @localvoid
// Implemented in almost exactly the same way as react-redux implementation:
// - state is completely immutable
// - each row is a stateful component

const random = (max) => Math.round(Math.random() * 1000) % max;
const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;
function buildData(count) {
  const data = Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = { id: nextId++, label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}` };
  }
  return data;
}

const INITIAL_STATE = { data: [], selected: 0 };
let state = INITIAL_STATE;
const m = (fn) => function () {
  state = fn.apply(_, [state, ...arguments]);
  withNextFrame(requestDirtyCheck)();
};

const useSelected = selector((item) => state.selected === item.id);
const run = m(({ selected }) => ({ data: buildData(1000), selected }));
const runlots = m(({ selected }) => ({ data: buildData(10000), selected }));
const add = m(({ data, selected }) => ({ data: data.concat(buildData(1000)), selected }));
const update = m(({ data, selected }) => {
  data = data.slice();
  for (let i = 0; i < data.length; i += 10) {
    const r = data[i];
    data[i] = { id: r.id, label: r.label + " !!!" };
  }
  return { data, selected };
});
const swaprows = m(({ data, selected }) => {
  data = data.slice();
  const tmp = data[1];
  data[1] = data[998];
  data[998] = tmp;
  return { data, selected };
});
const select = m(({ data }, item) => ({ data, selected: item.id }));
const remove = m(({ data, selected }, item) => (data = data.slice(), data.splice(data.indexOf(item), 1), { data, selected }));
const clear = m(() => INITIAL_STATE);

const removeIcon = elementProto(span("glyphicon glyphicon-remove", { "aria-hidden": "true" }));
const RemoveButton = a(_, _, removeIcon());
const Row = component((c) => {
  let _item;
  const isSelected = useSelected(c);
  const s = onClick(() => { select(_item); });
  const r = onClick(() => { remove(_item); });
  return (item) => (_item = item,
    tr(isSelected(item) ? "danger" : "", _, [
      td("col-md-1", _, item.id),
      td("col-md-4", _, Events(s, a(_, _, item.label))),
      td("col-md-1", _, Events(r, RemoveButton)),
      td("col-md-6"),
    ])
  );
});

const RowList = component((c) => {
  const getItems = useSelect(c, () => state.data);
  return () => TrackByKey(getItems().map((item) => key(item.id, Row(item))));
});

const Button = (text, id, cb) => div("col-sm-6 smallpad", _, Events(onClick(cb), button("btn btn-primary btn-block", { type: "button", id }, text)));
// `withNextFrame()` runs rendering function inside of a sync frame update tick.
withNextFrame(() => {
  render(
    div("container", _, [
      div("jumbotron", _, div("row", _, [
        div("col-md-6", _, h1(_, _, "ivi")),
        div("col-md-6", _, div("row", _, [
          Button("Create 1,000 rows", "run", run),
          Button("Create 10,000 rows", "runlots", runlots),
          Button("Append 1,000 rows", "add", add),
          Button("Update every 10th row", "update", update),
          Button("Clear", "clear", clear),
          Button("Swap Rows", "swaprows", swaprows),
        ])),
      ])),
      table("table table-hover table-striped test-data", _, tbody(_, _, RowList())),
      removeIcon("preloadicon glyphicon glyphicon-remove")
    ]),
    document.getElementById("main"),
  );
})();
