import { memo, useReducer } from 'hono/jsx'
import { render } from 'hono/jsx/dom';

const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

type Data = {
  id: number,
  label: string
}

function buildData(count: number): Data[] {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
}

type State = {
  data: Data[],
  selected: number
}

const initialState: State = { data: [], selected: 0 };

function listReducer(state: State, action: { type: string; id?: number; }): State {
  const { data, selected } = state;

  switch (action.type) {
    case 'RUN':
      return { data: buildData(1000), selected: 0 };
    case 'RUN_LOTS':
      return { data: buildData(10000), selected: 0 };
    case 'ADD':
      return { data: data.concat(buildData(1000)), selected };
    case 'UPDATE': {
      const newData = data.slice(0);

      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];

        newData[i] = { id: r.id, label: `${r.label} !!!` };
      }

      return { data: newData, selected };
    }
    case 'CLEAR':
      return { data: [], selected: 0 };
    case 'SWAP_ROWS': {
      const newdata = [...data];
      if (data.length > 998) {
        const d1 = newdata[1];
        const d998 = newdata[998];
        newdata[1] = d998;
        newdata[998] = d1;
      }
      return { data: newdata, selected };
    }
    case 'REMOVE': {
      const idx = data.findIndex((d) => d.id === action.id);

      return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
    }
    case 'SELECT':
      return { data, selected: action.id || 0 };
    default:
      return state;
  }
}

const Row = memo(({ selected, item, dispatch }: {
  selected: boolean,
  item: Data,
  dispatch: (action: { type: string; id: number; }) => void
}) => (
    <tr class={selected ? "danger" : ""}>
      <td class="col-md-1">{item.id}</td>
      <td class="col-md-4">
        <a onClick={() => dispatch({ type: 'SELECT', id: item.id })}>{item.label}</a>
      </td>
      <td class="col-md-1">
        <a onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td class="col-md-6" />
    </tr>
), (prevProps, nextProps) => prevProps.selected === nextProps.selected && prevProps.item === nextProps.item)

const Button = ({ id, onClick, title }: {
  id: string,
  onClick: () => void,
  title: string
}) => (
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn-block btn btn-primary" id={id} onClick={onClick}>{title}</button>
  </div>
);

const Jumbotron = memo(({ dispatch }: {
  dispatch: (action: { type: string }) => void
}) => (
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Hono</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="run" title="Create 1,000 rows" onClick={() => dispatch({ type: 'RUN' })} />
            <Button id="runlots" title="Create 10,000 rows" onClick={() => dispatch({ type: 'RUN_LOTS' })} />
            <Button id="add" title="Append 1,000 rows" onClick={() => dispatch({ type: 'ADD' })} />
            <Button id="update" title="Update every 10th row" onClick={() => dispatch({ type: 'UPDATE' })} />
            <Button id="clear" title="Clear" onClick={() => dispatch({ type: 'CLEAR' })} />
            <Button id="swaprows" title="Swap Rows" onClick={() => dispatch({ type: 'SWAP_ROWS' })} />
          </div>
        </div>
      </div>
    </div>
), () => true);

const App = () => {
  const [{ data, selected }, dispatch] = useReducer(listReducer, initialState);

  return (<div class="container">
    <Jumbotron dispatch={dispatch} />
    <table class="table table-hover table-striped test-data">
      <tbody>
        {data.map(item => {
          // @ts-ignore
          return <Row key={item.id} item={item} selected={selected === item.id} dispatch={dispatch} />;
        })}
      </tbody>
    </table>
    <span class="glyphicon glyphicon-remove preloadicon" aria-hidden="true" />
  </div>);
}

render(<App />, document.getElementById('root')!);
