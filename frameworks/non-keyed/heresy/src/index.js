import { define, html, render } from '../node_modules/heresy/esm/index.js';

import App from './ui/app.js';
define('App', App);

let did = 1;
const buildData = (count) => {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: did++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    }
    return data;
};

const _random = max => Math.round(Math.random() * 1000) % max;

const scope = {
    add() {
        scope.data = scope.data.concat(buildData(1000));
        update(main, scope);
    },
    run() {
        scope.data = buildData(1000);
        update(main, scope);
    },
    runLots() {
        scope.data = buildData(10000);
        update(main, scope);
    },
    clear() {
        scope.data = [];
        update(main, scope);
    },
    update() {
        const {data} = scope;
        for (let i = 0, {length} = data; i < length; i += 10)
            data[i].label += ' !!!';
        update(main, scope);
    },
    swapRows() {
        const {data} = scope;
        if (data.length > 998) {
            const tmp = data[1];
            data[1] = data[998];
            data[998] = tmp;
        }
        update(main, scope);
    },
    interact(event) {
      event.preventDefault();
      const a = event.target.closest('a');
      const id = parseInt(a.closest('tr').id, 10);
      scope[a.dataset.action](id);
    },
    delete(id) {
        const {data} = scope;
        const idx = data.findIndex(d => d.id === id);
        data.splice(idx, 1);
        update(main, scope);
    },
    select(id) {
        scope.selected = id;
        update(main, scope);
    },
    selected: -1,
    data: [],
};

const main = document.getElementById('container');

update(main, scope);

function update(main, scope) {
  render(main, html`<App .scope=${scope} />`);
}
