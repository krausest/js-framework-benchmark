import Mikado from "../node_modules/mikado/src/mikado.js";
import Array from "../node_modules/mikado/src/array.js";
import tpl_app from "./template/app.es6.js";
import tpl_item from "./template/item.es6.js";
import buildData from "./data.js";

Mikado.once(document.getElementById("main"), tpl_app);

const store = new Array();
const view = new Mikado(document.getElementById("tbody"), tpl_item, {
    "reuse": false, "store": store
})
.route("run", () => store.set(buildData(1000)))
.route("runlots", () => store.set(buildData(10000)))
.route("add", () => store.concat(buildData(1000)))
.route("update", () => {
    for(let i = 0, len = store.length; i < len; i += 10)
        store[i].label += " !!!"
})
.route("clear", () => store.splice())
.route("swaprows", () => {
    const tmp = store[998];
    store[998] = store[1];
    store[1] = tmp;
})
.route("remove", target => store.splice(view.index(target), 1))
.route("select", target => view.refresh(view.selected = view.index(target)));
