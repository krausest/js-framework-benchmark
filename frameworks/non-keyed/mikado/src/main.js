import Mikado from "../node_modules/mikado/src/mikado.js";
import { route } from "../node_modules/mikado/src/event.js";
import tpl_app from "./template/app.js";
import tpl_item from "./template/item.js";
import buildData from "./data.js";

Mikado.once(document.body, tpl_app).eventCache = true;

// This implementation is using a full declarative paradigm,
// where updates are delegated by same indizes as used for the data access.

let data = [];
const state = {};
const view = new Mikado(tpl_item, { mount: document.getElementById("tbody"), recycle: true, state });
const event = { stop: true };

route("run", () => view.render(data = buildData(1000)), event);
route("runlots", () => view.render(buildData(10000)), event);
route("add", () => view.append(data = buildData(1000)), event);
route("update", () => {
    for(let i = 0; i < data.length; i += 10){
        data[i].label += " !!!";
        view.update(i, data[i]);
    }
}, event);
route("clear", () => view.clear(), event);
route("swaprows", () => {
    const tmp = data[998];
    view.update(998, data[998] = data[1]);
    view.update(1, data[1] = tmp);
}, event);
route("remove", target => view.remove(target), event);
route("select", target => {
    let current = state.selected;
    state.selected = view.index(target);
    current >= 0 && view.update(current, data[current]);
    view.update(state.selected, data[state.selected]);
}, event);