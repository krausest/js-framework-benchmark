import { createTree } from 'eventiveness/apriori';
import { apply, set, parentSelector } from 'eventiveness/appliance';
import { preventDefault, stopPropagation, eventListener, matchEventListener} from 'eventiveness/domitory';
import { one } from 'eventiveness/onetomany';
import {range} from 'eventiveness/generational';


function _random(max) {return Math.round(Math.random() * 1000) % max;}
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];


function data() {
    return {
        index: 1,
        *createIndices(n) {
            const start = this.index;
            const end = (this.index += n);
            for (let i = start; i < end; i++) yield i;
        },
        *createLabels(n) {
            for (let i = 0; i < n; i++) {
                yield adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)];
            }
        },
        build(n, context) {
            context.indices.push(...this.createIndices(n));
            context.data.push(...this.createLabels(n));
        },
        create(n, context) {
            this.clear(context); 
            this.build(n, context);
        },
        append(n, context) {this.build(n, context)},
        update(context) {
            const length = context.data.length;
            for (let i = 0; i < length; i += 10) context.data[i] += ' !!!';
        },
        clear(context) {context.data = []; context.indices = [];},
        swap(context) {
            if (context.data.length >= 999) {
                [context.data[1], context.data[998]] = [context.data[998], context.data[1]];
                [context.indices[1], context.indices[998]] = [context.indices[998], context.indices[1]]; 
            }
        },
        remove(element, context) {
            const index = Array.from(element.parentNode.children).indexOf(element);
            context.indices.splice(index); context.data.splice(index);
        }
    }
}

function view(table) {
    return {
        create(n, context) {
            this.clear();
            this.append(n, context);
        },
        append(n, context) {
            let markup = [], length = context.data.length;
            for (let i = length - n; i < length; i++) markup.push(`<tr><td class='col-md-1'>${context.indices[i]}</td><td class='col-md-4'><a class='lbl'>${context.data[i]}</a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td></tr>`);
            table.append(createTree(markup.join('')));
        },
        update(context) {
            set('a.lbl', [...range(0, context.data.length, 10)], 
            {textContent: context.data}, table);
        },
        clear(context) {table.innerHTML = '';},
        swap(context) {
            if (table.children.length >= 999) {
                const e998 = table.children[998];
                table.replaceChild(table.children[1], e998);
                table.insertBefore(e998, table.children[1]);
            }
        },
        remove(element, context) {table.removeChild(element);}
    }
}

apply({
    'tbody': table => {
        const component = one([data(), view(table)]);

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
            component.remove([parentSelector(e.target, 'tr')]);
        };
        
        table.addEventListener('click', matchEventListener({
            'a.lbl': e => select(e.target.parentNode.parentNode),
            'span.remove': eventListener([removeListener, preventDefault, stopPropagation], {})
        }));

        const btnListener = (fn) => btn => btn.addEventListener('click', fn);

        apply({
            '#run': btnListener(() => component.create([1000])),
            '#runlots': btnListener(() => component.create([10000])),
            '#add': btnListener(() => component.append([1000])),
            '#update': btnListener(() => component.update()),
            '#clear': btnListener(() => component.clear()),
            '#swaprows': btnListener(() => component.swap())
        });
    }
});
