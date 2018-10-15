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
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

const rowTemplate = document.createElement("tr");
rowTemplate.innerHTML = "<td class='col-md-1'></td><td class='col-md-4'><a class='lbl'></a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";

var rowId = 1;
function buildData(count = 1000) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++)
        data.push({id: rowId++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return data;
}

var getParentId = function(elem) {
    while (elem) {
        if (elem.tagName==="TR") {
            return elem.data_id;
        }
        elem = elem.parentNode;
    }
    return undefined;
}
class Main {
    constructor() {
        this.data = [];
        this.selectedRow = undefined;
        this.selectedIndex = undefined;

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
                let idx = this.data.findIndex(row => row.id === id);
                //console.log("delete",idx);
                this.delete(idx);
            }
            else if (e.target.matches('.lbl')) {
                e.preventDefault();
                let id = getParentId(e.target);
                let idx = this.data.findIndex(row => row.id === id);
                //console.log("select",idx);
                this.select(idx);
            }
        });
        this.tbody = document.getElementById("tbody");
    }
    printDuration() {
        stopMeasure();
    }
    run() {
        startMeasure("run");
        const newData = buildData(1000);
        this.updateRows(newData);
        this.appendRows(newData);
        this.unselect();
        stopMeasure();
    }
    add() {
        startMeasure("add");
        const newData = this.data.concat(buildData(1000));
        this.appendRows(newData);
        stopMeasure();
    }
    update() {
        startMeasure("update");
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!'
            this.tbody.childNodes[i].firstChild.nextSibling.firstChild.firstChild.data = this.data[i].label;
        }
        stopMeasure();
    }
    unselect() {
        if (this.selectedRow !== undefined) {
            this.selectedRow.className = "";
            this.selectedRow = undefined;
            this.selectedIndex = undefined;
        }
    }
    select(idx) {
        startMeasure("select");
        this.unselect();
        this.selectedIndex = idx;
        this.selectedRow = this.tbody.childNodes[idx];
        this.selectedRow.className = "danger";
        stopMeasure();
    }
    delete(idx) {
        startMeasure("delete");
        // Remove that row from the DOM
        // this.store.delete(this.data[idx].id);
        // this.rows[idx].remove();
        // this.rows.splice(idx, 1);
        // this.data.splice(idx, 1);

        // Faster, shift all rows below the row that should be deleted rows one up and drop the last row
        let tr = tbody.childNodes[idx];
        for(let i=idx, length=this.tbody.childNodes.length-2; i<length;i++) {
            let data =  this.data[i+1];
            tr.data_id = data.id;
            tr.firstChild.innerText = data.id;
            tr.firstChild.nextSibling.firstChild.textContent = data.label;
            tr = tr.nextSibling;
        }
        this.data.splice(idx, 1);
        tbody.lastChild.remove();

        stopMeasure();
    }
    updateRows(newData) {
        let tr = this.tbody.firstChild;
        for(let i=0, length=this.tbody.childNodes.length;i<length;i++) {
            if (this.data[i] !== newData[i]) {
                let data = newData[i];
                tr.data_id = data.id;
                tr.firstChild.textContent = data.id;
                tr.firstChild.nextSibling.firstChild.textContent = data.label;
                this.data[i] = data;
            }
            tr = tr.nextSibling;
        }
    }
    removeAllRows() {
        // ~258 msecs
        // for(let i=this.rows.length-1;i>=0;i--) {
        //     tbody.removeChild(this.rows[i]);
        // }
        // ~251 msecs
        // for(let i=0;i<this.rows.length;i++) {
        //     tbody.removeChild(this.rows[i]);
        // }
        // ~216 msecs
        // var cNode = tbody.cloneNode(false);
        // tbody.parentNode.replaceChild(cNode ,tbody);
        // ~212 msecs
        this.tbody.textContent = "";

        // ~236 msecs
        // var rangeObj = new Range();
        // rangeObj.selectNodeContents(tbody);
        // rangeObj.deleteContents();
        // ~260 msecs
        // var last;
        // while (last = tbody.lastChild) tbody.removeChild(last);
    }
    runLots() {
        startMeasure("runLots");
        const newData = buildData(10000);
        this.updateRows(newData);
        this.appendRows(newData);
        this.unselect();
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        this.data = [];
        // 165 to 175 msecs, but feels like cheating
        // requestAnimationFrame(() => {
            this.removeAllRows();
            this.unselect();
            stopMeasure();
        // });
    }
    swapRows() {
        startMeasure("swapRows");
        if(this.data.length > 998) {
            const oldSelection = this.selectedIndex,
              newData = this.data.slice(0);
            newData[1] = this.data[998];
            newData[998] = this.data[1];
            this.updateRows(newData);
            if (oldSelection === 1 || oldSelection === 998) {
                this.unselect();
                const idx = oldSelection === 1 ? 998 : 1;
                this.selectedIndex = idx;
                this.selectedRow = this.tbody.childNodes[idx];
                this.selectedRow.className = "danger";
            }
        }
        stopMeasure();
    }
    appendRows(newData) {
        // Using a document fragment is slower...
        // var docfrag = document.createDocumentFragment();
        // for(let i=this.rows.length;i<this.store.data.length; i++) {
        //     let tr = this.createRow(this.store.data[i]);
        //     this.rows[i] = tr;
        //     this.data[i] = this.store.data[i];
        //     docfrag.appendChild(tr);
        // }
        // this.tbody.appendChild(docfrag);

        // ... than adding directly
        var tbody = this.tbody;
        for(let i=this.data.length, len=newData.length;i<len; i++) {
            tbody.appendChild(this.createRow(newData[i]));
            this.data.push(newData[i]);
        }
    }
    createRow(data) {
        const tr = rowTemplate.cloneNode(true),
            td1 = tr.firstChild,
            a2 = td1.nextSibling.firstChild;
        tr.data_id = data.id;
        td1.textContent = data.id;
        a2.textContent = data.label;
        return tr;
    }
}

new Main();
