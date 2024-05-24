"use strict";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
const [l1, l2, l3] = [adjectives.length, colours.length, nouns.length];
const data = [], nTemplates = (n) => Math.round(n / 100), tbody = document.getElementsByTagName('tbody')[0];
let index = 1, i, lbl, selected;

function create(n = 1000) { 
    if (data.length < n) { set(data.length); append(n - data.length) }
    else {
        set(data.length);
        if (data.length > n) {
            data.length = n;
            const rg = document.createRange();
            rg.setStartBefore(tbody.children[n]); 
            rg.setEndAfter(tbody.lastElementChild);
            rg.deleteContents();
        }
    }
}
function set(n) {
    const indices = tbody.querySelectorAll('td:first-child'); 
    const labels = tbody.querySelectorAll('a.lbl'); 
    let r1, r2, r3;
    for (i = 0; i < n; i++) {
        r1 = Math.round(Math.random() * 1000) % l1;
        r2 = Math.round(Math.random() * 1000) % l2;
        r3 = Math.round(Math.random() * 1000) % l3;
        indices[i].firstChild.nodeValue = index++;
        labels[i].firstChild.nodeValue = data[i] = `${adjectives[r1]} ${colours[r2]} ${nouns[r3]}`;
    }
}
function append(n = 1000) {
    const nt = nTemplates(n); let j = 0, r1, r2, r3;
    const itemTemplate = document.getElementById('itemTemplate').content.cloneNode(true);
    while (nt >= itemTemplate.children.length * 2) itemTemplate.appendChild(itemTemplate.cloneNode(true));
    while (nt > itemTemplate.children.length) itemTemplate.appendChild(itemTemplate.firstElementChild.cloneNode(true));
    
    const ids = Array.prototype.map.call(itemTemplate.querySelectorAll('td:first-child'), i => i.firstChild)
    const labels = Array.prototype.map.call(itemTemplate.querySelectorAll('a.lbl'), i => i.firstChild);
    
    while ((n -= nt) >= 0) {
        for (i = 0; i < nt; i++, j++) {
            r1 = Math.round(Math.random() * 1000) % l1;
            r2 = Math.round(Math.random() * 1000) % l2;
            r3 = Math.round(Math.random() * 1000) % l3;
            ids[i].nodeValue = index++;
            data.push(labels[i].nodeValue = `${adjectives[r1]} ${colours[r2]} ${nouns[r3]}`)    
        }
        tbody.appendChild(itemTemplate.cloneNode(true));
    }
}
function update() {
    const labels = tbody.querySelectorAll('a.lbl'), length = labels.length;
    for (i = 0; i < length; i += 10) labels[i].firstChild.nodeValue = data[i] = `${data[i]} !!!`;
}
function clear() { data.length = 0; tbody.textContent = '' }

function swap() {
    if (data.length < 999) return;
    [data[1], data[998]] = [data[998], data[1]];
    const [id1, lbl1] = tbody.children[1].querySelectorAll('td:first-child, a.lbl');
    const [id998, lbl998] = tbody.children[998].querySelectorAll('td:first-child, a.lbl');
    [id1.firstChild.nodeValue, id998.firstChild.nodeValue] = [id998.firstChild.nodeValue, id1.firstChild.nodeValue ];
    [lbl1.firstChild.nodeValue, lbl998.firstChild.nodeValue] = [lbl998.firstChild.nodeValue, lbl1.firstChild.nodeValue ]    
}
tbody.onclick = (e) => {
    e.preventDefault; e.stopPropagation;
    if (e.target.matches('a.lbl')) {
        const element = e.target.parentNode.parentNode;
        if (element === selected) selected.className = selected.className ? "" : "danger";
        else {
            if (selected) selected.className = "";
            element.className = "danger"; selected = element
        }
    } else if (e.target.matches('span.remove')) { let temp;
        const element = e.target.parentNode.parentNode.parentNode;
        data.splice(Array.prototype.indexOf.call(tbody.children, element), 1);
        element.remove();
    }
}
for (let [key, fn] of Object.entries({
    run: create, runlots: () => create(10000),
    add: append, update, clear, swaprows: swap
})) document.getElementById(key).onclick = (e) => { e.stopPropagation(), fn() }