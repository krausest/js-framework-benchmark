import Component from '@ember/component';
import { action } from '@ember-decorators/object';

import {
  run, runLots, add, update, swapRows, deleteRow,
} from 'ember-temp/utils/benchmark-helpers';

var startTime;
var lastMeasure;

function startMeasure(name) {
    startTime = performance.now();
    lastMeasure = name;
}
function stopMeasure() {
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
    stopMeasure();
  }

  @action async create() {
    startMeasure('run');

    const result = run(this.id);

    this.setProperties({
      data: result.data,
      id: result.id,
      selected: undefined
    });
  }

  @action async add() {
    startMeasure('add');

    this.set('data', add(this.id, this.data).data);
  }

  @action async update() {
    startMeasure('update');

    this.set('data', update(this.data));
  }

  @action async runLots() {
    startMeasure('runLots');

    const result = runLots(this.id);

    this.setProperties({
      data: result.data,
      id: result.id,
      selected: undefined
    });
  }

  @action async clear() {
    startMeasure('clear');

    this.setProperties({
      data: [],
      selected: undefined
    });
  }

  @action async swapRows() {
    startMeasure('swapRows');

    this.set('data', swapRows(this.data));
  }

  @action async remove(id) {
    startMeasure('delete');

    this.setProperties({
      data: deleteRow(this.data, id),
      selelcted: undefined
    });
  }

  @action select(id) {
    startMeasure('select');

    this.set('selected', id);
  }
}
