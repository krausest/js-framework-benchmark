import { Observable } from "native-document";

let nextId = 1;

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "musty", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

export function buildData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const value = `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`;
    data.push({
      id: nextId++,
      label: (i % 10 === 0 ? Observable(value) : value)
    });
  }
  return data;
}

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

