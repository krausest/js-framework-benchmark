import { memo, useCallback } from "react";
import {
  RecoilRoot,
  atom,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from "recoil";
import { render } from "react-dom";

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]
        }`,
    };
  }

  return data;
};

const initialState = { data: [], selected: 0 };

const recoilAppState = atom({
  key: "appState",
  default: initialState,
});

const Row = memo(
  ({ selected, item }) => {
    const setAppState = useSetRecoilState(recoilAppState);

    const remove = useCallback(() => {
      return setAppState(({ data, selected }) => {
        const idx = data.findIndex((d) => d.id === item.id);

        return {
          data: [...data.slice(0, idx), ...data.slice(idx + 1)],
          selected,
        };
      });
    }, [setAppState, item]);

    const select = useCallback(
      () => setAppState(({ data }) => ({ data, selected: item.id })),
      [setAppState, item]
    );

    return (
      <tr className={selected ? "danger" : ""}>
        <td className="col-md-1">{item.id}</td>
        <td className="col-md-4">
          <a onClick={select}>{item.label}</a>
        </td>
        <td className="col-md-1">
          <a onClick={remove}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true" />
          </a>
        </td>
        <td className="col-md-6" />
      </tr>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.item === nextProps.item
);

const Button = ({ id, onClick, title }) => (
  <div className="col-sm-6 smallpad">
    <button
      type="button"
      className="btn btn-primary btn-block"
      id={id}
      onClick={onClick}
    >
      {title}
    </button>
  </div>
);

const Jumbotron = memo(
  () => {
    const setAppState = useSetRecoilState(recoilAppState);

    const run = useCallback(
      () => setAppState({ data: buildData(1000), selected: 0 }),
      [setAppState]
    );

    const runLots = useCallback(
      () => setAppState({ data: buildData(10000), selected: 0 }),
      [setAppState]
    );

    const add = useCallback(
      () =>
        setAppState(({ data, selected }) => ({
          data: data.concat(buildData(1000)),
          selected,
        })),
      [setAppState]
    );

    const update = useCallback(() => {
      setAppState(({ data, selected }) => {
        const newData = data.slice(0);

        for (let i = 0; i < newData.length; i += 10) {
          const r = newData[i];

          newData[i] = { id: r.id, label: r.label + " !!!" };
        }
        return { data: newData, selected };
      });
    }, [setAppState]);

    const clear = useCallback(() => setAppState({ data: [], selected: 0 }), [
      setAppState,
    ]);

    const swapRows = useCallback(() => {
      setAppState(({ data, selected }) =>
        data.length > 998
          ? {
            data: [
              data[0],
              data[998],
              ...data.slice(2, 998),
              data[1],
              data[999],
            ],
            selected,
          }
          : state
      );
    }, [setAppState]);

    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React Recoil keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" onClick={run} />
              <Button
                id="runlots"
                title="Create 10,000 rows"
                onClick={runLots}
              />
              <Button id="add" title="Append 1,000 rows" onClick={add} />
              <Button
                id="update"
                title="Update every 10th row"
                onClick={update}
              />
              <Button id="clear" title="Clear" onClick={clear} />
              <Button id="swaprows" title="Swap Rows" onClick={swapRows} />
            </div>
          </div>
        </div>
      </div>
    );
  },
  () => true
);

const Main = () => {
  const { data, selected } = useRecoilValue(recoilAppState);

  return (
    <div className="container">
      <Jumbotron />
      <table className="table table-hover table-striped test-data">
        <tbody>
          {data.map((item) => (
            <Row key={item.id} item={item} selected={selected === item.id} />
          ))}
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
};

const root = createRoot(document.getElementById('main'));
root.render(
  <RecoilRoot>
    <Main />
  </RecoilRoot>
); 