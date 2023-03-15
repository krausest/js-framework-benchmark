import { component, List } from "ivi";
import { type Dispatch, useReducer } from "ivi/state";
import { htm } from "ivi/template";
import { createRoot, updateRoot } from "./root.js";
import { Entry, State, Action, ActionType } from "./types.js";

const random = (max: number) => Math.round(Math.random() * 1000) % max;
const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;
function buildData(count: number): Entry[] {
  const data = Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = { id: nextId++, label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}` };
  }
  return data;
}

const getEntryId = (entry: Entry) => entry.id;

const INITIAL_STATE: State = { data: [], selected: 0 };

function appStateReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Run:
      return { ...state, data: buildData(1000) };
    case ActionType.RunLots:
      return { ...state, data: buildData(10000) };
    case ActionType.Add:
      return { ...state, data: [...state.data, ...buildData(1000)] };
    case ActionType.Update: {
      const data = state.data.slice();
      for (let i = 0; i < data.length; i += 10) {
        const r = data[i];
        data[i] = { id: r.id, label: r.label + " !!!" };
      }
      return { ...state, data };
    }
    case ActionType.SwapRows: {
      const data = state.data.slice();
      const tmp = data[1];
      data[1] = data[998];
      data[998] = tmp;
      return { ...state, data };
    }
    case ActionType.Select: {
      return { ...state, selected: action.entry.id };
    }
    case ActionType.Remove: {
      const data = state.data.slice();
      data.splice(data.indexOf(action.entry), 1);
      return { ...state, data };
    }
    case ActionType.Clear:
      return INITIAL_STATE;
  }
}

interface RowProps {
  readonly dispatch: Dispatch<Action>;
  readonly entry: Entry;
  readonly selected: boolean;
}

const Row = component<RowProps>(() => {
  let _props: RowProps;
  const onSelect = () => { _props.dispatch({ type: ActionType.Select, entry: _props.entry }); };
  const onRemove = () => { _props.dispatch({ type: ActionType.Remove, entry: _props.entry }); };
  return (props) => (
    _props = props,
    htm`
    tr${props.selected ? "danger" : ""}
      td.col-md-1 =${props.entry.id}
      td.col-md-4
        a @click=${onSelect} =${props.entry.label}
      td.col-md-1
        a @click=${onRemove}
          span.glyphicon.glyphicon-remove :aria-hidden='true'
      td.col-md-6
    `
  );
}, (a, b) => a.entry === b.entry && a.selected === b.selected);

const Button = (text: string, id: string, onClick: () => void) => htm`-c
  div.col-sm-6.smallpad
    button.btn.btn-primary.btn-block :type='button' :id=${id} @click=${onClick}
      ${text}
`;

const App = component((c) => {
  const [state, dispatch] = useReducer(c, INITIAL_STATE, appStateReducer);

  const buttons = [
    Button("Create 1,000 rows", "run", () => { dispatch({ type: ActionType.Run }); }),
    Button("Create 10,000 rows", "runlots", () => { dispatch({ type: ActionType.RunLots }); }),
    Button("Append 1,000 rows", "add", () => { dispatch({ type: ActionType.Add }); }),
    Button("Update every 10th row", "update", () => { dispatch({ type: ActionType.Update }); }),
    Button("Clear", "clear", () => { dispatch({ type: ActionType.Clear }); }),
    Button("Swap Rows", "swaprows", () => { dispatch({ type: ActionType.SwapRows }); }),
  ];

  return () => {
    const { data, selected } = state();
    return htm`-c
    div.container
      div.jumbotron
        div.row
          div.col-md-6
            h1 'ivi'
          div.col-md-6
            div.row ${buttons}
      table.table.table-hover.table-striped.test-data
        ${data.length
        ? htm`tbody ${List(data, getEntryId, (entry) => Row({ dispatch, entry, selected: entry.id === selected }))}`
        : htm`tbody`}
      span.preloadicon.glyphicon.glyphicon-remove :aria-hidden='true'
    `;
  };
});

updateRoot(
  createRoot(document.getElementById("main")!),
  App(),
);