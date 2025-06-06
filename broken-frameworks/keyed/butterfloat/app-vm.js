import { butterfly } from "butterfloat";
import { filter, map, mergeMap, range } from "rxjs";
import { RowViewModel } from "./row-vm.js";
class AppViewModel {
  #idRange;
  #setIdRange;
  get idRange() {
    return this.#idRange;
  }
  #selectedId;
  #setSelectedId;
  get selectedId() {
    return this.#selectedId;
  }
  #rows;
  get rows() {
    return this.#rows;
  }
  #rowsToUpdate;
  #setRowsToUpdate;
  get rowsToUpdate() {
    return this.#rowsToUpdate;
  }
  constructor() {
    ;
    [this.#idRange, this.#setIdRange] = butterfly({
      min: 0,
      max: 0,
      added: [-1, -1]
    });
    [this.#selectedId, this.#setSelectedId] = butterfly(-1);
    [this.#rowsToUpdate, this.#setRowsToUpdate] = butterfly(-1);
    this.#rows = this.#idRange.pipe(
      filter((idRange) => idRange.added[1] > 0),
      mergeMap((idRange) => range(idRange.added[0], idRange.added[1])),
      map((id) => new RowViewModel(this, id))
    );
  }
  clear() {
    this.#setIdRange((current) => ({
      min: current.max,
      max: current.max,
      added: [-1, -1]
    }));
  }
  selectRow(id) {
    this.#setSelectedId(id);
  }
  createRows(count) {
    this.#setIdRange((current) => {
      const min = current.max;
      const max = current.max + count;
      return { min, max, added: [current.max, count] };
    });
  }
  appendRows(count) {
    this.#setIdRange((current) => {
      const min = current.min;
      const max = current.max + count;
      return { min, max, added: [current.max, count] };
    });
  }
  updateRow(id) {
    this.#setRowsToUpdate(id);
  }
}
export {
  AppViewModel
};
