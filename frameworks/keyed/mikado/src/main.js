import Mikado from "../node_modules/mikado/src/mikado.js";
import tpl_app from "./template/app.es6.js";
import tpl_item from "./template/item.es6.js";
import buildData from "./data.js";

Mikado.once(document.getElementById("main"), tpl_app);

let data = [];
const root = document.getElementById("tbody");
const view = new Mikado(root, tpl_item, { "reuse": false, "state": 0 })
.route("run", () => view.render(data = buildData(1000)))
.route("runlots", () => view.render(data = buildData(10000)))
.route("add", () => view.append(buildData(1000)))
.route("update", () => {
    for(let i = 0; i < view.length; i += 10){
        data[i].label += " !!!";
        view.update(i, data[i]);
    }
})
.route("clear", () => view.clear())
.route("swaprows", () => {
    const tmp = data[1];
    data[1] = data[998];
    data[998] = tmp;
    view.reconcile(data);
})
.route("remove", target => view.remove(target))
.route("select", target => view.update(target, data[view.state = view.index(target)]))
.listen("click");
