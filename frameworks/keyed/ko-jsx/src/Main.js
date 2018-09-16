import { root } from 'ko-jsx';
import ko from 'knockout';
import template from './template';

// var startTime;
// var lastMeasure;

// var startMeasure = function (name) {
//   startTime = performance.now();
//   lastMeasure = name;
// };
// var stopMeasure = function () {
//   window.setTimeout(function () {
//     var stop = performance.now();
//     console.log(lastMeasure + " took " + (stop - startTime));
//   }, 0);
// };

var HomeViewModel = function () {
  var self = this;
  self.id = 1;

  var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
  var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

  function _random(max) {
    return Math.round(Math.random() * 1000) % max;
  }

  function buildData(count) {
    var data = [];
    for (var i = 0; i < count; i++) {
      data.push({
        id: self.id++,
        label: ko.observable(adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)])
      });
    }
    return data;
  }

  self.selected = ko.observable(null);
  self.data = ko.observableArray();

  self.run = function () {
    // startMeasure("run");
    self.data(buildData(1000));
    self.selected(null);
    // stopMeasure();
  };

  self.runLots = function () {
    // startMeasure("runLots");
    self.data(buildData(10000));
    self.selected(null);
    // stopMeasure();
  };

  self.add = function () {
    // startMeasure("add");
    self.data.push.apply(self.data, buildData(1000));
    // stopMeasure();
  };

  self.update = function () {
    // startMeasure("update");
    var tmp = self.data();
    for (let i = 0; i < tmp.length; i += 10) {
      tmp[i].label(tmp[i].label() + ' !!!');
    }
    // stopMeasure();
  };

  self.clear = function () {
    // startMeasure("clear");
    self.data.removeAll();
    self.selected(null);
    // stopMeasure();
  };

  self.swapRows = function () {
    // startMeasure("swapRows");
    var tmp = self.data();
    if (tmp.length > 998) {
      var a = tmp[1];
      tmp[1] = tmp[998];
      tmp[998] = a;
      self.data(tmp);
    }
    // stopMeasure();
  };

  self.clickRow = function(e, id) {
    if (e.target.matches('.delete')) {
      // startMeasure("delete");
      var tmp = self.data();
      const idx = tmp.findIndex(d => d.id === id);
      self.data.splice(idx, 1);
      // stopMeasure();
    } else {
      // startMeasure("select");
      self.selected(id);
      // stopMeasure();
    }
  }
};

root(function () {
  document.getElementById('main').appendChild(template(new HomeViewModel()))
});