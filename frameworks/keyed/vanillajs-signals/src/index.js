"use strict";
import { Signal } from "signal-polyfill";
import { effect } from "signal-utils/subtle/microtask-effect";

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const rowTemplate = document.createElement("tr");
rowTemplate.innerHTML =
  "<td class='col-md-1'> </td><td class='col-md-4'><a> </a></td><td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";

class Store {
  constructor() {
    this.data = [];
    this.backup = null;
    this.selected = null;
    this.id = 1;
  }
  buildData(count = 1000) {
    var adjectives = [
      "pretty",
      "large",
      "big",
      "small",
      "tall",
      "short",
      "long",
      "handsome",
      "plain",
      "quaint",
      "clean",
      "elegant",
      "easy",
      "angry",
      "crazy",
      "helpful",
      "mushy",
      "odd",
      "unsightly",
      "adorable",
      "important",
      "inexpensive",
      "cheap",
      "expensive",
      "fancy",
    ];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = [
      "table",
      "chair",
      "house",
      "bbq",
      "desk",
      "car",
      "pony",
      "cookie",
      "sandwich",
      "burger",
      "pizza",
      "mouse",
      "keyboard",
    ];
    var data = [];
    for (var i = 0; i < count; i++)
      data.push({
        className: new Signal.State(""),
        id: this.id++,
        label: new Signal.State(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`)
      });
    return data;
  }
  updateData(mod = 10) {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label.set(this.data[i].label.get() + " !!!")
    }
  }
  delete(id) {
    const idx = this.data.findIndex((d) => d.id == id);
    this.data = this.data.filter((e, i) => i != idx);
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
  select(data) {
    this.unselect();
    this.selected = data;
    this.selected.className.set("danger")
  }
  unselect(){
    this.selected?.className.set("")
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
    if (this.data.length > 998) {
      var a = this.data[1];
      this.data[1] = this.data[998];
      this.data[998] = a;
    }
  }
}

var getParentId = function (elem) {
  while (elem) {
    if (elem.tagName === "TR") {
      return elem.data_id;
    }
    elem = elem.parentNode;
  }
  return undefined;
};
class Main {
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

    document.getElementById("main").addEventListener("click", (e) => {
      //console.log("listener",e);
      if (e.target.matches("#add")) {
        e.stopPropagation();
        //console.log("add");
        this.add();
      } else if (e.target.matches("#run")) {
        e.stopPropagation();
        //console.log("run");
        this.run();
      } else if (e.target.matches("#update")) {
        e.stopPropagation();
        //console.log("update");
        this.update();
      } else if (e.target.matches("#runlots")) {
        e.stopPropagation();
        //console.log("runLots");
        this.runLots();
      } else if (e.target.matches("#clear")) {
        e.stopPropagation();
        //console.log("clear");
        this.clear();
      } else if (e.target.matches("#swaprows")) {
        e.stopPropagation();
        //console.log("swapRows");
        this.swapRows();
      }
    });
    document.getElementById("tbody").addEventListener("click", (e) => {
      e.stopPropagation();
      let p = e.target;
      while (p && p.tagName !== "TD") {
        p = p.parentNode;
      }
      if (!p) return;
      if (p.parentNode.childNodes[1] == p) {
        // console.log("click on label");
        const id = getParentId(e.target);
        const data = this.data.find((row) => row.id === id);
        this.select(data);
      } else if (p.parentNode.childNodes[2] == p) {
        // console.log("click on remove");
        const id = getParentId(e.target);
        const idx = this.data.findIndex((row) => row.id === id);
        this.delete(idx);
      }
    });
    this.tbody = document.getElementById("tbody");
    this.table = document.getElementsByTagName("table")[0];
  }
  findIdx(id) {
    for (let i = 0; i < this.data.length; i++) {
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
  }
  add() {
    this.store.add();
    this.appendRows();
  }
  update() {
    this.store.update();
  }
  select(data) {
    this.store.select(data);
  }
  delete(idx) {
    // Remove that row from the DOM
    this.store.delete(this.data[idx].id);
    this.rows[idx].remove();
    this.rows.splice(idx, 1);
    this.data.splice(idx, 1);
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
  }
  clear() {
    this.store.clear();
    this.rows = [];
    this.data = [];
    // This is actually a bit faster, but close to cheating
    // requestAnimationFrame(() => {
    this.removeAllRows();
    // });
  }
  swapRows() {
    if (this.data.length > 10) {
      this.store.swapRows();
      this.data[1] = this.store.data[1];
      this.data[998] = this.store.data[998];

      this.tbody.insertBefore(this.rows[998], this.rows[2]);
      this.tbody.insertBefore(this.rows[1], this.rows[999]);

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
    // var rows = this.rows, s_data = this.store.data, data = this.data, tbody = this.tbody;
    // for(let i=rows.length;i<s_data.length; i++) {
    //     let tr = this.createRow(s_data[i]);
    //     rows[i] = tr;
    //     data[i] = s_data[i];
    //     tbody.appendChild(tr);
    // }

    var rows = this.rows,
      s_data = this.store.data,
      data = this.data,
      tbody = this.tbody;
    const empty = !tbody.firstChild;
    empty && tbody.remove();
    for (let i = rows.length; i < s_data.length; i++) {
      let tr = this.createRow(s_data[i]);
      rows[i] = tr;
      data[i] = s_data[i];
      tbody.appendChild(tr);
    }
    empty && this.table.insertBefore(tbody, null);
  }
  createRow(data) {
    const tr = rowTemplate.cloneNode(true),
      td1 = tr.firstChild,
      a2 = td1.nextSibling.firstChild;
    tr.data_id = data.id;
    td1.firstChild.nodeValue = data.id;
    const labelNode = a2.firstChild;
    effect(() => labelNode.nodeValue = data.label.get())
    effect(() => tr.className = data.className.get())
    return tr;
  }
}

new Main();
