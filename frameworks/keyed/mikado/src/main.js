import Mikado from "../node_modules/mikado/src/mikado.js";
import app from "./template/app.es6.js";
import item from "./template/item.es6.js";
import { buildData } from "./data.js";

Mikado.once(document.getElementById("main"), app);

const state = { "selected": {} };
const root = document.getElementById("tbody");
const mikado = Mikado.new(root, item, {
    "reuse": false, "state": state
})
.route("run", () => { mikado.render(buildData(1000)) })
.route("runlots", () => { mikado.render(buildData(10000)) })
.route("add", () => { mikado.append(buildData(1000)) })
.route("update", () => {
    for(let i = 0, len = mikado.length; i < len; i += 10){
        mikado.data(i).label += " !!!";
        mikado.refresh(i);
    }
})
.route("clear", () => { mikado.clear() })
.route("swaprows", () => { mikado.swap(1, 998) })
.route("remove", target => { mikado.remove(target) })
.route("select", target => {
    state["selected"].className = "";
    (state["selected"] = target).className = "danger";
})
.listen("click");
