import { createTree } from 'eventiveness/apriori';
import { apply, set, parentSelector } from 'eventiveness/appliance';
import { preventDefault, stopPropagation, eventListener, matchEventListener} from 'eventiveness/domitory';
import { one } from 'eventiveness/onetomany';
import {range} from 'eventiveness/generational';

function _random(max) {return Math.round(Math.random() * 1000) % max;}
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

class View {
    constructor(parent) {this.parent = parent;}
    create(data, index, n) {
        this.clear();
        this.append(data, index, n);
    }
    append(data, index, n) {
        let markup = [], length = data.length;
        for (let i = data.length - n; i < length; i++) markup.push(`<tr><td class='col-md-1'>${index[i]}</td><td class='col-md-4'><a class='lbl'>${data[i]}</a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td></tr>`);
        this.parent.append(createTree(markup.join('')));
    }
    setLabel(at, data) {
        return set('a.lbl', at, {textContent: data}, this.parent);
    }
    swap() {
        const e998 = this.parent.children[998];
        this.parent.replaceChild(this.parent.children[1], e998);
        this.parent.insertBefore(e998, this.parent.children[1]);
    }
    clear() {this.parent.innerHTML = '';}
}


class Component {
    constructor(table) {
        Object.assign(this, {
            index: 1, data: [], indices: [], view: new View(table)
        });
        this.all = one([this.data, this.indices]);
    }
    *createIndices(n) {
        const start = this.index;
        const end = (this.index += n);
        for (let i = start; i < end; i++) yield i;
    }
    *createLabels(n) {
        for (let i = 0; i < n; i++) {
            yield adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)];
        }
    }
    build(n) {
        this.indices.push(...this.createIndices(n));
        this.data.push(...this.createLabels(n));
        return [this.data, this.indices, n];
    }
    create(n) {this.clear(); this.view.create(...this.build(n));}
    append(n) {this.view.append(...this.build(n));}
    update() {
        const length = this.data.length;
        for (let i = 0; i < length; i += 10) this.data[i] += ' !!!';
        this.view.setLabel([...range(0, length, 10)], this.data);
    }
    swap() {
        if (this.data.length >= 999) {
            [this.data[1], this.data[998]] = [this.data[998], this.data[1]];
            [this.indices[1], this.indices[998]] = [this.indices[998], this.indices[1]], 
            this.view.swap();
        }
    }
    beforeRemove(element) {
        return this.all.splice([Array.from(this.view.parent.children).indexOf(element), 1]) && element;
    }
    clear() {
        this.data.length = this.indices.length = 0;
        this.view.clear();
    }
}


apply({
    'tbody': table => {
        const component = new Component(table);

        let selected;
        function select(node) {
            if (node === selected) {
                selected.className = selected.className? '': 'danger';
            } else {
                if (selected) selected.className = '';
                node.className = 'danger';
                selected = node;
            }
        }

        const removeListener = (e) => {
            table.removeChild(component.beforeRemove(parentSelector(e.target, 'tr')));
        };
        
        table.addEventListener('click', matchEventListener({
            'a.lbl': e => select(e.target.parentNode.parentNode),
            'span.remove': eventListener([removeListener, preventDefault, stopPropagation], {})
        }));

        const btnListener = (fn) => btn => btn.addEventListener('click', fn);

        apply({
            '#run': btnListener(() => component.create(1000)),
            '#runlots': btnListener(() => component.create(10000)),
            '#add': btnListener(() => component.append(1000)),
            '#update': btnListener(() => component.update()),
            '#clear': btnListener(() => component.clear()),
            '#swaprows': btnListener(() => component.swap())
        });
    }
});
