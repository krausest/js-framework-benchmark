import { createApp, setData } from "strve-js";
import { buildData } from "./data.js";

let selected = undefined;
let rows = [];

function setRows(update = rows.slice()) {
  setData(
    () => {
      rows = update;
    },
    {
      name: TbodyComponent,
    }
  );
}

function add() {
  const data = rows.concat(buildData(1000));
  setData(
    () => {
      rows = data;
    },
    {
      name: TbodyComponent,
    }
  );
}

function remove(id) {
  rows.splice(
    rows.findIndex((d) => d.id === id),
    1
  );
  setRows();
}

function select(id) {
  setData(
    () => {
      selected = id;
    },
    {
      name: TbodyComponent,
    }
  );
}

function run() {
  setRows(buildData());
  selected = undefined;
}

function update() {
  const _rows = rows;
  for (let i = 0; i < _rows.length; i += 10) {
    _rows[i].label += " !!!";
  }
  setRows();
}

function runLots() {
  setRows(buildData(10000));
  selected = undefined;
}

function clear() {
  setRows([]);
  selected = undefined;
}

function swapRows() {
  let _rows = rows;
  if (_rows.length > 998) {
    const d1 = _rows[1];
    const d998 = _rows[998];
    _rows[1] = d998;
    _rows[998] = d1;
    setRows();
  }
}

function TbodyComponent() {
  return (
    <tbody $key>
      {rows.map((item) => (
        <tr
          class={item.id == selected ? "danger" : ""}
          data-label={item.label}
          $key
        >
          <td class="col-md-1" $key>
            {item.id}
          </td>
          <td class="col-md-4">
            <a onClick={() => select(item.id)} $key>
              {item.label}
            </a>
          </td>
          <td class="col-md-1">
            <a onClick={() => remove(item.id)} $key>
              <span
                class="glyphicon glyphicon-remove"
                aria-hidden="true"
              ></span>
            </a>
          </td>
          <td class="col-md-6"></td>
        </tr>
      ))}
    </tbody>
  );
}

function MainBody() {
  return (
    <>
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Strve-non-keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="run"
                  onClick={run}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="runlots"
                  onClick={runLots}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="add"
                  onClick={add}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="update"
                  onClick={update}
                >
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="clear"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="swaprows"
                  onClick={swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <component $name={TbodyComponent.name}>{TbodyComponent()}</component>
      </table>
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </>
  );
}

createApp(() => MainBody()).mount("#main");
