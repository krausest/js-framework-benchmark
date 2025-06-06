import { jsx } from "butterfloat";
import { concat, filter, NEVER, of, takeUntil } from "rxjs";
function Row({ vm }, { bindEffect, bindImmediateEffect, events }) {
  bindImmediateEffect(events.attach, (element) => {
    element.dataset.id = vm.id.toString();
  });
  bindImmediateEffect(events.select, () => vm.select());
  bindImmediateEffect(
    events.remove.pipe(takeUntil(vm.removed)),
    () => vm.remove()
  );
  bindEffect(
    vm.app.rowsToUpdate.pipe(filter((id2) => id2 === vm.id)),
    () => vm.updateLabel()
  );
  const id = concat(of((vm.id + 1).toString()), NEVER);
  return /* @__PURE__ */ jsx(
    "tr",
    {
      classBind: { danger: vm.selected },
      events: { bfDomAttach: events.attach }
    },
    /* @__PURE__ */ jsx("td", { class: "col-md-1", bind: { innerText: id } }),
    /* @__PURE__ */ jsx("td", { class: "col-md-4" }, /* @__PURE__ */ jsx("a", { bind: { innerText: vm.label }, events: { click: events.select } })),
    /* @__PURE__ */ jsx("td", { class: "col-md-1" }, /* @__PURE__ */ jsx("a", { type: "button", events: { click: events.remove } }, /* @__PURE__ */ jsx("span", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }))),
    /* @__PURE__ */ jsx("td", { class: "col-md-6" })
  );
}
export {
  Row
};
