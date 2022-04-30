import { value, FidanValue } from "@fidanjs/runtime";

export interface BenchmarkDataRow {
  id: FidanValue<number>;
  label: FidanValue<string>;
}

let did = 1;
function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

export const buildData = count => {
  var adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy"
  ];
  var colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange"
  ];
  var nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard"
  ];
  var data = [];
  for (var i = 0; i < count; i++) {
    data.push({
      id: value(did++),
      label: value(
        adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)]
      )
    });
  }
  return data;
};
