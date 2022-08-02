/**
  * This data implementation should work for all
  * storbeam-using demos in js-framework-benchmark.
  *
  * There are 3 integration points with Starbeam in this file.
  * - the data (list of rows), reactive.array
  * - each row is a reactive.object, because the labels can update
  * - the selected index, a reactive value (cell)
  */
import { Cell } from '@starbeam/core';
import { reactive } from '@starbeam/js';

const DATA_SIZE = 1_000;
const LOTS_OF_DATA_SIZE = 10_000;

export class TableData {
  /**
    * If we used a decorator, we could intercept normal JS assignment
    * this.selected = 2; (for example, would "just work")
    * Without the decorator, we have to use Cell-specific APIs
    * for updating this value.
    *
    * Thankfully, we can fake a decorator's behavior manually by
    * defining a getter and setter.
    */
  #selected = Cell();
  get selected() {
    return this.#selected.current;
  }
  set selected(value) {
    this.#selected.set(value);
  }

  /**
    * Reactive version of a native Array.
    * (could be handled via decorator)
    */
  #data = Cell([])
  get data() {
    return this.#data.current;
  }
  set data(newArray) {
    this.#data.set(reactive.array(newArray));
  }
  /*******************************
   * End Reactive versions of data
   * everything else in this class is as vanilla JS as you can get.
   * *****************************/

  run = () => {
    this.data = buildData(DATA_SIZE);
    this.selected = undefined;
  };

  runLots = () => {
    this.data = buildData(LOTS_OF_DATA_SIZE);
    this.selected = undefined;
  };

  add = () => {
    this.data.push(...buildData(DATA_SIZE));
  };

  update = () => {
    for (let i = 0; i < this.data.length; i+= 10) {
      this.data[i].label += ' !!!';
    }
  };

  clear = () => this.data = [];
  swapRows = () => {
    if (this.data.length > 998) {
      let second = this.data[1];
      let nearEnd = this.data[998];

      this.data[1] = nearEnd;
      this.data[998] = second;
    }
  };

  select = (id) => this.selected = id;
  remove = (idToRemove) => {
    let index = this.data.findIndex(datum => datum.id === idToRemove);

    this.data.splice(index, 1);
  };

}


/******************
  * Stolen from the svelte implementation
  * (but with formatting improvements)
  *******************/
function _random (max) { return Math.round(Math.random() * DATA_SIZE) % max; };

const adjectives = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
  "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
  "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap",
  "expensive", "fancy"
];
const colours = [
  "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white",
  "black", "orange"
];
const nouns = [
  "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich",
  "burger", "pizza", "mouse", "keyboard"
];

let rowId = 1;
function buildData(count = DATA_SIZE) {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = reactive.object({
      id: rowId++,
      label: adjectives[_random(adjectives.length)]
        + " "
        + colours[_random(colours.length)]
        + " "
        + nouns[_random(nouns.length)],
    });
  }
  return data;
}
