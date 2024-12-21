
import { apply } from "deleight/dom/apply";
import { selectParent } from "deleight/dom/parent";
import { listener, selectMembers } from 'deleight/dom/components';
import { reversible } from 'deleight/function/reversible';

const _random = ((max) => Math.round(Math.random() * 1000) % max), click = listener('click');
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const array = [], [tbody, row] = document.querySelectorAll('tbody, tr');
const keys = ['id', 'lbl'], select = reversible(el => el.className = 'danger', el => el.className = '');
let id = 1, swap = null; row.remove();

function removeFrom(element) {
    if (!element) return;
    removeFrom(element.nextElementSibling);
    element.remove();
}
function setElements(n = 1000, offset=0) {
    n += offset; 
    if (array.length > n) {
        array.length = n; removeFrom(tbody.children[n]);
    } else {
        for (let i = array.length; i < n; i++) {
            array.push({}); tbody.append(selectMembers(row.cloneNode(true)));
        }
    }
} 
function setValues(n, offset=0) {
    n += offset; let item, element;
    for (let i = offset; i < n; i++) {
        item = array[i]; element = element?.nextElementSibling || tbody.children[i];
        element.firstElementChild.textContent = item.id = id++;
        element.lbl.textContent = item.lbl = `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
}
function run(n = 1000, offset=0) { 
    setElements(n, offset); 
    setValues(n, offset)
    if (!offset) swap = null;
}
apply({
    "#run": click(() => run(1000)), "#runlots": click(() => run(10000)),
    "#add": click(() => run(1000, array.length)),
    "#update": click(() => {
        for (let i = 0; i < array.length; i += 10) {
            tbody.children[i].lbl.textContent = array[i].lbl += ' !!!'; 
        }
    }), 
    "#clear": click(() => {
        array.length = 0; tbody.textContent = ''; swap = null;
    }),
    "#swaprows": click(() => {
        if (array.length < 999) return;
        if (!swap) {
            swap = {
                i1: array[1], i998: array[998],
                e1: { id: tbody.children[1].firstElementChild.firstChild, lbl: tbody.children[1].lbl.firstChild },
                e998: { id: tbody.children[998].firstElementChild.firstChild, lbl: tbody.children[998].lbl.firstChild }
            }
        }
        for (let key of keys) {
            [ swap.e1[key].nodeValue, swap.e998[key].nodeValue ] = [ swap.i998[key], swap.i1[key] ];
            [ swap.i1[key], swap.i998[key] ] = [ swap.i998[key], swap.i1[key] ];
        }
    }),
    tbody: click((e) => {
        const row = selectParent(e.target, 'tr'); if (!row) return;
        if (e.target.tagName === 'A') select(row);
        else if (e.target.tagName === 'SPAN') {
            const index = Array.prototype.indexOf.call(tbody.children, row);
            array.splice(index, 1); row.remove();
            if (index < 999) swap = null;
        }
    })
});