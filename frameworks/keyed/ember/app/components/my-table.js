import Component from '@ember/component';
import { action } from '@ember-decorators/object';

import {
  run, runLots, add, update, swapRows, deleteRow,
} from 'ember-temp/utils/benchmark-helpers';

export default class MyTable extends Component {
  id = 1;
  data = [];
  selected = undefined;

  @action create() {
    const result = run(this.id);

    this.setProperties({
      data: result.data,
      id: result.id,
      selected: undefined
    });
  }

  @action add() {
    this.set('data', add(this.id, this.data).data);
  }

  @action update() {
    this.set('data', update(this.data));
  }

  @action runLots() {
    const result = runLots(this.id);

    this.setProperties({
      data: result.data,
      id: result.id,
      selected: undefined
    });
  }

  @action clear() {
    this.setProperties({
      data: [],
      selected: undefined
    });
  }

  @action swapRows() {
    this.set('data', swapRows(this.data));
  }

  @action remove(id) {
    this.setProperties({
      data: deleteRow(this.data, id),
      selelcted: undefined
    });
  }

  @action select(id) {
    this.set('selected', id);
  }
}
