import Component from '@ember/component';
import { action } from '@ember-decorators/object';

import {
  run, runLots, add, update, swapRows, deleteRow,
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

export default class MyTable extends Component {
  id = 1;
  data = [];
  selected = undefined;

  didUpdate() {
    // stopMeasure();
    // printDuration();
  }

  @action create() {
    startMeasure('run');

    const result = run(this.id);

    this.setProperties({
      data: result.data,
      id: result.id,
      selected: undefined
    });

    stopMeasure();
  }

  @action async add() {
    startMeasure('add');

    this.set('data', add(this.id, this.data).data);

    stopMeasure();
  }

  @action async update() {
    startMeasure('update');

    this.set('data', update(this.data));

    stopMeasure();
  }

  @action async runLots() {
    startMeasure('runLots');

    this.setProperties({
      data: runLots(this.id).data,
      selected: undefined
    });

    stopMeasure();
  }

  @action async clear() {
    startMeasure('clear');

    this.setProperties({
      data: [],
      selected: undefined
    });

    stopMeasure();
  }

  @action async swapRows() {
    startMeasure('swapRows');

    this.set('data', swapRows(this.data));

    stopMeasure();
  }

  @action async remove(identifier) {
    startMeasure('delete');

    this.setProperties({
      data: deleteRow(this.data, this.id),
      selelcted: undefined
    });

    stopMeasure();
  }

  @action async select(id) {
    startMeasure('select');

    this.set('selected', id);

    stopMeasure();
  }
}
