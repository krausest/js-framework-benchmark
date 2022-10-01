import { render, createSelector } from 'ko-jsx';
import { observable, observableArray } from 'knockout';
import template from './template';

function _random(max) { return Math.round(Math.random() * 1000) % max; }

let rowId = 1;
let adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
let colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
let nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count) {
  let data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: rowId++,
      label: observable(adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)])
    });
  }
  return data;
}

function HomeViewModel() {
  const selected = observable(null),
    data = observableArray(),
    isSelected = createSelector(selected);

  return {
    data,
    selected,
    isSelected,
    run () {
      data(buildData(1000));
      selected(null);
    },
    runLots () {
      data(buildData(10000));
      selected(null);
    },
    add () {
      data.push.apply(data, buildData(1000));
    },
    update () {
      let tmp = data();
      for (let i = 0; i < tmp.length; i += 10) {
        tmp[i].label(tmp[i].label() + ' !!!');
      }
    },
    clear () {
      data.removeAll();
      selected(null);
    },
    swapRows () {
      let tmp = data();
      if (tmp.length > 998) {
        let a = tmp[1];
        tmp[1] = tmp[998];
        tmp[998] = a;
        data(tmp);
      }
    },
    remove(id) {
      let tmp = data();
      const idx = tmp.findIndex(d => d.id === id);
      data.splice(idx, 1);
    }
  }
};

render(() => template(new HomeViewModel()), document.getElementById('main'))