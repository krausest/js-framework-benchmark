import { atom, PrimitiveAtom } from "jotai";

function random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;

export interface Data {
  id: number;
  label: string;
}

export function buildNextItem(): Data {
  return {
    id: nextId++,
    label: `${A[random(A.length)]} ${C[random(C.length)]} ${
      N[random(N.length)]
    }`,
  };
}

export function buildDataAtoms(count: number): PrimitiveAtom<Data>[] {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = atom(buildNextItem());
  }
  return data;
}
