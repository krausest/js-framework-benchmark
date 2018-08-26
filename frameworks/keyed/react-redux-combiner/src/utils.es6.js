'use strict';
const _random = (max) => {
    return Math.round(Math.random() * 1000) % max;
}

let id = 1

export const buildData = (count = 1000) => {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++)
        data.push({ id: id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return data;
}

export const add = (data) => {
    const newData = buildData(1000);

    return [...data, ...newData];
}
export const run = () => {
    return buildData();
}
export const runLots = () => {
    return buildData(10000);
}

export const swapRows = (data) => {
    const newData = [...data];
    if (newData.length > 998) {
        let temp = newData[1];
        newData[1] = newData[998];
        newData[998] = temp;
    }
    return newData;
}
export const deleteRow = (data, id) => {
    return data.filter(d => {
        return d.id != id
    });
}

export const every10th = function (data) {

  let i = 0

  return {
    [Symbol.iterator]: function () {
      return {
        next () {
          if (i < data.length) {
            const v = i
            i+=10
            return { done: false, value: v };
          } else {
            return { done: true };
          }
        }
      }
    }
  }
}
