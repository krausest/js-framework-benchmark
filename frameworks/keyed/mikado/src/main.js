import Mikado, { once } from "../node_modules/mikado/src/mikado.js";
import { route } from "../node_modules/mikado/src/event.js";
import tpl_app from "./template/app.js";
import tpl_item from "./template/item.js";
import buildData from "./data.js";

once(document.body, tpl_app).eventCache = true;

const view = new Mikado(tpl_item, { mount: document.getElementById("tbody") });
let data;

route("run", () => view.clear().render(data = buildData(1000)));
route("runlots", () => view.clear().render(data = buildData(10000)));
route("add", () => view.append(data = buildData(1000)));
route("update", () => {
    for(let i = 0; i < data.length; i += 10){
        data[i].label += " !!!";
        view.update(i, data[i]);
    }
});
route("clear", () => view.clear());
route("swaprows", () => {
    const tmp = data[1];
    data[1] = data[998]
    data[998] = tmp;
    view.render(data);
});
route("remove", target => view.remove(target));
route("select", target => {
    const state = view.state;
    const current = state.selected;
    state.selected = view.index(target);
    current >= 0 && view.update(current, data[current]);
    view.update(state.selected, data[state.selected]);
});