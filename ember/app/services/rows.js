import Ember from 'ember';

function _random(max) {
  return Math.round(Math.random()*1000)%max;
}

var lastMeasure;
var startMeasure = function(name) {
  //console.timeStamp(name);
  window.performance.mark('mark_start_'+name);
  lastMeasure = name;
};
var stopMeasure = function() {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function () {
      lastMeasure = null;
      var duration = 0;
      window.performance.mark('mark_end_' + last);
      window.performance.measure('measure_' + last, 'mark_start_' + last, 'mark_end_' + last);
      var items = window.performance.getEntriesByType('measure');
      for (var i = 0; i < items.length; ++i) {
        var req = items[i];
        duration = req.duration;
        console.log(req.name + ' took ' + req.duration + 'ms');
      }
      window.performance.clearMeasures();

      //var t = window.performance.timing,
      //    complete = t.domComplete - t.domLoading,
      //    loadEventEnd = t.loadEventEnd - t.domLoading;
      //console.log(complete, loadEventEnd);
      //document.getElementById("duration").innerHTML = Math.round(stop - startTime) + " ms ("  + Math.round(duration) + " ms)" ;
    }, 0);
  }
};

export default Ember.Service.extend({
  data: [],
  selected: undefined,
  id: 1,
  init() {
  },
  buildData(count = 1000) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++) {
      var row = {
        identifier: this.id++,
        label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
      };
      data.push(row);
    }
    return data;
  },
  updateData(mod = 10) {
    var data = this.data.map(function(data, i) {
      if (i%mod === 0) {
        return Object.assign({}, data, {label: data.label + '.'});
      } else {
        return data;
      }
    });
    return data;
  },
  remove(id) {
    startMeasure("delete");
    const idx = this.data.findIndex(d => d.identifier===id);
    //console.log("delete idx ",idx);
    this.set('data', this.data.filter((e,i) => i!==idx));
    this.set('selected', undefined);
    stopMeasure();
  },
  run() {
    startMeasure("run");
    this.set('data', this.buildData());
    this.set('selected', undefined);
    stopMeasure();
  },
  add() {
    startMeasure("add");
    var newData = this.data.concat(this.buildData(10));
    this.set('data', newData);
    this.set('selected', undefined);
    stopMeasure();
  },
  update() {
    startMeasure("update");
    this.set('data', this.updateData());
    this.set('selected', undefined);
    stopMeasure();
  },
  select(id) {
    startMeasure("select");
    //console.log("select", id);
    this.set('selected', id);
    stopMeasure();
  }
});
