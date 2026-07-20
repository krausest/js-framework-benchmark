/**
 *
 * https://github.com/emberjs/rfcs/pull/1071
 *
 */
import { consumeTag, createUpdatableTag, dirtyTag } from '@glimmer/validator';

export function cell(initial) {
  return new Cell(initial);
}

class Cell {
  #value;
  #tag;

  constructor(value) {
    this.#value = value;
    this.#tag = createUpdatableTag();
  }

  get current() {
    consumeTag(this.#tag);

    return this.#value;
  }

  read() {
    consumeTag(this.#tag);

    return this.#value;
  }

  set(value) {
    if (this.#value === value) {
      return false;
    }

    this.#value = value;

    dirtyTag(this.#tag);

    return true;
  }

  update(updater) {
    this.set(updater(this.#value));
  }
}
