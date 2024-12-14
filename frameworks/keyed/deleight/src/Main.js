
import { calls } from 'deleight/object/shared';
import { ElementList, ArrayList } from 'deleight/lists'
import { apply } from "deleight/dom/apply";
import { selectParent } from "deleight/dom/parent";
import { listener } from 'deleight/dom/components';
import { reversible } from 'deleight/function/reversible';

const _random = ((max) => Math.round(Math.random() * 1000) % max), click = listener('click');
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const array = [], tbody = document.querySelector('tbody'), row = document.querySelector('template').content.firstElementChild;
const rowId = row.querySelector('td'), rowlbl = row.querySelector('a'), 
select = reversible(el => el.className = 'danger', el => el.className = '');
let id = 1;

const AppElementList = class extends ElementList {
    render(item) {
        return (rowId.firstChild.nodeValue = item.id) && (rowlbl.firstChild.nodeValue = item.lbl) && row.cloneNode(true);
    } update(value = ' !!!') {
        for (let i = 0; i < array.length; i += 10) 
            this.element.children[i].querySelector('a').firstChild.nodeValue = array[i].lbl += value;
    }
}, actions = [new ArrayList(array), new AppElementList(tbody)];

function* createItems(n) { 
    for (let i = 0; i < n; i++, id++) 
        yield { id, lbl: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}` } 
} 
function run(n = 1000) { calls({ clear: actions, push: actions }, ...createItems(n)) }
apply({
    "#run": click(() => run(1000)), "#runlots": click(() => run(10000)),
    "#add": click(() => calls({ push: actions }, ...createItems(1000))),
    "#update": click(() => calls({ update: [actions[1]] })), "#clear": click(() => calls({ clear: actions })),
    "#swaprows": click(() => calls({ swap: actions }, 1, 998)),
    tbody: click((e) => {
        const row = selectParent(e.target, 'tr'); if (!row) return;
        if (e.target.tagName === 'A') select(row);
        else if (e.target.tagName === 'SPAN') calls({ splice: actions }, Array.prototype.indexOf.call(tbody.children, row), 1); 
    })
}, document.body);