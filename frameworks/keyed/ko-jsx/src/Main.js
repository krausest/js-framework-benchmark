import { render } from 'ko-jsx';
import { observable, observableArray } from 'knockout';
import template from './template';

function _random(max) { return Math.round(Math.random() * 1000) % max; }

var rowId = 1;
var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count) {
  var data = [];
  for (var i = 0; i < count; i++) {
    data.push({
      id: rowId++,
      label: observable(adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)])
    });
  }
  return data;
}

var HomeViewModel = function () {
  const selected = observable(null),
    data = observableArray();

  return {
    data,
    selected,
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
      var tmp = data();
      for (let i = 0; i < tmp.length; i += 10) {
        tmp[i].label(tmp[i].label() + ' !!!');
      }
    },
    clear () {
      data.removeAll();
      selected(null);
    },
    swapRows () {
      var tmp = data();
      if (tmp.length > 998) {
        var a = tmp[1];
        tmp[1] = tmp[998];
        tmp[998] = a;
        data(tmp);
      }
    },
    remove(id) {
      var tmp = data();
      const idx = tmp.findIndex(d => d.id === id);
      data.splice(idx, 1);
    }
  }
};

render(() => template(new HomeViewModel()), document.getElementById('main'))