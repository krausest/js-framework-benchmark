import { element as _mu_element, child as _mu_child, choose as _mu_choose } from "mutraction-dom";
import { track, defaultTracker, ForEach } from "mutraction-dom";
import { buildData } from "./build-dummy-data.js";
defaultTracker.setOptions({
  trackHistory: false,
  compactOnCommit: false
});
const model = track({
  selected: undefined
});
const items = track([]);
function select(item) {
  model.selected = item;
}
function create(n) {
  items.splice(0, items.length, ...buildData(n));
}
function append(n) {
  items.push(...buildData(n));
}
function update() {
  defaultTracker.startTransaction();
  for (let i = 0, found = 0; i < items.length; i++) {
    if (!(i in items)) continue;
    if (found++ % 10 === 0) items[i].label += " !!!";
  }
  defaultTracker.commit();
}
function clear() {
  items.length = 0;
}
function swapRows() {
  if (items.length > 998) {
    const i1 = 1,
      i2 = 998;
    [items[i1], items[i2]] = [items[i2], items[i1]];
  }
}
function remove(i) {
  delete items[i];
}
const app = _mu_element("div", {
  className: "container"
}, {}, _mu_element("div", {
  className: "jumbotron"
}, {}, _mu_element("div", {
  className: "row"
}, {}, _mu_element("div", {
  className: "col-md-6"
}, {}, _mu_element("h1", {}, {}, "Mutraction-\"non-keyed\"")), _mu_element("div", {
  className: "col-md-6"
}, {}, _mu_element("div", {
  className: "row"
}, {}, _mu_element("div", {
  className: "col-sm-6 smallpad"
}, {}, _mu_element("button", {
  type: "button",
  className: "btn btn-primary btn-block",
  id: "run"
}, {
  onclick: () => () => create(1_000)
}, "Create 1,000 rows")), _mu_element("div", {
  className: "col-sm-6 smallpad"
}, {}, _mu_element("button", {
  type: "button",
  className: "btn btn-primary btn-block",
  id: "runlots"
}, {
  onclick: () => () => create(10_000)
}, "Create 10,000 rows")), _mu_element("div", {
  className: "col-sm-6 smallpad"
}, {}, _mu_element("button", {
  type: "button",
  className: "btn btn-primary btn-block",
  id: "add"
}, {
  onclick: () => () => append(1_000)
}, "Append 1,000 rows")), _mu_element("div", {
  className: "col-sm-6 smallpad"
}, {}, _mu_element("button", {
  type: "button",
  className: "btn btn-primary btn-block",
  id: "update"
}, {
  onclick: () => update
}, "Update every 10th row")), _mu_element("div", {
  className: "col-sm-6 smallpad"
}, {}, _mu_element("button", {
  type: "button",
  className: "btn btn-primary btn-block",
  id: "clear"
}, {
  onclick: () => clear
}, "Clear")), _mu_element("div", {
  className: "col-sm-6 smallpad"
}, {}, _mu_element("button", {
  type: "button",
  className: "btn btn-primary btn-block",
  id: "swaprows"
}, {
  onclick: () => swapRows
}, "Swap Rows")))))), _mu_element("table", {
  className: "table table-hover table-striped test-data"
}, {}, _mu_element("tbody", {
  id: "tbody"
}, {}, _mu_child(() => ForEach(items, (item, i) => _mu_element("tr", {}, {
  classList: () => ({
    danger: item === model.selected
  })
}, _mu_element("td", {
  className: "col-md-1"
}, {}, _mu_child(() => item.id)), _mu_element("td", {
  className: "col-md-4"
}, {}, _mu_element("a", {
  className: "lbl"
}, {
  onclick: () => () => select(item)
}, _mu_child(() => item.label))), _mu_element("td", {
  className: "col-md-1"
}, {}, _mu_element("a", {
  className: "remove"
}, {
  onclick: () => () => remove(i)
}, _mu_element("span", {
  className: "remove glyphicon glyphicon-remove",
  ariaHidden: "true"
}, {}))), _mu_element("td", {
  className: "col-md-6"
}, {})))))));
document.querySelector("#main").append(app);