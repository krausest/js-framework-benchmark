/**
  * This data implementation should work for all
  * storbeam-using demos in js-framework-benchmark.
  *
  * There are 3 integration points with Starbeam in this file.
  * - the data (list of rows), reactive.array
  * - each row is a reactive.object, because the labels can update
  * - the selected index, a reactive value (cell)
  */
import { Cell, FormulaFn } from '@starbeam/core';
import { reactive } from '@starbeam/js';

const DATA_SIZE = 1_000;
const LOTS_OF_DATA_SIZE = 10_000;

/**
  * React doesn't support iterators
  *  - Map
  *  - Object
  *  - Set
  *
  *  ... React only supports arrays for iteration....
  *
  * so this whole object is a back-door way around adding that
  * support to React.
  *
  * And as a result... this may suffer from performance issues.
  */
class ReactCompatibleUserOrderedMap {
  constructor(dataMapFn) {
    this.dataMapFn = dataMapFn;
  }

  #data = FormulaFn(() => this.dataMapFn());
  get data() {
    return this.#data.current;
  }

  #map = FormulaFn(() => {
    let data = this.data;

    return (callback) => {
      let results = new Array();

      for (let datum of data.values()) {
        results.push(callback(datum));
      }

      return results;
    };
  });
  get map() {
    return this.#map.current;
  }
}

export class TableData {
  lastSelected = null;
  get selected() {
    return this.lastSelected;
  }
  set selected(id) {
    if (this.lastSelected) {
      this.data.get(this.lastSelected).isSelected = false;
    }
    if (id) {
      this.data.get(id).isSelected = true;
      this.lastSelected = id;
    }
  }

  /**
    * Reactive version of a native Map.
    *
    * If we used a decorator, we could intercept normal JS assignment
    * this.selected = 2; (for example, would "just work")
    * Without the decorator, we have to use Cell-specific APIs
    * for updating this value.
    *
    * Thankfully, we can fake a decorator's behavior manually by
    * defining a getter and setter.
    */
  #data = Cell(reactive.Map())
  get data() {
    return this.#data.current;
  }
  set data(newMap) {
    this.#data.set(newMap);
  }

  /**
    * Because a Map can't have its order changed (but arrays can),
    * we'll maintain order in this structure
    */
  dataArray = new ReactCompatibleUserOrderedMap(() => this.data);

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
    buildData(DATA_SIZE, this.data);
  };

  update = () => {
    // Unfortunately, we need to touch all keys, because
    // this test/bench is optimized for Arrays
    let ids = [...this.data.keys()];
    for (let i = 0; i < ids.length; i+= 10) {
      let id = ids[i];
      let item = this.data.get(id);

      item.label += ' !!!';
    }
  };

  clear = () => this.data = [];
  swapRows = () => {
    // This test is arbitrary, and I'm not sure if it's meant to test
    // any arbitrary swap -- constraints are a little fuzzy.
    // But! given any two ids, a swap can be done this way
    let itemA = this.data.get(1);
    let itemB = this.data.get(998);

    this.data.set(1, itemB);
    this.data.set(998, itemA);
  };

  select = (id) => this.selected = id;
  remove = (idToRemove) => {
    this.data.delete(idToRemove);
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
function buildData(count = DATA_SIZE, map) {
  const data = map ?? reactive.Map();

  for (let i = 0; i < count; i++) {
    let id = rowId++;

    data.set(id,
      reactive.object({
        id,
        label: adjectives[_random(adjectives.length)]
          + " "
          + colours[_random(colours.length)]
          + " "
          + nouns[_random(nouns.length)],
      })
    )
  }
  return data;
}
