import { ViewContext, ViewContainer } from "@xania/view";

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
  constructor(private container: ViewContainer<DataRow>) {}

  selected?: Node;

  select = (context: ViewContext) => {
    const { selected, container } = this;
    const node = context.node;
    if (selected !== node) {
      if (selected?.parentNode) {
        container.updateAt(selected["rowIndex"], "className", () => null);
      }
      this.selected = node;
      container.updateAt(node["rowIndex"], "className", () => "danger");
    }
  };

  delete = (context: ViewContext) => {
    this.container.removeAt(context.node["rowIndex"]);
  };

  private appendRows(count: number) {
    let { counter, container } = this;
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
        className: null,
      };
    }

    container.push(data);
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
    const { container } = this;
    const length = container.length;

    for (let i = 0; i < length; i += 10) {
      container.updateAt(i, "label", (value) => value + " !!!");
    }
  };

  clear = (): void => {
    this.container.clear();
    this.selected = null;
  };

  swapRows = (): void => {
    if (this.container.length > 998) {
      this.container.swap(1, 998);
    }
  };
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
