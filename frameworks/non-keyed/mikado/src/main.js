import Mikado from "../node_modules/mikado/src/mikado.js";
import app from "./template/app.es6.js";
import item from "./template/item.es6.js";
import { buildData } from "./data.js";

Mikado.once(document.getElementById("main"), app);

let data, state = {"selected": {}};
const root = document.getElementById("tbody");
const view = new Mikado(root, item, {
    "reuse": true, "state": state
})
.route("run", () => view.render(data = buildData(1000)))
.route("runlots", () => view.render(buildData(10000)))
.route("add", () => view.append(buildData(1000)))
.route("update", () => {
    for(let i = 0, len = view.length, item; i < len; i += 10){
        (item = data[i]).label += " !!!";
        view.update(i, item);
    }
})
.route("clear", () => view.clear())
.route("swaprows", () => view.swap(1, 998))
.route("remove", target => view.remove(target))
.route("select", target => {
    state.selected.className = "";
    (state.selected = target).className = "danger";
})
.listen("click");
