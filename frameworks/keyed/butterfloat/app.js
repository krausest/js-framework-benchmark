import { jsx } from "butterfloat";
import { AppViewModel } from "./app-vm.js";
import { Row } from "./row.js";
import { map, withLatestFrom } from "rxjs";
function App(_props, { bindEffect, bindImmediateEffect, events }) {
  const vm = new AppViewModel();
  const children = vm.rows.pipe(map((row) => () => /* @__PURE__ */ jsx(Row, { vm: row })));
  bindImmediateEffect(events.run, () => vm.createRows(1e3));
  bindImmediateEffect(events.runlots, () => vm.createRows(1e4));
  bindImmediateEffect(events.add, () => vm.appendRows(1e3));
  bindImmediateEffect(events.clear, () => vm.clear());
  bindEffect(
    events.update.pipe(withLatestFrom(events.tbodyAttach)),
    ([_, tbody]) => {
      const rows = tbody.querySelectorAll("tr");
      for (let i = 0; i < rows.length; i += 10) {
        const row = rows[i];
        const id = Number.parseInt(row.dataset.id, 10);
        vm.updateRow(id);
      }
    }
  );
  bindEffect(
    events.swaprows.pipe(withLatestFrom(events.tbodyAttach)),
    ([_, tbody]) => {
      const rows = tbody.querySelectorAll("tr");
      if (rows.length > 998) {
        const row0 = rows[0];
        const row1 = rows[1];
        const row997 = rows[997];
        const row998 = rows[998];
        row0.after(row998);
        row997.after(row1);
      }
    }
  );
  return /* @__PURE__ */ jsx("div", { class: "container" }, /* @__PURE__ */ jsx("div", { class: "jumbotron" }, /* @__PURE__ */ jsx("div", { class: "row" }, /* @__PURE__ */ jsx("div", { class: "col-md-6" }, /* @__PURE__ */ jsx("h1", null, "Butterfloat")), /* @__PURE__ */ jsx("div", { class: "col-md-6" }, /* @__PURE__ */ jsx("div", { class: "row" }, /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "run",
      events: { click: events.run }
    },
    "Create 1,000 rows"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "runlots",
      events: { click: events.runlots }
    },
    "Create 10,000 rows"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "add",
      events: { click: events.add }
    },
    "Append 1,000 rows"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "update",
      events: { click: events.update }
    },
    "Update every 10th row"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "clear",
      events: { click: events.clear }
    },
    "Clear"
  )), /* @__PURE__ */ jsx("div", { class: "col-sm-6 smallpad" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      class: "btn btn-primary btn-block",
      id: "swaprows",
      events: { click: events.swaprows }
    },
    "Swap Rows"
  )))))), /* @__PURE__ */ jsx("table", { class: "table table-hover table-striped test-data" }, /* @__PURE__ */ jsx(
    "tbody",
    {
      id: "tbody",
      childrenBind: children,
      childrenBindMode: "append",
      events: { bfDomAttach: events.tbodyAttach }
    }
  )));
}
export {
  App
};
