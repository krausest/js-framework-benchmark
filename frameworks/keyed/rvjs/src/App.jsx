import { useState, For } from "@rvjs/core";

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
] // prettier-ignore
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'] // prettier-ignore
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'] // prettier-ignore

const App = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(-1);
  let rowId = 1;

  const runHandler = () => {
    setData(buildData(1000));
  };

  const runLotsHandler = () => {
    setData(buildData(10000));
  };

  const addHandler = () => {
    setData([...data(), ...buildData(1000)]);
  };

  const updateHandler = () => {
    const newData = data();
    for (let i = 0; i < newData.length; i += 10) {
      const { text, setText } = newData[i];
      setText(text() + " !!!");
    }
    setData([...newData]);
  };

  const clearHandler = () => {
    setData([]);
  };

  const swapRowsHandler = () => {
    const newData = [...data()];
    if (newData.length > 998) {
      let item = newData[1];
      newData[1] = newData[998];
      newData[998] = item;
      setData(newData);
    }
  };

  const selectOneHandler = (id) => {
    setSelected(id);
  };

  const removeOneHandler = (id) => {
    const index = data().findIndex((item) => item.id === id);
    const newData = [...data().slice(0, index), ...data().slice(index + 1)];
    setData(newData);
  };

  const random = (max) => {
    return Math.round(Math.random() * 1000) % max;
  };

  const buildData = (count) => {
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      const [text, setText] = useState(
        `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`
      );
      data[i] = { id: rowId++, text, setText };
    }
    return data;
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>@rvjs/core-v0.3.31</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-sm-6 smallpad">
                <button id="run" className="btn btn-primary btn-block" type="button" onclick={runHandler}>
                  Create 1,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button id="runlots" className="btn btn-primary btn-block" type="button" onclick={runLotsHandler}>
                  Create 10,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button id="add" className="btn btn-primary btn-block" type="button" onclick={addHandler}>
                  Append 1,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button id="update" className="btn btn-primary btn-block" type="button" onclick={updateHandler}>
                  Update every 10th row
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button id="clear" className="btn btn-primary btn-block" type="button" onclick={clearHandler}>
                  Clear
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button id="swaprows" className="btn btn-primary btn-block" type="button" onclick={swapRowsHandler}>
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          <For each={data()}>
            {({ id, text }) => {
              return (
                <tr className={selected() === id ? "danger" : ""}>
                  <td className="col-md-1" textContent={String(id)} />
                  <td className="col-md-4">
                    <a onclick={() => selectOneHandler(id)} textContent={text()} />
                  </td>
                  <td className="col-md-1">
                    <a onclick={() => removeOneHandler(id)}>
                      <span className="glyphicon glyphicon-remove" aria-hidden="true" />
                    </a>
                  </td>
                  <td className="col-md-6" />
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

export default App;
