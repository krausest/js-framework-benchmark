import { signal } from "signal-jsx/dist";
import type { Props } from "./Row";

const adjectives = [
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
  "fancy",
];

const colours = [
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
  "orange",
];

const nouns = [
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
  "keyboard",
];

const random = (len: number) => Math.round(Math.random() * 1000) % len;

let ID = 1;

export function buildData(num: number) {
  const data = new Array<Props>(num);

  for (let i = 0; i < num; i++) {
    data[i] = {
      id: ID++,
      selected: signal(""),
      label: signal(
        `${adjectives[random(adjectives.length)]} ${
          colours[random(colours.length)]
        } ${nouns[random(nouns.length)]}`
      ),
    };
  }

  return data;
}
