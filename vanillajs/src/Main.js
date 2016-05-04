'use strict';

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export class Store {
    constructor() {
        this.data = [];
        this.backup = null;
        this.selected = null;
        this.id = 1;
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
        }
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id==id);
        this.data = this.data.filter((e,i) => i!=idx);
        return this;
    }
    run() {
        this.data = this.buildData();
        this.selected = null;
    }
    add() {
        this.data = this.data.concat(this.buildData(1000));
        this.selected = null;
    }
    update() {
        this.updateData();
        this.selected = null;
    }
    select(id) {
        this.selected = id;
    }
    hideAll() {
        this.backup = this.data;
        this.data = [];
        this.selected = null;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = null;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = null;
    }
    clear() {
        this.data = [];
        this.selected = null;
    }
    swapRows() {
        if(this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
    }
}

var td=function(className) {
    let td = document.createElement("td");
    td.setAttribute("class", className);
    return td;
}

var getParentId = function(elem) {
    while (elem) {
        if (elem.tagName==="TR") {
            return parseInt(elem.getAttribute("data-id"));
        }
        elem = elem.parentNode;
    }
    return undefined;
}
export class Main {
    constructor(props) {
        this.store = new Store();
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.start = 0;
        this.rows = [];
        this.data = [];
        this.selectedRow = undefined;

        document.getElementById("main").addEventListener('click', e => {
            //console.log("listener",e);
            if (e.target.matches('#add')) {
                e.preventDefault();
                //console.log("add");
                this.add();
            }
            else if (e.target.matches('#run')) {
                e.preventDefault();
                //console.log("run");
                this.run();
            }
            else if (e.target.matches('#update')) {
                e.preventDefault();
                //console.log("update");
                this.update();
            }
            else if (e.target.matches('#hideall')) {
                e.preventDefault();
                //console.log("hideAll");
                this.hideAll();
            }
            else if (e.target.matches('#showall')) {
                e.preventDefault();
                //console.log("showAll");
                this.showAll();
            }
            else if (e.target.matches('#runlots')) {
                e.preventDefault();
                //console.log("runLots");
                this.runLots();
            }
            else if (e.target.matches('#clear')) {
                e.preventDefault();
                //console.log("clear");
                this.clear();
            }
            else if (e.target.matches('#swaprows')) {
                e.preventDefault();
                //console.log("swapRows");
                this.swapRows();
            }
            else if (e.target.matches('.remove')) {
                e.preventDefault();
                let id = getParentId(e.target);
                let idx = this.findIdx(id);
                //console.log("delete",idx);
                this.delete(idx);
            }
            else if (e.target.matches('.lbl')) {
                e.preventDefault();
                let id = getParentId(e.target);
                let idx = this.findIdx(id);
                //console.log("select",idx);
                this.select(idx);
            }
        });
        this.tbody = document.getElementById("tbody");
    }
    findIdx(id) {
        for (let i=0;i<this.data.length;i++){
            if (this.data[i].id === id) return i;
        }
        return undefined;
    }
    printDuration() {
        stopMeasure();
    }
    run() {
        startMeasure("run");
        this.store.run();
        this.updateRows();
        this.appendRows();
        this.unselect();
        stopMeasure();
    }
    add() {
        startMeasure("add");
        this.store.add();
        this.appendRows();
        this.unselect();
        stopMeasure();
    }
    update() {
        startMeasure("update");
        this.store.update();
        this.updateRows();
        stopMeasure();
    }
    unselect() {
        if (this.selectedRow !== undefined) {
            this.selectedRow.setAttribute("class","");
            this.selectedRow = undefined;
        }
    }
    select(idx) {
        startMeasure("select");
        this.unselect();
        this.store.select(this.data[idx].id);
        this.selectedRow = this.rows[idx];
        this.selectedRow.setAttribute("class","danger");
        stopMeasure();
    }
    delete(idx) {
        startMeasure("delete");
        this.store.delete(this.data[idx].id);
        tbody.removeChild(this.rows[idx]);
        this.rows.splice(idx, 1);
        this.data.splice(idx, 1);
        stopMeasure();
    }
    updateRows() {
        for(let i=0;i<this.rows.length;i++) {
            if (this.data[i] !== this.store.data[i]) {
                let tr = this.rows[i];
                let data = this.store.data[i];
                tr.setAttribute("data-id", data.id);
                tr.childNodes[0].innerText = data.id;
                tr.childNodes[1].childNodes[0].innerText = data.label;
                this.data[i] = this.store.data[i];
            }
        }
    }
    hideAll() {
        startMeasure("hideAll");
        this.store.hideAll();
        for(let i=0;i<this.rows.length;i++) {
            tbody.removeChild(this.rows[i]);
        }
        this.rows = [];
        this.data = [];
        this.unselect();
        stopMeasure();
    }
    showAll() {
        startMeasure("showAll");
        this.store.showAll();
        this.updateRows();
        this.appendRows();
        this.unselect();
        stopMeasure();
    }
    runLots() {
        startMeasure("runLots");
        this.store.runLots();
        this.updateRows();
        this.appendRows();
        this.unselect();
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        for(let i=0;i<this.rows.length;i++) {
            tbody.removeChild(this.rows[i]);
        }
        this.store.clear();
        this.rows = [];
        this.data = [];
        this.unselect();
        stopMeasure();
    }
    swapRows() {
        startMeasure("swapRows");
        this.store.swapRows();
        this.updateRows();
        this.unselect();
        stopMeasure();
    }
    appendRows() {
        var docfrag = document.createDocumentFragment();
        for(let i=this.rows.length;i<this.store.data.length; i++) {
            let tr = this.createRow(this.store.data[i]);
            this.rows[i] = tr;
            this.data[i] = this.store.data[i];
            docfrag.appendChild(tr);
        }
        tbody.appendChild(docfrag);
    }
    createRow(data) {
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", data.id);
        let td1 = td("col-md-1");
        td1.innerText = data.id;
        tr.appendChild(td1);

        let td2 = td("col-md-4")
        tr.appendChild(td2);
        let a2 = document.createElement("a");
        a2.setAttribute("class","lbl");
        td2.appendChild(a2);
        a2.innerText = data.label;

        let td3 = td("col-md-1");
        tr.appendChild(td3);
        let a = document.createElement("a");
        a.setAttribute("class","remove");
        td3.appendChild(a);
        let span = document.createElement("span");
        span.setAttribute("class","glyphicon glyphicon-remove remove");
        span.setAttribute("aria-hidden","true");
        a.appendChild(span);

        let td5 = td("col-md-6");
        tr.appendChild(td5)

        return tr;
    }
}

new Main();
