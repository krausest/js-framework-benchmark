import Component, { tracked } from "sparkles-component";

import {
  run, runLots, add, update, swapRows, deleteRow,
} from 'ember-temp/utils/benchmark-helpers';

export default class MyTable extends Component {
  @tracked id = 1;
  @tracked data = [];
  @tracked selected = undefined;

  create() {
    const result = run(this.id);

    this.data = result.data;
    this.id = result.id;
    this.selected = undefined;
  }

  add() {
    this.data = add(this.id, this.data).data;
  }

  update() {
    this.data = update(this.data);
  }

  runLots() {
    const result = runLots(this.id);

    this.data = result.data;
    this.id = result.id;
    this.selected = undefined;
  }

  clear() {
    this.data = [];
    this.selected = undefined;
  }

  swapRows() {
    this.data = swapRows(this.data);
  }

  remove(id) {
    this.data = deleteRow(this.data, id);
    this.selected = undefined;
  }

  select(id) {
    this.selected = id;
  }
}
