"use strict";

import Mikado from "../node_modules/mikado/src/mikado.js";
import template from "./template.es6.js";
import { buildData } from "./data.js";
import { startMeasure, stopMeasure } from "./bench.js";

const root = document.getElementById("tbody");
const mikado = new Mikado(root, /** @type {Template} */ (template), {

    "store": true,
    "loose": true,
    "reuse": false

}).route("run", function(){
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
    for(let i = 0, item, len = mikado.length; i < len; i += 10){
        item = mikado.item(i);
        item.label += " !!!";
        mikado.update(i);
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
.route("remove", function(node){
    if(DEBUG) startMeasure("remove");
    mikado.remove(node);
    if(DEBUG) stopMeasure();
})
.route("select", function(node){
    if(DEBUG) startMeasure("select");
    let selected = mikado.state.selected;
    if(selected >= 0){
        selected = mikado.node(selected);
        if(selected === node) return;
        selected.className = "";
    }
    node.className = "danger";
    mikado.state.selected = mikado.index(node);
    if(DEBUG) stopMeasure();
})
.listen("click");
