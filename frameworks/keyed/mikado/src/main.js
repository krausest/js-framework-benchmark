"use strict";

import Mikado from "../node_modules/mikado/src/mikado.js";
import app from "./template/app.es6.js";
import item from "./template/item.es6.js";
import { buildData } from "./data.js";
import { startMeasure, stopMeasure } from "./bench.js";

const main = document.getElementById("main");
new Mikado(main, app).render().destroy(true);

const state = { "selected": -1 };
const root = document.getElementById("tbody");
const mikado = Mikado.new(root, item, {

    "store": true,
    "loose": true,
    "reuse": false,
    "state": state  // external reference
})
.route("run", function(){
    if(DEBUG) startMeasure("run");
    mikado.render(buildData(1000));
    if(DEBUG) stopMeasure();
})
.route("runlots", function(){
    if(DEBUG) startMeasure("runlots");
    mikado.render(buildData(10000));
    if(DEBUG) stopMeasure();
})
.route("add", function(){
    if(DEBUG) startMeasure("add");
    mikado.append(buildData(1000));
    if(DEBUG) stopMeasure();
})
.route("update", function(){
    if(DEBUG) startMeasure("update");
    for(let i = 0, len = mikado.length; i < len; i += 10){
        mikado.item(i).label += " !!!";
        mikado.refresh(i);
    }
    if(DEBUG) stopMeasure();
})
.route("clear", function(){
    if(DEBUG) startMeasure("clear");
    mikado.clear();
    if(DEBUG) stopMeasure();
})
.route("swaprows", function(){
    if(DEBUG) startMeasure("swaprows");
    mikado.swap(1, 998);
    if(DEBUG) stopMeasure();
})
.route("remove", function(target){
    if(DEBUG) startMeasure("remove");
    mikado.remove(target);
    if(DEBUG) stopMeasure();
})
.route("select", function(target){
    if(DEBUG) startMeasure("select");
    const selected = state["selected"];
    if(selected >= 0) mikado.node(selected).className = "";
    target.className = "danger";
    state["selected"] = mikado.index(target);
    if(DEBUG) stopMeasure();
})
.listen("click");
