'use strict';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

class BenchmarkRow extends HTMLElement {
    dataId;

    constructor(dataId, rowLabel) {
        super();
        this.dataId = dataId;
        const shadow = this.attachShadow({ mode: "open" });
        /* 
        with style:
            create rows 365.52.6 ± 2.6
            replace all rows 384.31.7 ± 1.7
            partial update 281.15.2 ± 5.2
            select row 40.32.1 ± 2.1
            swap rows 38.43.1 ± 3.1
            remove row 36.91.4 ± 1.4
            create many rows 3,529.715.5 ± 15.5
            append rows to large table 743.95.9 ± 5.9
            clear rows 322.27.4 ± 7.4
        */
        // const style = document.createElement('style');
        // style.innerHTML = `
        //     :host {
        //         display: block;
        //     }
        //     tr.danger {
        //         background-color: #f2dede;
        //     }
        //     .lbl {
        //         color: #337ab7;
        //     }
        // `;
        // shadow.appendChild(style);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class='col-md-1'>${dataId}</td>
            <td class='col-md-4'>
                <a class='lbl'>${rowLabel}</a>
            </td>
            <td class='col-md-1'>
                <a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'>X</span></a>
            </td>
            <td class='col-md-6'></td>
        `;
        shadow.appendChild(row);

        row.addEventListener('click', (e) => {
            const el = /** @type {HTMLElement} */ (e.target);
            if(el.closest('.lbl')) {
                this._fireEvent('select');
            } else if (el.closest('.remove')) {
                this._fireEvent('delete');
            }
        });
    }

    _fireEvent(action) {
        this.dispatchEvent(
            new CustomEvent('benchmark-row-action', {
                bubbles: true,
                detail: {
                    action,
                    rowId: this.dataId,
                },
            })
        );
    }
}

customElements.define('benchmark-row', BenchmarkRow);

class Store {
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
            this.data[i].label += ' !!!';
            // this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
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
        if(this.data.length > 998) {
            var a = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = a;
        }
    }
}

var getParentId = function(elem) {
    while (elem) {
        if (elem.tagName==="TR") {
            return elem.dataId;
        }
        elem = elem.parentNode;
    }
    return undefined;
}

class Main {
    constructor(props) {
        this.store = new Store();
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.start = 0;
        /**
         * @type {BenchmarkRow[]}
         */
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
        });
        document.getElementById("main").addEventListener('benchmark-row-action', e => {
            const {action, rowId} = e.detail;
            if (action === 'delete') {
                e.preventDefault();
                const idx = this.findIdx(rowId)
                this.delete(idx);
            }
            else if (action === 'select') {
                e.preventDefault();
                const idx = this.findIdx(rowId)
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
    run() {
        this.removeAllRows();
        this.store.clear();
        this.rows = [];
        this.data = [];
        this.store.run();
        this.appendRows();
        this.unselect();
    }
    add() {
        this.store.add();
        this.appendRows();
    }
    update() {
        this.store.update();
        for (let i=0;i<this.data.length;i+=10) {
            this.rows[i].shadowRoot.children[0].children[1].children[0].innerText = this.store.data[i].label;
        }
    }
    unselect() {
        if (this.selectedRow !== undefined) {
            this.selectedRow.shadowRoot.children[0].className = "";
            this.selectedRow = undefined;
        }
    }
    select(idx) {
        this.unselect();
        this.store.select(this.data[idx].id);
        this.selectedRow = this.rows[idx];
        this.selectedRow.shadowRoot.children[0].className = "danger";
    }
    recreateSelection() {
        let old_selection = this.store.selected;
        let sel_idx = this.store.data.findIndex(d => d.id === old_selection);
        if (sel_idx >= 0) {
            this.store.select(this.data[sel_idx].id);
            this.selectedRow = this.rows[sel_idx];
            this.selectedRow.shadowRoot.children[0].className = "danger";
        }
    }
    delete(idx) {
        // Remove that row from the DOM
        this.store.delete(this.data[idx].id);
        this.rows[idx].remove();
        this.rows.splice(idx, 1);
        this.data.splice(idx, 1);
        this.unselect();
        this.recreateSelection();
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
        this.removeAllRows();
        this.store.clear();
        this.rows = [];
        this.data = [];
        this.store.runLots();
        this.appendRows();
        this.unselect();
    }
    clear() {
        this.store.clear();
        this.rows = [];
        this.data = [];
        // This is actually a bit faster, but close to cheating
        // requestAnimationFrame(() => {
            this.removeAllRows();
            this.unselect();
        // });
    }
    swapRows() {
        if (this.data.length>10) {
            this.store.swapRows();
            this.data[1] = this.store.data[1];
            this.data[998] = this.store.data[998];

            this.tbody.insertBefore(this.rows[998], this.rows[2])
            this.tbody.insertBefore(this.rows[1], this.rows[999])

            let tmp = this.rows[998];
            this.rows[998] = this.rows[1];
            this.rows[1] = tmp;
        }


        // let old_selection = this.store.selected;
        // this.store.swapRows();
        // this.updateRows();
        // this.unselect();
        // if (old_selection>=0) {
        //     let idx = this.store.data.findIndex(d => d.id === old_selection);
        //     if (idx > 0) {
        //         this.store.select(this.data[idx].id);
        //         this.selectedRow = this.rows[idx];
        //         this.selectedRow.className = "danger";
        //     }
        // }
    }
    appendRows() {
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
        var rows = this.rows, s_data = this.store.data, data = this.data, tbody = this.tbody;
        for(let i=rows.length;i<s_data.length; i++) {
            let tr = this.createRow(s_data[i]);
            rows[i] = tr;
            data[i] = s_data[i];
            tbody.appendChild(tr);
        }
    }
    createRow(data) {
        return new BenchmarkRow(data.id, data.label);
    }
}

new Main();
