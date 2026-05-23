import Service from '@ember/service';
import { trackedArray } from '@ember/reactive/collections';

import { run, runLots, add, update, swapRows, deleteRow } from '#utils';

export default class State extends Service {
  data = trackedArray();
  id = 1;
  _selectedRow = null;

  create = () => {
    let id = this.id;
    const result = run(id);

    this.id = result.id;
    this.data.length = 0;

    this.data.push(...result.data);
    this._selectedRow = null;
  };

  add = () => {
    let result = add(this.id);
    this.data.push(...result.data);
    this.id = result.id;
  };

  update = () => {
    update(this.data);
  };

  runLots = () => {
    const result = runLots(this.id);

    this.data.length = 0;
    this.data.push(...result.data);
    this.id = result.id;
    this._selectedRow = null;
  };

  clear = () => {
    this.data.length = 0;
    this._selectedRow = null;
  };

  swapRows = () => {
    swapRows(this.data);
  };

  remove = (id) => {
    let idx = this.data.findIndex((d) => d.id === id);
    this.data.splice(idx, 1);
  };

  select = (id) => {
    if (this._selectedRow) {
      this._selectedRow.selected.set(false);
    }
    const row = this.data.find((d) => d.id === id);
    if (row) {
      row.selected.set(true);
      this._selectedRow = row;
    }
  };
}
