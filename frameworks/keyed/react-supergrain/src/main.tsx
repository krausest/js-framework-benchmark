import { batch, createReactive } from "@supergrain/kernel";
import { For, tracked, useComputed } from "@supergrain/kernel/react";
import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

// --- Data Generation ---

let idCounter = 1;

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

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count: number): RowData[] {
  const data: RowData[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${
        colours[_random(colours.length)]
      } ${nouns[_random(nouns.length)]}`,
    };
  }
  return data;
}

// --- TypeScript Definitions ---

interface RowData {
  id: number;
  label: string;
}

interface AppState {
  data: RowData[];
  selected: number | null;
}

interface RowProps {
  item: RowData;
  onSelect: (id: number) => void;
  onRemove: (id: number) => void;
}

// --- Store ---

const store = createReactive<AppState>({
  data: [],
  selected: null,
});

const run = (count: number) => {
  store.data = buildData(count);
  store.selected = null;
};

const add = () => {
  store.data.push(...buildData(1000));
};

const update = () => {
  batch(() => {
    for (let i = 0; i < store.data.length; i += 10) {
      store.data[i].label = store.data[i].label + " !!!";
    }
  });
};

const clear = () => {
  batch(() => {
    store.data = [];
    store.selected = null;
  });
};

const swapRows = () => {
  if (store.data.length > 998) {
    batch(() => {
      const row1 = store.data[1];
      const row998 = store.data[998];
      store.data[1] = row998;
      store.data[998] = row1;
    });
  }
};

const remove = (id: number) => {
  const index = store.data.findIndex((item) => item.id === id);
  if (index !== -1) {
    store.data.splice(index, 1);
  }
};

const select = (id: number) => {
  flushSync(() => {
    store.selected = id;
  });
};

// --- React Components ---

const Button = ({ id, cb, title }: { id: string; cb: () => void; title: string }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>
      {title}
    </button>
  </div>
);

const Row = tracked(({ item, onSelect, onRemove }: RowProps) => {
  const id = item.id;
  const isSelected = useComputed(() => store.selected === id);
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => onSelect(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => onRemove(item.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});

const App = tracked(() => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const handleSelect = useCallback((id: number) => select(id), []);
  const handleRemove = useCallback((id: number) => remove(id), []);

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React + Supergrain</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={() => run(1000)} />
              <Button id="runlots" title="Create 10,000 rows" cb={() => run(10000)} />
              <Button id="add" title="Append 1,000 rows" cb={add} />
              <Button id="update" title="Update every 10th row" cb={update} />
              <Button id="clear" title="Clear" cb={clear} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody ref={tbodyRef}>
          <For each={store.data} parent={tbodyRef}>
            {(item: RowData) => (
              <Row key={item.id} item={item} onSelect={handleSelect} onRemove={handleRemove} />
            )}
          </For>
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
});

// --- React Rendering ---

const container = document.getElementById("main");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
