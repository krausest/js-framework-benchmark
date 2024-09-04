
import { ArrayActions, call, ChildrenActions } from 'deleight/apption';
import { apply, parentSelector } from "deleight/appliance";

const _random = ((max) => Math.round(Math.random() * 1000) % max), click = (handler => element => element.onclick = handler);
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const array = [], tbody = document.querySelector('tbody'), row = document.querySelector('template').content.firstElementChild;
const rowId = row.querySelector('td'), rowlbl = row.querySelector('a');
let id = 1, selected = null;

const AppChildrenActions = class extends ChildrenActions {
    render(item) {
        return (rowId.firstChild.nodeValue = item.id) && (rowlbl.firstChild.nodeValue = item.lbl) && row.cloneNode(true);
    } update(value = ' !!!') {
        for (let i = 0; i < array.length; i += 10) 
            this.element.children[i].querySelector('a').firstChild.nodeValue = array[i].lbl += value;
    }
}, actions = [new ArrayActions(array), new AppChildrenActions(tbody)];

function* createItems(n) { 
    for (let i = 0; i < n; i++, id++) 
        yield { id, lbl: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}` } 
} 
function run(n = 1000) { call({ clear: actions, push: actions }, ...createItems(n)) }
apply({
    "#run": click(() => run(1000)), "#runlots": click(() => run(10000)),
    "#add": click(() => call({ push: actions }, ...createItems(1000))),
    "#update": click(() => call({ update: [actions[1]] })), "#clear": click(() => call({ clear: actions })),
    "#swaprows": click(() => call({ swap: actions }, 1, 998)),
    tbody: click((e) => {
        const row = parentSelector(e.target, 'tr'); if (!row) return;
        const index = Array.prototype.indexOf.call(tbody.children, row);
        if (e.target.tagName === 'A') {
            if (selected) selected.className = '';
            selected = (row === selected)? null: row;
            if (selected) selected.className = 'danger';
        } else if (e.target.tagName === 'SPAN') call({ splice: actions }, index, 1); 
    })
}, document.body, true, true);