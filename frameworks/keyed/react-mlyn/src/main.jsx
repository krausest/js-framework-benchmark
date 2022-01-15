import { batch, createSubject } from "mlyn";
import React, { Component } from "react";
import { render } from "react-dom";
import { For, useMemoize, useSubjectValue } from "react-mlyn";

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = [
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
const C = [
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
const N = [
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

let nextId = 1;

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }

  return data;
};

const initialState = { data: [], selected: 0 };

class Button extends Component {
  render() {
    const { id, cb, title } = this.props;

    return (
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
    );
  }
}

class Jumbotron extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { dispatch } = this.props;

    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React mlyn keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button
                id="run"
                title="Create 1,000 rows"
                cb={() => dispatch({ type: "RUN" })}
              />
              <Button
                id="runlots"
                title="Create 10,000 rows"
                cb={() => dispatch({ type: "RUN_LOTS" })}
              />
              <Button
                id="add"
                title="Append 1,000 rows"
                cb={() => dispatch({ type: "ADD" })}
              />
              <Button
                id="update"
                title="Update every 10th row"
                cb={() => dispatch({ type: "UPDATE" })}
              />
              <Button
                id="clear"
                title="Clear"
                cb={() => dispatch({ type: "CLEAR" })}
              />
              <Button
                id="swaprows"
                title="Swap Rows"
                cb={() => dispatch({ type: "SWAP_ROWS" })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const state$ = createSubject(initialState);

const Main = () => {
  const dispatch = (action) => {
    if (action.type === "SELECT") {
      state$.selected(action.id);
    }

    const data = state$.data();

    switch (action.type) {
      case "RUN":
        return state$({ data: buildData(1000), selected: 0 });
      case "RUN_LOTS":
        return state$({ data: buildData(10000), selected: 0 });
      case "ADD":
        return state$.data(data.concat(buildData(1000)));
      case "UPDATE": {
        batch(() => {
          const newData = data.concat();
          for (let i = 0; i < data.length; i += 10) {
            newData[i] = { ...data[i], label: data[i].label + " !!!" };
          }
          state$.data(newData);
        });
        return;
      }
      case "CLEAR":
        return state$({ data: [], selected: 0 });
      case "SWAP_ROWS": {
        if (data.length > 998) {
          const a = data[1];
          const b = data[998];
          batch(() => {
            state$.data[1](b);
            state$.data[998](a);
          });
        }

        return;
      }
      case "REMOVE": {
        const idx = data.findIndex((d) => d.id === action.id);

        return state$.data([...data.slice(0, idx), ...data.slice(idx + 1)]);
      }
    }
  };

  const { data } = state$;

  const onSelect = (id$) => {
    dispatch({ type: "SELECT", id: id$() });
  };

  const onRemove = (id$) => {
    dispatch({ type: "REMOVE", id: id$() });
  };

  return (
    <div className="container">
      <Jumbotron dispatch={dispatch} />
      <table className="table table-hover table-striped test-data">
        <tbody>
          <For each={data} noBindBack>
            {(item$) => {
              const selected$ = useMemoize(() => item$.id() === state$.selected());
              const selected = useSubjectValue(selected$);
              const item = useSubjectValue(item$);
              return (
                <tr className={selected ? "danger" : ""}>
                  <td pid="id" className="col-md-1">
                    {item.id}
                  </td>
                  <td className="col-md-4">
                    <a onClick={() => onSelect(item$.id)}>{item.label}</a>
                  </td>
                  <td className="col-md-1">
                    <a onClick={() => onRemove(item$.id)}>
                      <span
                        className="glyphicon glyphicon-remove"
                        aria-hidden="true"
                      />
                    </a>
                  </td>
                  <td className="col-md-6" />
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
};

render(<Main />, document.getElementById("main"));
