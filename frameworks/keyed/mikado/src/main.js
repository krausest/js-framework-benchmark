import Mikado from "../node_modules/mikado/src/mikado.js";
import app from "./template/app.es6.js";
import item from "./template/item.es6.js";
import { buildData } from "./data.js";

Mikado.once(document.getElementById("main"), app);

let data;
const state = { "selected": {} };
const root = document.getElementById("tbody");
const mikado = new Mikado(root, item, {
    "reuse": false, "state": state
})
.route("run", () => { mikado.clear().append(data = buildData(1000)) })
.route("runlots", () => { mikado.clear().append(buildData(10000)) })
.route("add", () => { mikado.append(buildData(1000)) })
.route("update", () => {
    for(let i = 0, len = mikado.length; i < len; i += 10){
        data[i].label += " !!!";
        mikado.apply(mikado.node(i), data[i]);
    }
})
.route("clear", () => { mikado.clear() })
.route("swaprows", () => {
    const tmp = data[998]
    data[998] = data[1];
    data[1] = tmp;
    mikado.reconcile(data);
})
.route("remove", target => { mikado.remove(target) })
.route("select", target => {
    state["selected"].className = "";
    (state["selected"] = target).className = "danger";
})
.listen("click");
