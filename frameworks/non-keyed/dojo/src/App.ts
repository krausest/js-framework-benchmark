import { create, v, w } from "@dojo/framework/core/vdom";
import Row from "./Row";
import Buttons from "./Buttons";
import store from "./Store";

const factory = create({ store });

export default factory(function App({ middleware: { store } }) {
  const buttonConfigs = [
    { id: "run", label: "Create 1,000 rows", onClick: store.run },
    { id: "runlots", label: "Create 10,000 rows", onClick: store.runLots },
    { id: "add", label: "Append 1,000 rows", onClick: store.add },
    { id: "update", label: "Update every 10th row", onClick: store.update },
    { id: "clear", label: "Clear", onClick: store.clear },
    { id: "swaprows", label: "Swap Rows", onClick: store.swapRows }
  ];

  const rows = store.data.map(({ id, label }) => {
    return w(Row, {
      id,
      label,
      onDelete: store.del,
      onSelect: store.select,
      selected: store.selected
    });
  });

  return v("div", { key: "root", classes: ["container"] }, [
    w(Buttons, { buttonConfigs }),
    v(
      "table",
      { classes: ["table", "table-hover", "table-striped", "test-data"] },
      [v("tbody", rows)]
    ),
    v("span", { classes: ["preloadicon", "glyphicon", "glyphicon-remove"] })
  ]);
});
