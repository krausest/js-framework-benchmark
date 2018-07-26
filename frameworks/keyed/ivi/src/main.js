import { Component, statefulComponent, connect, render, map, element, onClick, stopDirtyChecking } from "ivi";
import { h1, div, span, table, tbody, tr, td, a, button } from "ivi-html";
import { store } from "./store";

const GlyphIcon = element(span("glyphicon glyphicon-remove").a({ "aria-hidden": "true" }));

const Row = statefulComponent(class extends Component {
  constructor(props) {
    super(props);
    this.click = onClick(() => { store.dispatch({ type: "select", item: this.props.item }); });
    this.del = onClick(() => { store.dispatch({ type: "delete", item: this.props.item }); });
  }

  render() {
    const { item, selected } = this.props;
    return stopDirtyChecking(
      tr(selected ? "danger" : "").c(
        td("col-md-1").c(item.id),
        td("col-md-4").c(a().e(this.click).c(item.label)),
        td("col-md-1").c(
          a().e(this.del).c(GlyphIcon()),
        ),
        td("col-md-6"),
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
  Row,
);

const RowListConnector = connect(
  (prev) => {
    const rows = store.getState().data;
    return (prev !== null && prev.rows === rows) ? prev :
      { rows, value: rows.value };
  },
  ({ value }) => tbody().c(map(value, (r, i) => RowConnector(i).k(r.id))),
);

function Button(text, id) {
  return div("col-sm-6 smallpad").c(
    button("btn btn-primary btn-block")
      .e(onClick(() => { store.dispatch({ type: id }); }))
      .a({ "type": "button", "id": id })
      .c(text),
  );
}

render(
  div("container").c(
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
    ),
    table("table table-hover table-striped test-data").c(RowListConnector()),
    GlyphIcon("preloadicon glyphicon glyphicon-remove"),
  ),
  document.getElementById("main"),
);
