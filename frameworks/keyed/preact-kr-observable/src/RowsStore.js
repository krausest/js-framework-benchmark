import { Observable } from 'kr-observable';
import { buildData } from './data';

export class RowsStore extends Observable {
  static shallow = new Set(['rows'])
  rows = [];

  delete(e) {
    const rowIndexToDelete = this.rows.findIndex((row) => row.id === +e.target.id);
    this.rows.splice(rowIndexToDelete, 1);
  };

  run() {
    this.rows = buildData(1000);
  };

  add() {
    this.rows = this.rows.concat(buildData(1000))
  };

  update() {
    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += ' !!!';
    }
  };

  select(e) {
    this.rows.forEach(row => row.selected = row.id === +e.target.id)
  };

  runLots() {
    this.rows = buildData(10000);
  };

  clear() {
    this.rows = [];
  };

  swapRows() {
    const data = this.rows
    if (data.length > 998) {
      const item = data[1];
      data.set(1, data[998]);
      data.set(998, item)
    }
  };
}


export const rowsStore = new RowsStore()