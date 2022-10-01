import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import {
  run, runLots, add, update, swapRows, deleteRow,
} from 'ember-temp/utils/benchmark-helpers';

export default class MyTable extends Component {
  @tracked
  id = 1;

  @tracked
  data = [];

  @tracked
  _selected = undefined;

  @service('state') state;

  get selected() {
    return this._selected;
  }
  set selected(value) {
    this.state.updateSelection(value);
    this._selected = value;
  }

  @action create() {
    const result = run(this.id);

    this.id = result.id;
    this.data = result.data;
    this.selected  = undefined;
  }

  @action add() {
    const result = add(this.id, this.data);
    this.id = result.id;
    this.data = result.data;
  }

  @action update() {
    update(this.data);
  }

  @action runLots() {
    const result = runLots(this.id);

    this.data = result.data;
    this.id = result.id;
    this.selected = undefined;
  }

  @action clear() {
    this.data = [];
    this.selected  = undefined;
  }

  @action swapRows() {
    this.data = swapRows(this.data);
  }

  @action remove({id}) {
    this.data = deleteRow(this.data, id);
    this.selected = undefined;
  }

  @action select({id}) {
    this.selected = id;
  }
}
