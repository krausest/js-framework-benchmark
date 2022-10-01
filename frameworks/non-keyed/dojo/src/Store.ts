import { create, invalidator } from "@dojo/framework/core/vdom";

function random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

export interface Item {
  id: number;
  label: string;
}

export interface Data {
  [index: string]: Item;
}

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
  "fancy"
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
  "orange"
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
  "keyboard"
];

const factory = create({ invalidator });

let id = 1;
let idx = 0;
let data: Data = {};
let ids = new Set<number>();
let selected: number | undefined;
let invalidatorMap = new Map<number | string, Function>();
let appInvalidator: Function;

function buildData(count: number = 1000): { data: Data; ids: Set<number> } {
  const data: Data = {};
  const ids = new Set<number>();
  for (let i = 0; i < count; i++) {
    const adjective = adjectives[random(adjectives.length)];
    const colour = colours[random(colours.length)];
    const noun = nouns[random(nouns.length)];
    const label = `${adjective} ${colour} ${noun}`;
    data[idx] = { id, label };
    ids.add(idx);
    id++;
    idx++;
  }
  return { data, ids };
}

export default factory(({ properties, middleware: { invalidator } }) => {
  const { key: widgetKey = "app" } = properties();
  if (widgetKey === "app") {
    appInvalidator = invalidator;
  } else {
    invalidatorMap.set(widgetKey, invalidator);
  }

  function invalidate(id: string | number = "app") {
    if (id === "app") {
      appInvalidator();
    } else if (invalidatorMap.has(id)) {
      invalidatorMap.get(id)!();
    }
  }

  return {
    get ids(): number[] {
      return Array.from(ids);
    },
    getItem(id: string | number = widgetKey): Item | undefined {
      return data[id];
    },
    get selected(): number | undefined {
      return selected;
    },
    del: () => {
      if (typeof widgetKey === "number") {
        ids.delete(widgetKey);
        delete data[widgetKey];
        invalidate();
      }
    },
    run: () => {
      idx = 0;
      const builtData = buildData();
      ids = builtData.ids;
      data = builtData.data;
      selected = undefined;
      invalidate();
    },
    add: () => {
      const builtData = buildData();
      data = { ...data, ...builtData.data };
      ids = new Set([...Array.from(ids), ...Array.from(builtData.ids)]);
      invalidate();
    },
    update: () => {
      const idArray = Array.from(ids);
      for (let i = 0; i < idArray.length; i += 10) {
        const itemId = idArray[i];
        const item = data[itemId];
        data[itemId] = { ...item, label: `${item.label} !!!` };
      }
      invalidate();
    },
    select: () => {
      if (typeof widgetKey === "number") {
        selected && invalidate(selected);
        selected = widgetKey;
        invalidate(widgetKey);
      }
    },
    runLots: () => {
      idx = 0;
      const builtData = buildData(10000);
      ids = builtData.ids;
      data = builtData.data;
      selected = undefined;
      invalidate();
    },
    clear: () => {
      idx = 0;
      data = {};
      ids.clear();
      selected = undefined;
      invalidate();
      invalidatorMap.clear();
    },
    swapRows: () => {
      const idArray = Array.from(ids);
      if (idArray.length > 998) {
        const second = idArray[1];
        const last = idArray[998];
        const row = data[second];
        data[second] = data[last];
        data[last] = row;
        selected = selected === 1 ? 998 : selected === 998 ? 1 : selected;
      }
      ids = new Set(idArray);
      invalidate();
    }
  };
});
