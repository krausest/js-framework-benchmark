import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from "@angular/core";

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

interface Data {
  id: number;
  label: string;
}

@Component({
    selector: "app-root",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgFor],
    templateUrl: "./app.component.html"
})
export class AppComponent {
  data = signal<Array<Data>>([]);
  selected = signal<number | undefined | null>(undefined);
  id: number = 1;

  #random(max: number) {
    return Math.round(Math.random() * 1000) % max;
  }

  buildData(count: number) {
    const data: Data[] = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = {
        id: this.id++,
        label: `${adjectives[this.#random(adjectives.length)]} ${
          colours[this.#random(colours.length)]
        } ${nouns[this.#random(nouns.length)]}`,
      };
    }
    return data;
  }

  run() {
    this.data.set(this.buildData(1000));
    this.selected.set(null);
  }

  runLots() {
    this.data.set(this.buildData(10000));
    this.selected.set(null);
  }

  add() {
    this.data.update((data) => [...data, ...this.buildData(1000)]);
  }

  update() {
    this.data.update((data) => {
      for (let i = 0; i < data.length; i += 10) {
        const item = data[i];
        data[i] = { ...item, label: item.label + " !!!" };
      }
      return data;
    });
  }

  clear() {
    this.data.set([]);
    this.selected.set(null);
  }

  swapRows() {
    const tmp = this.data();
    if (tmp.length > 998) {
      const a = tmp[1];
      tmp[1] = tmp[998];
      tmp[998] = a;
      this.data.set(tmp);
    }
  }

  itemById(index: number, item: Data) {
    return item.id;
  }

  delete(id: number) {
    this.data.update((d) => {
      const idx = d.findIndex((d) => d.id === id);
      return [...d.slice(0, idx), ...d.slice(idx + 1)];
    });
  }
}
