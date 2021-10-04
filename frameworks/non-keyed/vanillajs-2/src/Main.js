'use strict';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    };
  }
  return data;
}

const rowTemplate = document.createElement('tr');
rowTemplate.innerHTML = [
    '<td class="col-md-1"></td>',
    '<td class="col-md-4"><a class="lbl"></a></td>',
    '<td class="col-md-1"><a><span class="remove glyphicon glyphicon-remove" aria-hidden="true" ></span></a></td>',
    '<td class="col-md-6"></td>',
].join('');

// APP
function patchRow(node, id, label) {
    const idCell = node.firstChild;
    const contentCell = idCell.nextSibling.firstChild;
    node.id = id;
    idCell.textContent = id;
    contentCell.textContent = label;
    return node;
}

function createRow(id, label) {
    return patchRow(rowTemplate.cloneNode(true), id, label);
}

function initApp() {
    const tbody = document.getElementById("tbody");
    let rows = [];
    let selected;
    let currentData = [];

    function add(data = buildData(1000)) {
        const offset = rows.length;
        for (let i = 0, len = data.length; i < len; i++) {
            const node = createRow(data[i].id, data[i].label);
            tbody.appendChild(node);
            currentData[offset + i] = data[i];
            rows[offset + i] = node;
        }
    }
    function clear() {
        tbody.textContent = '';
        rows = [];
        currentData = [];
        selected = undefined;
    }
    function patch(data) {
        const rowL = rows.length;
        const dataL = data.length;
        if (rowL === 0) {
            add(data);
        } else if (rowL === dataL) {
            for (let i = 0; i < rowL; i++) {
                patchRow(rows[i], data[i].id, data[i].label);
                currentData[i] = data[i];
            }
        } else if (rowL < dataL) {
            for (let i = rowL; i < dataL; i++) {
                const node = createRow(data[i].id, data[i].label);
                tbody.appendChild(node);
                currentData[i] = data[i];
                rows[i] = node;
            }
            for (let i = 0; i < rowL; i++) {
                patchRow(rows[i], data[i].id, data[i].label);
                currentData[i] = data[i];
            }
        } else {
            for (let i = dataL; i < rowL; i++) {
                tbody.removeChild(rows[i]);
                currentData[i] = undefined;
                rows[i] = undefined;
            }
            for (let i = 0; i < dataL; i++) {
                patchRow(rows[i], data[i].id, data[i].label);
                currentData[i] = data[i];
                rows[i] = node;
            }
        }
    }
    function run() {
        patch(buildData(1000));
    }
    function runLots() {
        patch(buildData(10000));
    }
    function update() {
        for (let i = 0, l = rows.length; i < l; i += 10) {
            rows[i].firstChild.nextSibling.firstChild.textContent = currentData[i].label += ' !!!';
        }
    }
    function swapRows() {
        if (rows.length > 998) {
            const a = rows[1];
            const b = rows[998];
            const aData = currentData[1];
            const bData = currentData[998];
            patchRow(a, bData.id, bData.label);
            patchRow(b, aData.id, aData.label);
            currentData[1] = bData;
            currentData[998] = aData;
            if (selected === a) {
                selected = b;
                b.className = 'danger';
                a.className = '';
            } else if (selected === b) {
                selected = a;
                a.className = 'danger';
                b.className = '';
            }
        }
    }
    function remove(id) {
        const index = rows.findIndex((el) => el.id === id);
        tbody.removeChild(rows[index]);
        currentData = [...currentData.slice(0, index), ...currentData.slice(index + 1)];
        rows = [...rows.slice(0, index), ...rows.slice(index + 1)];
    }
    function select(node) {
        if (selected) {
            selected.className = '';
        }
        selected = node;
        selected.className = 'danger';
    }
    
    document.getElementById("main").addEventListener('click', e => {
        //console.log("listener",e);
        if (e.target.matches('#add')) {
            e.preventDefault();
            //console.log("add");
            add();
        }
        else if (e.target.matches('#run')) {
            e.preventDefault();
            //console.log("run");
            run();
        }
        else if (e.target.matches('#update')) {
            e.preventDefault();
            //console.log("update");
            update();
        }
        else if (e.target.matches('#runlots')) {
            e.preventDefault();
            //console.log("runLots");
            runLots();
        }
        else if (e.target.matches('#clear')) {
            e.preventDefault();
            //console.log("clear");
            clear();
        }
        else if (e.target.matches('#swaprows')) {
            e.preventDefault();
            //console.log("swapRows");
            swapRows();
        }
        else if (e.target.matches('.remove')) {
            e.preventDefault();
            remove(e.target.parentNode.parentNode.parentNode.id);
        } else if (e.target.matches('.lbl')) {
            e.preventDefault();
            select(e.target.parentNode.parentNode);
        }
    });
}

initApp();
