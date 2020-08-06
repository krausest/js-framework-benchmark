import { buildData } from "./utils";
import { createDOMView } from "@isotope/core/lib/view";
import menu from "./menu";
import "@isotope/core/lib/configurators/attribs";
import "@isotope/core/lib/configurators/classes";
import "@isotope/core/lib/nodes/html";
import "@isotope/core/lib/nodes/map";
import "@isotope/core/lib/nodes/text";

const view = createDOMView(document.querySelector("#main"));
const container = view.div({
  state: {
    data: [],
    selected: undefined,
  },
});
const select = (id) => {
  return container.setState({ selected: id });
};
const remove = (num) => {
  const data = container.getState("data");
  const idx = data.findIndex((d) => d.id === num);

  container.setState({ data: [...data.slice(0, idx), ...data.slice(idx + 1)] });
};
const add = () => {
  return container.setState({
    data: container.getState("data").concat(buildData(1000)),
  });
};
const clear = () => {
  container.setState({ data: [], selected: undefined });
};
const partialUpdate = () => {
  const data = container.getState("data");

  for (let i = 0; i < data.length; i += 10) {
    data[i].label += " !!!";
  }
  container.setState({ data });
};
const run = () => {
  container.setState({
    data: buildData(1000),
    selected: undefined,
  });
};
const runLots = () => {
  container.setState({
    data: buildData(10000),
    selected: undefined,
  });
};
const swapRows = () => {
  const data = container.getState("data");
  if (data.length > 998) {
    container.setState({
      data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]],
    });
  }
};
const btns = [
  { id: "run", onClick: run, text: "Create 1,000 rows" },
  { id: "runlots", onClick: runLots, text: "Create 10,000 rows" },
  { id: "add", onClick: add, text: "Append 1,000 rows" },
  { id: "update", onClick: partialUpdate, text: "Update every 10th row" },
  { id: "clear", onClick: clear, text: "Clear" },
  { id: "swaprows", onClick: swapRows, text: "Swap Rows" },
];

container.$(menu(btns));

container.link(
  view
    .table({
      classes: ["table", "table-hover", "table-striped", "test-data"],
    })
    .tbody()
    .map(
      () => container.getState("data"),
      (row, tbody) => {
        if (row) {
          const tableRow = tbody.tr({
            classes: () => ({
              danger: container.getState("selected") === row.id,
            }),
          });
          tableRow.td({ classes: ["col-md-1"] }).text(`${row.id}`);
          tableRow.link(
            tableRow
              .td({ classes: ["col-md-4"] })
              .a()
              .text(() => row.label)
              .on("click", () => {
                select(row.id);
              })
          );
          tableRow
            .td({ classes: ["col-md-1"] })
            .a()
            .on("click", () => remove(row.id))
            .span({
              attribs: { "aria-hidden": "true" },
              classes: ["glyphicon", "glyphicon-remove"],
            });
          tableRow.td({ classes: ["col-md-6"] });

          return tableRow;
        }
      }
    )
);
view.span({
  attribs: { "aria-hidden": "true" },
  classes: ["preloadicon", "glyphicon", "glyphicon-remove"],
});
