import { ComponentDescriptor, ElementDescriptor, createVElement, injectComponent, clock, scheduleMicrotask,
  matchesWithAncestors } from "kivi";

let startTime = 0;
let lastMeasure: string | null;

function startMeasure(name: string) {
  startTime = performance.now();
  lastMeasure = name;
}

function stopMeasure() {
  const last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function () {
      const now = performance.now();
      lastMeasure = null;
      console.log(`${last} took ${now - startTime}`);
    }, 0);
  }
}

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

const Adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
                    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable",
                    "important", "inexpensive", "cheap", "expensive", "fancy"];
const Colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const Nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza",
               "mouse", "keyboard"];

interface RowData {
  id: number;
  label: string;
  mtime: number;
}

let nextId = 1;

function buildRowData(count = 1000): RowData[] {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = ({
      id: nextId++,
      label: `${Adjectives[_random(Adjectives.length)]} ` +
             `${Colors[_random(Colors.length)]} ` +
             `${Nouns[_random(Nouns.length)]}`,
      mtime: -1,
    });
  }

  return data;
}

class Store {
  data: RowData[];
  selected: RowData | null;
  onChange: (() => void) | null;

  constructor() {
    this.data = [];
    this.selected = null;
    this.onChange = null;
  }

  invalidate() {
    this.onChange!();
  }

  delete(row: RowData) {
    this.data.splice(this.data.indexOf(row), 1);
    this.invalidate();
  }

  run() {
    this.data = buildRowData();
    this.selected = null;
    this.invalidate();
  }

  add() {
    this.data = this.data.concat(buildRowData(1000));
    this.invalidate();
  }

  update() {
    const data = this.data;
    for (let i = 0; i < data.length; i += 10) {
      const r = data[i];
      r.label += " !!!";
      r.mtime = clock();
    }

    this.invalidate();
  }

  select(row: RowData) {
    this.selected = row;
    this.invalidate();
  }

  runLots() {
    this.data = buildRowData(10000);
    this.selected = null;
    this.invalidate();
  }

  clear() {
    this.data = [];
    this.selected = null;
    this.invalidate();
  }

  swapRows() {
    if (this.data.length > 10) {
      const a = this.data[4];
      this.data[4] = this.data[9];
      this.data[9] = a;
    }
    this.invalidate();
  }
}

const store = new Store();

interface RowProps {
  data: RowData;
  selected: boolean;
}

const RowTitle = new ElementDescriptor<string>("td")
  .enableCloning()
  .className("col-md-1")
  .update((e, oldProps, newProps) => {
    if (oldProps === undefined || oldProps !== newProps) {
      e.textContent = newProps;
    }
  });

const HiddenAttrs = {"aria-hidden": "true"};

const RemoveIcon = new ElementDescriptor<void>("span")
  .enableCloning()
  .className("glyphicon glyphicon-remove")
  .attrs(HiddenAttrs);

const Row = new ComponentDescriptor<RowProps, void>()
  .enableBackRef()
  .tagName("tr")
  .newPropsReceived((c, oldProps, newProps) => {
    if (oldProps.selected !== newProps.selected || c.mtime < newProps.data.mtime) {
      c.markDirty();
    }
  })
  .update((c, props) => {
    const data = props.data;

    c.sync(c.createVRoot().className(props.selected ? "danger" : null).children([
      RowTitle.createVNode().data(data.id),
      createVElement("td").className("col-md-4").children([
        createVElement("a").child(data.label),
      ]),
      createVElement("td").className("col-md-1").children([
        createVElement("a").children([
          RemoveIcon.createVNode(),
        ]),
      ]),
      createVElement("td").className("col-md-6"),
    ]));
  });

const onRowClick = Row.createDelegatedEventHandler(".col-md-4 > a", "tr", (e, c, props) => {
  startMeasure("select");
  store.select(props.data);
});

const onRowDelete = Row.createDelegatedEventHandler(".col-md-1 > a", "tr", (e, c, props) => {
  startMeasure("delete");
  store.delete(props.data);
});

function rowClick(e: MouseEvent) {
  onRowClick(e);
  onRowDelete(e);
}

const Menu = new ComponentDescriptor()
  .enableBackRef()
  .attached((c) => {
    (c.element as HTMLElement).onclick = (e) => {
      e.stopPropagation();
      if (matchesWithAncestors(e.target as Element, "#run", c.element)) {
        startMeasure("run");
        store.run();
      } else if (matchesWithAncestors(e.target as Element, "#runlots", c.element)) {
        startMeasure("runLots");
        store.runLots();
      } else if (matchesWithAncestors(e.target as Element, "#add", c.element)) {
        startMeasure("add");
        store.add();
      } else if (matchesWithAncestors(e.target as Element, "#update", c.element)) {
        startMeasure("update");
        store.update();
      } else if (matchesWithAncestors(e.target as Element, "#clear", c.element)) {
        startMeasure("clear");
        store.clear();
      } else if (matchesWithAncestors(e.target as Element, "#swaprows", c.element)) {
        startMeasure("swapRows");
        store.swapRows();
      }
    };
  })
  .update((c) => {
    const buttonClassName = "btn btn-primary btn-block";

    c.sync(c.createVRoot().className("jumbotron").children([
      createVElement("div").className("row").children([
        createVElement("div").className("col-md-6").children([
          createVElement("h1").child("kivi v0.11.0"),
        ]),
        createVElement("div").className("col-md-6").children([
          createVElement("div").className("row").children([
            createVElement("div").className("col-sm-6 smallpad").children([
              createVElement("button").props({"id": "run", "type": "button"}).className(buttonClassName)
                .child("Create 1,000 rows"),
            ]),
            createVElement("div").className("col-sm-6 smallpad").children([
              createVElement("button").props({"id": "runlots", "type": "button"}).className(buttonClassName)
                .child("Create 10,000 rows"),
            ]),
            createVElement("div").className("col-sm-6 smallpad").children([
              createVElement("button").props({"id": "add", "type": "button"}).className(buttonClassName)
                .child("Append 1,000 rows"),
            ]),
            createVElement("div").className("col-sm-6 smallpad").children([
              createVElement("button").props({"id": "update", "type": "button"}).className(buttonClassName)
                .child("Update every 10th row"),
            ]),
            createVElement("div").className("col-sm-6 smallpad").children([
              createVElement("button").props({"id": "clear", "type": "button"}).className(buttonClassName)
                .child("Clear"),
            ]),
            createVElement("div").className("col-sm-6 smallpad").children([
              createVElement("button").props({"id": "swaprows", "type": "button"}).className(buttonClassName)
                .child("Swap Rows"),
            ]),
          ]),
        ]),
      ]),
    ]));
  });

const Table = new ComponentDescriptor<Store, void>()
  .tagName("table")
  .attached((c) => {
    (c.element as HTMLElement).onclick = rowClick;
  })
  .update((c, props) => {
    const data = props.data;
    const children = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      const r = data[i];
      children[i] = Row.createVNode({
        selected: props.selected === r,
        data: r,
      }).key(r.id);
    }

    c.sync(c.createVRoot().className("table table-hover table-striped test-data").children([
      createVElement("tbody").trackByKeyChildren(children),
    ]));
  });

const Main = new ComponentDescriptor()
  .update((c, props, state) => {
    c.sync(c.createVRoot().className("container").children([
      Menu.createImmutableVNode(),
      Table.createVNode(store),
      createVElement("span").className("preloadicon glyphicon glyphicon-remove").attrs(HiddenAttrs),
    ]));

    stopMeasure();
    scheduleMicrotask(() => {
      // Increment scheduler clock.
      // Because of the benchmark we need to force sync updates, and because of this internal clock isn't increasing.
    });
  });

const c = injectComponent(Main, document.getElementById("main")!, undefined, true);
store.onChange = function() {
  c.markDirty();
  c.update();
};
