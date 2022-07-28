import Mikado from "../node_modules/mikado/src/mikado.js";
import tpl_app from "./template/app.es6.js";
import tpl_item from "./template/item.es6.js";
import buildData from "./data.js";

Mikado.once(document.getElementById("main"), tpl_app);

let data = [];
const view = new Mikado(document.getElementById("tbody"), tpl_item)
.route("run", () => view.render(data = buildData(1000)))
.route("runlots", () => view.render(buildData(10000)))
.route("add", () => view.append(buildData(1000)))
.route("update", () => {
    for(let i = 0; i < data.length; i += 10){
        data[i].label += " !!!";
        view.update(i, data[i]);
    }
})
.route("clear", () => view.clear())
.route("swaprows", () => {
    const tmp = data[998];
    view.update(998, data[998] = data[1]);
    view.update(1, data[1] = tmp);
})
.route("remove", target => view.remove(target))
.route("select", target => {
    let selected = view.selected;
    selected && view.update(selected, data[selected]);
    view.update(selected = view.selected = view.index(target), data[selected], selected);
});
