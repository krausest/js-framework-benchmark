export interface DataEntry {
  label: string;
  id: number;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 0;

const random = (max) => Math.round(Math.random() * 1000) % max;

export const genLabel = () => `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`;
export const genId = () => ++nextId;
export function genData(): DataEntry {
  return { label: genLabel(), id: genId() }
}


export class DataCollection {
  data: DataEntry[];

  constructor() {
    this.data = [];
  }

  createRows(n: number) {
    this.data = new Array(n);
    this.data.length = n;
    for (let i = 0; i < n; i++) {
      this.data[i] = genData();
    }
  }

  appendRows(n: number) {
    for (let i = 0; i < n; i++) {
      this.data.push(genData());
    }
  }

  mutate(mutator: (e: DataEntry) => void, increment: number = 1) {
    for (let i = 0; i < this.data.length; i += increment) {
      mutator(this.data[i]);
    }
  }

  clear() {
    this.data = [];
  }

  swap(idxA: number, idxB: number) {
    if (this.data.length > idxA && this.data.length > idxB) {
      const tmp = this.data[idxA];
      this.data[idxA] = this.data[idxB];
      this.data[idxB] = tmp;
    }
  }

  delete(id: number) {
    const removeIdx = this.data.findIndex(d => d.id === id);
    this.data.splice(removeIdx, 1);
  }
}
