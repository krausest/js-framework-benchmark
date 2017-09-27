'use strict';

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

function random (max) {
  return Math.round(Math.random() * max);
}

function randomItem (arr) {
  return arr[random(arr.length)];
}

export class Store {
  constructor () {
    this.data = [];
    this.selected = null;
    this.id = 1;
  }
  buildData (count = 1000) {
    const data = new Array(count);

    for (let i = 0; i < count; i++) {
      data[i] = {
        id: this.id++,
        label: randomItem(adjectives) + ' ' + randomItem(colours) + ' ' + randomItem(nouns)
      };
    }

    return data;
  }
  updateData (mod = 10) {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += ' !!!';
    }
  }
  delete (id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id === id) {
        this.data.splice(i--, 1);
      }
    }
    return this;
  }
  run () {
    this.data = this.buildData();
    this.selected = null;
  }
  add () {
    this.data = this.data.concat(this.buildData(1000));
  }
  update () {
    this.updateData();
  }
  select (id) {
    this.selected = id;
  }
  hideAll () {
    this.backup = this.data;
    this.data = [];
    this.selected = null;
  }
  showAll () {
    this.data = this.backup;
    this.backup = null;
    this.selected = null;
  }
  runLots () {
    this.data = this.buildData(10000);
    this.selected = null;
  }
  clear () {
    this.data = [];
    this.selected = null;
  }
  swapRows () {
    if (this.data.length > 10) {
      const a = this.data[4];
      this.data[4] = this.data[9];
      this.data[9] = a;
    }
  }
}
