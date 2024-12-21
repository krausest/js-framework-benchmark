import {
  type WritableAtom,
  component,
  useMemo,
  memo,
  Flag,
  VERSION,
  TagVirtualNode as Tag,
  TextVirtualNode as Text,
} from "@dark-engine/core";
import { type SyntheticEvent, createRoot } from "@dark-engine/platform-browser";

import { type Item, Store } from "./store";

type Event = SyntheticEvent<MouseEvent>;

const shouldUpdate = () => false;
const stop = (e: Event) => (e.stopPropagation(), true);

type ButtonProps = {
  id: string;
  label: string;
  onClick: (e: Event) => void;
};

const Button = component<ButtonProps>(({ id, label, onClick }) => {
  return (
    <div class="col-sm-6 smallpad">
      <button id={id} type="button" class="btn btn-primary btn-block" onClick={onClick}>
        {label}
      </button>
    </div>
  );
});

type HeaderProps = {
  run: (e: Event) => void;
  runLots: (e: Event) => void;
  add: (e: Event) => void;
  update: (e: Event) => void;
  clear: (e: Event) => void;
  swapRows: (e: Event) => void;
};

const Header = memo(
  component<HeaderProps>(({ run, runLots, add, update, clear, swapRows }) => {
    return (
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Dark {VERSION} keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" label="Create 1,000 rows" onClick={run} />
              <Button id="runlots" label="Create 10,000 rows" onClick={runLots} />
              <Button id="add" label="Append 1,000 rows" onClick={add} />
              <Button id="update" label="Update every 10th row" onClick={update} />
              <Button id="clear" label="Clear" onClick={clear} />
              <Button id="swaprows" label="Swap Rows" onClick={swapRows} />
            </div>
          </div>
        </div>
      </div>
    );
  }),
  shouldUpdate
);

const Label = component<{ label$: WritableAtom<string> }>(({ label$ }) => new Text(label$.val()));

type RowProps = {
  item: Item;
  selected$: WritableAtom<number>;
  select: (id: number, e: Event) => void;
  remove: (id: number, e: Event) => void;
};

const Row = memo(
  component<RowProps>(({ item, selected$, select, remove }) => {
    const { id, label$ } = item;
    const className = selected$.val(null, id) === id ? "danger" : undefined;
    const attrs = {
      class: "glyphicon glyphicon-remove",
      onClick: [remove, id],
      "aria-hidden": "true",
    };

    return new Tag("tr", { class: className, [Flag.STATIC_SLOT_OPT]: true }, [
      new Tag("td", { class: "col-md-1" }, [new Text(id)]),
      new Tag("td", { class: "col-md-4" }, [new Tag("a", { onClick: [select, id] }, [Label({ label$ })])]),
      new Tag("td", { class: "col-md-1" }, [new Tag("a", {}, [new Tag("span", attrs, [])])]),
      new Tag("td", { class: "col-md-6" }, []),
    ]);
  }),
  shouldUpdate
);

const App = component(() => {
  const store = useMemo(() => new Store(), []);
  const { data$, selected$ } = store.getState();
  const items = data$.val();
  const run = (e: Event) => stop(e) && store.run();
  const runLots = (e: Event) => stop(e) && store.runLots();
  const add = (e: Event) => stop(e) && store.add();
  const update = (e: Event) => stop(e) && store.update();
  const clear = (e: Event) => stop(e) && store.clear();
  const swapRows = (e: Event) => stop(e) && store.swapRows();
  const remove = (id: number, e: Event) => stop(e) && store.remove(id);
  const select = (id: number, e: Event) => stop(e) && store.select(id);
  const rows = items.map((item) => Row({ key: item.id, item, selected$, remove, select }));
  const content = new Tag("tbody", { key: items.length > 0 ? 1 : 2, [Flag.MEMO_SLOT_OPT]: true }, rows);

  return (
    <div class="container">
      <Header run={run} runLots={runLots} add={add} update={update} clear={clear} swapRows={swapRows} />
      <table class="table table-hover table-striped test-data">{content}</table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
});

createRoot(document.getElementById("main")).render(<App />);
