import { connect, render, map, element, onClick, stopDirtyChecking, setupScheduler, invalidateHandler, invalidate } from "ivi";
import { h1, div, span, table, tbody, tr, td, a, button } from "ivi-html";
import { createStore, createBox } from "ivi-state";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

const STORE = createStore(
  { data: createBox([]), selected: 0 },
  function (state, action) {
    const { data, selected } = state;
    const itemList = data.value;
    switch (action.type) {
      case "delete":
        itemList.splice(itemList.findIndex((d) => d.id === action.id), 1);
        return { data: createBox(itemList), selected };
      case "run":
        return { data: createBox(buildData(1000)), selected: 0 };
      case "add":
        return { data: createBox(itemList.concat(buildData(1000))), selected };
      case "update":
        for (let i = 0; i < itemList.length; i += 10) {
          const r = itemList[i];
          itemList[i] = { id: r.id, label: r.label + " !!!" };
        }
        return { data, selected };
      case "select":
        return { data, selected: action.id };
      case "runlots":
        return { data: createBox(buildData(10000)), selected: 0 };
      case "clear":
        return { data: createBox([]), selected: 0 };
      case "swaprows":
        if (itemList.length > 998) {
          const a = itemList[1];
          itemList[1] = itemList[998];
          itemList[998] = a;
        }
        return { data: createBox(itemList), selected };
    }
    return state;
  },
  invalidate,
);

const GlyphIcon = element(span("", { "aria-hidden": "true" }));
const RemoveRowButton = element(td("col-md-1").c(a().c(GlyphIcon("glyphicon glyphicon-remove"))));

const Row = connect(
  (_, idx) => {
    const state = STORE.state;
    const item = state.data.value[idx];
    return state.selected === item.id ? { id: item.id, label: item.label, selected: true } : item;
  },
  (item) => (
    stopDirtyChecking(tr(item.selected === true ? "danger" : "").c(
      td("col-md-1").t(item.id),
      td("col-md-4").c(a().t(item.label)),
      RemoveRowButton(),
      td("col-md-6"),
    ))
  ),
);

const RowList = connect(
  () => STORE.state.data,
  ({ value }) => (
    tbody().e(onClick((ev) => {
      const target = ev.target;
      STORE.dispatch({
        type: target.matches(".glyphicon") ? "delete" : "select",
        id: +target.closest("tr").firstChild.textContent,
      });
    })).c(map(value, ({ id }, i) => Row(i).k(id)))
  ),
);

function Button(text, id) {
  return div("col-sm-6 smallpad").c(
    button("btn btn-primary btn-block", { type: "button", id })
      .e(onClick(() => { STORE.dispatch({ type: id }); }))
      .t(text),
  );
}

setupScheduler(invalidateHandler);
render(
  div("container").c(
    stopDirtyChecking(div("jumbotron").c(div("row").c(
      div("col-md-6").c(h1().t("ivi")),
      div("col-md-6").c(div("row").c(
        Button("Create 1,000 rows", "run"),
        Button("Create 10,000 rows", "runlots"),
        Button("Append 1,000 rows", "add"),
        Button("Update every 10th row", "update"),
        Button("Clear", "clear"),
        Button("Swap Rows", "swaprows"),
      )),
    ))),
    table("table table-hover table-striped test-data").c(RowList()),
    GlyphIcon("preloadicon glyphicon glyphicon-remove"),
  ),
  document.getElementById("main"),
);
