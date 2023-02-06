import {
  Context,
  ListSource,
  ListMutationType,
  State,
  useState,
} from "@xania/view";

export interface DataRow {
  id: number;
  label: string;
  className?: string;
}

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
  "fancy",
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
  "orange",
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
  "keyboard",
];

export class TableStore {
  private counter = 1;
  public source: ListSource<DataRow> = new ListSource<DataRow>();

  readonly delete = (e: JSX.EventContext<DataRow>) =>
    this.source.delete(e.data);

  private appendRows(count: number) {
    let { counter } = this;

    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = {
        id: counter++,
        label:
          adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)],
      };
    }
    this.source.append(data);
    this.counter = counter;
  }

  create1000Rows = (): void => {
    this.clear();
    this.appendRows(1000);
  };
  create10000Rows = (): void => {
    this.clear();
    this.appendRows(10000);
  };
  append1000Rows = (): void => {
    this.appendRows(1000);
  };

  updateEvery10thRow = (): void => {
    this.source.update((data) => {
      const updated = [];
      for (let i = 0; i < data.length; i += 10) {
        const item = data[i];
        data[i].label += " !!!";
        updated.push(item);
      }
      return updated;
    });
  };
  clear = (): void => {
    this.source.clear();
  };
  swapRows = (): void => {
    const { source } = this;
    if (source.length > 998) {
      source.move(1, 998);
      source.move(998, 1);
    }
  };
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
