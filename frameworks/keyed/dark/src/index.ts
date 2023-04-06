import {
  type Atom,
  component,
  useMemo,
  Text,
  Flag,
  memo,
  VERSION,
} from "@dark-engine/core";
import {
  type SyntheticEvent as E,
  createRoot,
  button,
  table,
  tbody,
  span,
  div,
  tr,
  td,
  h1,
  a,
} from "@dark-engine/platform-browser";

import { type Item, Store } from "./store";

const flag = { [Flag.NM]: true };

type ButtonProps = {
  id: string;
  label: string;
  onClick: (e: E<MouseEvent>) => void;
};

const Button = component<ButtonProps>(({ id, label, onClick }) => {
  return div({
    class: "col-sm-6 smallpad",
    slot: button({
      id,
      type: "button",
      class: "btn btn-primary btn-block",
      onClick,
      slot: Text(label),
    }),
  });
});

type HeaderProps = {
  run: (e: E<MouseEvent>) => void;
  runLots: (e: E<MouseEvent>) => void;
  add: (e: E<MouseEvent>) => void;
  update: (e: E<MouseEvent>) => void;
  clear: (e: E<MouseEvent>) => void;
  swapRows: (e: E<MouseEvent>) => void;
};

const Header = memo(
  component<HeaderProps>(({ run, runLots, add, update, clear, swapRows }) => {
    const buttons = [
      Button({ id: "run", label: "Create 1,000 rows", onClick: run }),
      Button({ id: "runlots", label: "Create 10,000 rows", onClick: runLots }),
      Button({ id: "add", label: "Append 1,000 rows", onClick: add }),
      Button({ id: "update", label: "Update every 10th row", onClick: update }),
      Button({ id: "clear", label: "Clear", onClick: clear }),
      Button({ id: "swaprows", label: "Swap Rows", onClick: swapRows }),
    ];

    return div({
      class: "jumbotron",
      slot: div({
        class: "row",
        slot: [
          div({
            class: "col-md-6",
            slot: h1({ slot: Text(`Dark ${VERSION} keyed`) }),
          }),
          div({
            class: "col-md-6",
            slot: div({
              class: "row",
              slot: buttons,
            }),
          }),
        ],
      }),
    });
  }),
  () => false
);

type LabelProps = {
  label$: Atom<string>;
};

const Label = component<LabelProps>(({ label$ }) => Text(label$.value()));

type RowProps = {
  item: Item;
  selected$: Atom<number>;
  select: (id: number, e: E<MouseEvent>) => void;
  remove: (id: number, e: E<MouseEvent>) => void;
};

const Row = memo(
  component<RowProps>(({ item, selected$, select, remove }) => {
    const { id, label$ } = item;
    const className =
      selected$.value((p, n) => p !== n && (p === id || n === id)) === id
        ? "danger"
        : undefined;

    return tr({
      class: className,
      flag,
      slot: [
        td({ class: "col-md-1", slot: Text(id) }),
        td({
          class: "col-md-4",
          slot: a({
            onClick: [select, id],
            slot: Label({ label$ }),
          }),
        }),
        td({
          class: "col-md-1",
          slot: a({
            slot: span({
              class: "glyphicon glyphicon-remove",
              "aria-hidden": "true",
              onClick: [remove, id],
            }),
          }),
        }),
        td({ class: "col-md-6" }),
      ],
    });
  }),
  () => false
);

const App = component(() => {
  const store = useMemo(() => new Store(), []);
  const { data$, selected$ } = store.getState();

  const run = (e: E<MouseEvent>) => {
    e.stopPropagation();
    store.run();
  };

  const runLots = (e: E<MouseEvent>) => {
    e.stopPropagation();
    store.runLots();
  };

  const add = (e: E<MouseEvent>) => {
    e.stopPropagation();
    store.add();
  };

  const update = (e: E<MouseEvent>) => {
    e.stopPropagation();
    store.update();
  };

  const clear = (e: E<MouseEvent>) => {
    e.stopPropagation();
    store.clear();
  };

  const swapRows = (e: E<MouseEvent>) => {
    e.stopPropagation();
    store.swapRows();
  };

  const remove = (id: number, e: E<MouseEvent>) => {
    e.stopPropagation();
    store.remove(id);
  };

  const select = (id: number, e: E<MouseEvent>) => {
    e.stopPropagation();
    store.select(id);
  };

  return div({
    class: "container",
    slot: [
      Header({ run, runLots, add, update, clear, swapRows }),
      table({
        class: "table table-hover table-striped test-data",
        slot: tbody({
          slot: data$
            .value()
            .map((item) =>
              Row({ key: item.id, item, selected$, remove, select })
            ),
        }),
      }),
      span({
        class: "preloadicon glyphicon glyphicon-remove",
        "aria-hidden": "true",
      }),
    ],
  });
});

createRoot(document.getElementById("main")).render(App());
