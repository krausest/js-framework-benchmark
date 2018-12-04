import { _, render, Events, onClick, withNextFrame, requestDirtyCheck, elementProto, component, selector, TrackByKey, key } from "ivi";
import { h1, div, span, table, tbody, tr, td, a, button } from "ivi-html";
import { createStore } from "ivi-state";

// @localvoid
// Implemented in almost exactly the same way as react-redux implementation:
// - state is completely immutable
// - each row is a stateful component
// - two selectors per each row (react-redux is using one selector)

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
  const data = Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

const STORE = createStore({ data: [], selected: 0 },
  (state, action) => {
    const { data, selected } = state;
    switch (action.type) {
      case "delete": {
        const idx = data.indexOf(action.item);
        return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
      }
      case "run":
        return { data: buildData(1000), selected: 0 };
      case "add":
        return { data: data.concat(buildData(1000)), selected };
      case "update": {
        const newData = data.slice();
        for (let i = 0; i < newData.length; i += 10) {
          const r = newData[i];
          newData[i] = { id: r.id, label: r.label + " !!!" };
        }
        return { data: newData, selected };
      }
      case "select":
        return { data, selected: action.item.id };
      case "runlots":
        return { data: buildData(10000), selected: 0 };
      case "clear":
        return { data: [], selected: 0 };
      case "swaprows":
        return { data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]], selected };
    }
    return state;
  },
  withNextFrame(requestDirtyCheck),
);

const useItems = selector(() => STORE.state.data);
const useItem = selector((idx) => STORE.state.data[idx]);
const useSelected = selector((item) => STORE.state.selected === item.id);

const GlyphIcon = elementProto(span("glyphicon glyphicon-remove", { "aria-hidden": "true" }));
const RemoveButton = a(_, _, GlyphIcon());

const Row = component((c) => {
  let item;
  // @localvoid: it is possible to combine multiple selectors into one, like it is traditionally done in react-redux.
  //   It will slightly improve performance and reduce memory consumption, but I have nothing to hide, selectors are
  //   super cheap in ivi.
  const getItem = useItem(c);
  const isSelected = useSelected(c);

  const selectItem = onClick(() => { STORE.dispatch({ type: "select", item }); });
  const deleteItem = onClick(() => { STORE.dispatch({ type: "delete", item }); });

  return (idx) => (
    item = getItem(idx),

    tr(isSelected(item) ? "danger" : "", _, [
      td("col-md-1", _, item.id),
      td("col-md-4", _,
        Events(selectItem,
          a(_, _, item.label),
        ),
      ),
      td("col-md-1", _,
        Events(deleteItem,
          RemoveButton,
        ),
      ),
      td("col-md-6"),
    ])
  );
});

const RowList = component((c) => {
  const getItems = useItems(c);
  return () => tbody(_, _, TrackByKey(getItems().map(({ id }, i) => key(id, Row(i)))));
});

const Button = (text, id) => (
  div("col-sm-6 smallpad", _,
    Events(onClick(() => { STORE.dispatch({ type: id }); }),
      button("btn btn-primary btn-block", { type: "button", id }, text),
    )
  )
);
// `withNextFrame()` runs rendering function inside of a sync frame update tick.
withNextFrame(() => {
  render(
    div("container", _, [
      div("jumbotron", _,
        div("row", _, [
          div("col-md-6", _,
            h1(_, _, "ivi")
          ),
          div("col-md-6", _,
            div("row", _, [
              Button("Create 1,000 rows", "run"),
              Button("Create 10,000 rows", "runlots"),
              Button("Append 1,000 rows", "add"),
              Button("Update every 10th row", "update"),
              Button("Clear", "clear"),
              Button("Swap Rows", "swaprows"),
            ]),
          ),
        ]),
      ),
      table("table table-hover table-striped test-data", _, RowList()),
      GlyphIcon("preloadicon glyphicon glyphicon-remove")
    ]),
    document.getElementById("main"),
  );
})();
