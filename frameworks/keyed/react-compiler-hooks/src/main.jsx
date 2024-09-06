import { useState, memo } from "react";
import { createRoot } from "react-dom/client";
import { buildData } from "./utils";

const Button = ({ id, title, onClick }) => {
  return (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={id} onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

const Row = memo(({ isSelected, item, select, remove }) => {
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => select(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => remove(item.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );
});

const emptyArr = [];

const Main = () => {
  const [items, setItems] = useState(emptyArr);
  const [selected, setSelected] = useState(0);

  const run = () => {
    setItems(buildData(1000));
    setSelected(0);
  };

  const runLots = () => {
    setItems(buildData(10000));
    setSelected(0);
  };

  const add = () => {
    setItems((items) => items.concat(buildData(1000)));
  };

  const clear = () => {
    setItems(emptyArr);
    setSelected(0);
  };

  const update = () => {
    setItems((items) => {
      const newItems = items.slice();
      for (let i = 0; i < newItems.length; i += 10) {
        const r = newItems[i];
        newItems[i] = { id: r.id, label: r.label + " !!!" };
      }
      return newItems;
    });
  };

  const swapRows = () => {
    setItems((items) => {
      if (items.length < 999) {
        return items;
      }
      const newItems = items.slice();
      const d1 = newItems[1];
      const d998 = newItems[998];
      newItems[1] = d998;
      newItems[998] = d1;
      return newItems;
    });
  };

  const remove = (id) => {
    setItems((items) => {
      const idx = items.findIndex((item) => item.id === id);
      return items.slice(0, idx).concat(items.slice(idx + 1));
    });
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React Compiler Hooks</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" onClick={run} />
              <Button id="runlots" title="Create 10,000 rows" onClick={runLots} />
              <Button id="add" title="Append 1,000 rows" onClick={add} />
              <Button id="update" title="Update every 10th row" onClick={update} />
              <Button id="clear" title="Clear" onClick={clear} />
              <Button id="swaprows" title="Swap Rows" onClick={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          {items.map((item) => (
            <Row key={item.id} item={item} isSelected={selected === item.id} select={setSelected} remove={remove} />
          ))}
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

createRoot(document.getElementById("main")).render(<Main />);
