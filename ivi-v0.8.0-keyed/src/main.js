import { Component, componentFactory, connect, selectorData, render, map } from "ivi";
import * as h from "ivi-html";
import * as Events from "ivi-events";
import { store } from "./store";

const HiddenAttributes = { "aria-hidden": "true" };

class Row extends Component {
  constructor(props) {
    super(props);
    this.click = Events.onClick(() => { store.dispatch({ type: "select", item: this.props.item }); });
    this.del = Events.onClick(() => { store.dispatch({ type: "delete", item: this.props.item }); });
  }

  render() {
    const { selected, item } = this.props;
    return h.tr(selected ? "danger" : null).children(
      h.td("col-md-1").children(item.id),
      h.td("col-md-4").children(h.a().events(this.click).children(item.label)),
      h.td("col-md-1").children(
        h.a().events(this.del).children(h.span("glyphicon glyphicon-remove").props(HiddenAttributes))
      ),
      h.td("col-md-6")
    );
  }
}

const row = connect(
  function (prev, id) {
    const item = store.getState().data.ref[id];
    const selected = store.getState().selected === item;
    if (prev !== null && prev.in.item === item && prev.in.selected === selected) {
      return prev;
    }
    return selectorData({ item, selected });
  },
  Row
);

const rowList = connect(
  function (prev) {
    const rows = store.getState().data;
    if (prev !== null && prev.in === rows) {
      return prev;
    }
    return selectorData(rows, rows.ref);
  },
  function (rows) { return h.tbody().children(map(rows, (r, i) => row(i).key(r.id))); }
);

function button(text, id) {
  return h.div("col-sm-6 smallpad").children(
    h.button("btn btn-primary btn-block")
      .events(Events.onClick(() => { store.dispatch({ type: id }); }))
      .props({ "type": "button", "id": id })
      .children(text)
  );
}

render(
  h.div("container").children(
    h.div("jumbotron").children(
      h.div("row").children(
        h.div("col-md-6").children(h.h1().children("ivi v0.8.0")),
        h.div("col-md-6").children(
          h.div("row").children(
            button("Create 1,000 rows", "run"),
            button("Create 10,000 rows", "runlots"),
            button("Append 1,000 rows", "add"),
            button("Update every 10th row", "update"),
            button("Clear", "clear"),
            button("Swap Rows", "swaprows")
          )
        )
      )
    ),
    h.table("table table-hover table-striped test-data").children(rowList()),
    h.span("preloadicon glyphicon glyphicon-remove").props(HiddenAttributes)
  ),
  document.getElementById("main")
);
