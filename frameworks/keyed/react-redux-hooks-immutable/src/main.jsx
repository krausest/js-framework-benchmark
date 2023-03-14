import React, { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { List, Record } from 'immutable';

const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy',
  'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza',  'mouse', 'keyboard'];

const random = max => Math.round(Math.random() * 1000) % max;

const makeItem = Record({ id: 0, label: '' });

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = makeItem({
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    });
  }
  return List(data);
}

const makeState = Record({ data: List(), selected: 0 });

const initialState = makeState({ data: List(), selected: 0 });

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case 'RUN':
      return state.set('data', buildData(1000)).set('selected', 0);
    case 'RUN_LOTS':
      return state.set('data', buildData(10000)).set('selected', 0);
    case 'ADD':
      return state.updateIn(['data'], data => data.concat(buildData(1000)));
    case 'UPDATE': {
      return state.updateIn(['data'], data =>
        data.map((item, i) =>
          i % 10 === 0 ? item.set('label', item.label + ' !!!') : item,
        ),
      );
    }
    case 'REMOVE': {
      return state.updateIn(['data'], data => data.delete(data.indexOf(action.item)));
    }
    case 'SELECT':
      return state.set('selected', action.id);
    case 'CLEAR':
      return initialState;
    case 'SWAP_ROWS': {
      return state.updateIn(['data'], data => {
        const tmp = data.get(1);
        return data.set(1, data.get(998)).set(998, tmp);
      });
    }
  }
  return state;
});

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

const Row = React.memo(({ item }) => {
  const isSelected = useSelector(state => state.selected === item.id);
  const dispatch = useDispatch();
  const select = useCallback(() => {
    dispatch({ type: 'SELECT', id: item.id });
  }, [item]);
  const remove = useCallback(() => {
    dispatch({ type: 'REMOVE', item });
  }, [item]);
  return (
    <tr className={isSelected ? 'danger' : ''}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={select}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={remove}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});

const RowList = React.memo(() => {
  const rows = useSelector(state => state.data);
  return rows.map(item => <Row key={item.id} item={item} />);
});

const Button = React.memo(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button
      type="button"
      className="btn btn-primary btn-block"
      id={id}
      onClick={cb}
    >
      {title}
    </button>
  </div>
));

const Main = () => {
  const dispatch = useDispatch();
  const run = useCallback(() => {
    dispatch({ type: 'RUN' });
  }, []);
  const runLots = useCallback(() => {
    dispatch({ type: 'RUN_LOTS' });
  }, []);
  const add = useCallback(() => {
    dispatch({ type: 'ADD' });
  }, []);
  const update = useCallback(() => {
    dispatch({ type: 'UPDATE' });
  }, []);
  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);
  const swapRows = useCallback(() => {
    dispatch({ type: 'SWAP_ROWS' });
  }, []);
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React, Redux, Hooks & Immutable </h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={run} />
              <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
              <Button id="add" title="Append 1,000 rows" cb={add} />
              <Button id="update" title="Update every 10th row" cb={update} />
              <Button id="clear" title="Clear" cb={clear} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
        <RowList />
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
};

createRoot(document.getElementById("main")).render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('main'),
);
