import { statelessComponent, render, map, element, onClick, stopDirtyChecking, setupScheduler, invalidateHandler } from "ivi";
import { h1, div, span, table, tbody, tr, td, a, button } from "ivi-html";
import { createStore } from "ivi-state";

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
  { data: [], selected: null },
  function (state, action) {
    const data = state.data;
    const selected = state.selected;
    switch (action.type) {
      case "delete":
        data.splice(data.findIndex((d) => d.id === action.id), 1);
        return { data, selected };
      case "run":
        return { data: buildData(1000), selected: null };
      case "add":
        return { data: state.data.concat(buildData(1000)), selected };
      case "update":
        for (let i = 0; i < data.length; i += 10) {
          const r = data[i];
          data[i] = { id: r.id, label: r.label + " !!!" };
        }
        return { data, selected };
      case "select":
        return { data, selected: data.find((d) => d.id === action.id) };
      case "runlots":
        return { data: buildData(10000), selected: null };
      case "clear":
        return { data: [], selected: null };
      case "swaprows":
        if (data.length > 998) {
          const a = data[1];
          data[1] = data[998];
          data[998] = a;
        }
        return { data, selected };
    }
    return state;
  },
  update,
);

const GlyphIcon = element(span("", { "aria-hidden": "true" }));

const Row = statelessComponent(({ id, label, selected }) => (
  stopDirtyChecking(
    tr(selected ? "danger" : "").c(
      td("col-md-1").c(id),
      td("col-md-4").c(a().c(label)),
      td("col-md-1").c(a().c(GlyphIcon("glyphicon glyphicon-remove delete"))),
      td("col-md-6"),
    ),
  )
));

function Button(text, id) {
  return div("col-sm-6 smallpad").c(
    button("btn btn-primary btn-block", { type: "button", id })
      .e(onClick(() => { STORE.dispatch({ type: id }); }))
      .c(text),
  );
}

const Jumbotron = statelessComponent(() => (
  div("jumbotron").c(
    div("row").c(
      div("col-md-6").c(h1().c("ivi")),
      div("col-md-6").c(
        div("row").c(
          Button("Create 1,000 rows", "run"),
          Button("Create 10,000 rows", "runlots"),
          Button("Append 1,000 rows", "add"),
          Button("Update every 10th row", "update"),
          Button("Clear", "clear"),
          Button("Swap Rows", "swaprows"),
        ),
      ),
    ),
  )
));

setupScheduler(invalidateHandler);
const CONTAINER = document.getElementById("main");
function update() {
  const { data, selected } = STORE.state;
  render(
    div("container").c(
      Jumbotron(),
      table("table table-hover table-striped test-data").c(
        tbody()
          .e(onClick((ev) => {
            const target = ev.target;
            STORE.dispatch({
              type: target.matches(".delete") ? "delete" : "select",
              id: +target.closest("tr").firstChild.textContent,
            });
          }))
          .c(map(data, (item) => Row(item === selected ? { id: item.id, label: item.label, selected: item === selected } : item).k(item.id))),
      ),
      GlyphIcon("preloadicon glyphicon glyphicon-remove"),
    ),
    CONTAINER,
  );
}
update();
