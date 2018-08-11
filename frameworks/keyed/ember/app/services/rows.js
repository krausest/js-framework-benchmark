import Service from '@ember/service';


import {
  run, runLots, add, update, swapRows, deleteRow
} from 'ember-temp/utils/benchmark-helpers';

var startTime;
var lastMeasure;
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

export default Service.extend({
  data: [],
  selected: undefined,
  id: 1,

  remove(id) {
    startMeasure('delete');

    this.setProperties({
      data: deleteRow(this.data, this.id),
      selelcted: undefined
    });

    stopMeasure();
  },

  run() {
    startMeasure('run');

    this.setProperties({
      data: run(this.id).data,
      selected: undefined
    });

    stopMeasure();
  },

  add() {
    startMeasure('add');

    this.set('data', add(this.id, this.data).data);

    stopMeasure();
  },

  update() {
    startMeasure('update');

    this.set('data', update(this.data));

    stopMeasure();
  },

  select(id) {
    startMeasure('select');

    this.set('selected', id);

    stopMeasure();
  },

  runLots() {
    startMeasure('runLots');

    this.setProperties({
      data: runLots(this.id).data,
      selected: undefined
    });

    stopMeasure();
  },

  clear() {
    startMeasure('clear');

    this.setProperties({
      data: [],
      selected: undefined
    });

    stopMeasure();
  },

  swapRows() {
    startMeasure('swapRows');

    this.set('data', swapRows(this.data));

    stopMeasure();
  }
});
