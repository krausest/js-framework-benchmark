import { Component, component, connect, render, map, elementFactory, disableDirtyChecking } from "ivi";
import * as h from "ivi-html";
import * as Events from "ivi-events";
import { store } from "./store";

const GlyphIcon = elementFactory(h.span("glyphicon glyphicon-remove").a({ "aria-hidden": "true" }));

const Row = component(class extends Component {
  constructor(props) {
    super(props);
    this.click = Events.onClick(() => { store.dispatch({ type: "select", item: this.props.item }); });
    this.del = Events.onClick(() => { store.dispatch({ type: "delete", item: this.props.item }); });
  }

  render() {
    const { item, selected } = this.props;
    return disableDirtyChecking(
      h.tr(selected ? "danger" : "").c(
        h.td("col-md-1").c(item.id),
        h.td("col-md-4").c(h.a().e(this.click).c(item.label)),
        h.td("col-md-1").c(
          h.a().e(this.del).c(GlyphIcon()),
        ),
        h.td("col-md-6"),
      ),
    );
  }
});

const RowConnector = connect(
  (prev, id) => {
    const item = store.getState().data.value[id];
    const selected = store.getState().selected === item;
    return (prev !== null && prev.item === item && prev.selected === selected) ? prev :
      { item, selected };
  },
  (props) => Row(props),
);

const RowListConnector = connect(
  (prev) => {
    const rows = store.getState().data;
    return (prev !== null && prev.rows === rows) ? prev :
      { rows, value: rows.value };
  },
  ({ value }) => h.tbody().c(map(value, (r, i) => RowConnector(i).k(r.id))),
);

function button(text, id) {
  return h.div("col-sm-6 smallpad").c(
    h.button("btn btn-primary btn-block")
      .e(Events.onClick(() => { store.dispatch({ type: id }); }))
      .a({ "type": "button", "id": id })
      .c(text),
  );
}

render(
  h.div("container").c(
    h.div("jumbotron").c(
      h.div("row").c(
        h.div("col-md-6").c(h.h1().c("ivi")),
        h.div("col-md-6").c(
          h.div("row").c(
            button("Create 1,000 rows", "run"),
            button("Create 10,000 rows", "runlots"),
            button("Append 1,000 rows", "add"),
            button("Update every 10th row", "update"),
            button("Clear", "clear"),
            button("Swap Rows", "swaprows"),
          ),
        ),
      ),
    ),
    h.table("table table-hover table-striped test-data").c(RowListConnector()),
    GlyphIcon("preloadicon glyphicon glyphicon-remove"),
  ),
  document.getElementById("main"),
);
