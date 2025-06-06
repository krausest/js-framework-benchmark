import { butterfly } from "butterfloat";
import { filter, map, merge } from "rxjs";
import { randomLabel } from "./data.js";
class RowViewModel {
  #app;
  get app() {
    return this.#app;
  }
  #id;
  get id() {
    return this.#id;
  }
  #label;
  #setLabel;
  get label() {
    return this.#label;
  }
  #remove;
  #setRemove;
  #removed;
  get removed() {
    return this.#removed;
  }
  #selected;
  get selected() {
    return this.#selected;
  }
  constructor(app, id) {
    this.#app = app;
    this.#id = id;
    [this.#label, this.#setLabel] = butterfly(randomLabel());
    [this.#remove, this.#setRemove] = butterfly(false);
    this.#removed = merge(
      this.#remove.pipe(filter((remove) => remove)),
      this.#app.idRange.pipe(
        filter((range) => range.min > this.#id),
        map(() => true)
      )
    );
    this.#selected = this.#app.selectedId.pipe(map((id2) => id2 === this.#id));
  }
  updateLabel() {
    this.#setLabel((current) => current + " !!!");
  }
  remove() {
    this.#setRemove(true);
  }
  select() {
    this.#app.selectRow(this.#id);
  }
}
export {
  RowViewModel
};
