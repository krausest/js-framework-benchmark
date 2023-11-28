import { setData, createApp, registerComponent } from "strve-js";
import { buildData } from "./data.js";

const TbodyComponentName = registerComponent("TbodyComponentName");
let selected;
let rows = [];

function setRows(update = rows.slice()) {
  setData(() => {
    rows = update;
  }, [TbodyComponentName, TbodyComponent]);
}

function add() {
  const data = rows.concat(buildData(1000));
  setData(() => {
    rows = data;
  }, [TbodyComponentName, TbodyComponent]);
}

function remove(id) {
  rows.splice(
    rows.findIndex((d) => d.id === id),
    1
  );
  setRows();
}

function select(id) {
  setData(() => {
    selected = id;
  }, [TbodyComponentName, TbodyComponent]);
}

function run() {
  setRows(buildData());
  selected = undefined;
}

function update() {
  for (let i = 0; i < rows.length; i += 10) {
    rows[i].label += " !!!";
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
  if (rows.length > 998) {
    const d1 = rows[1];
    const d998 = rows[998];
    rows[1] = d998;
    rows[998] = d1;
    setRows();
  }
}

function TbodyComponent() {
  return (
    <tbody
      onClick={(event) => {
        const el = event.target;
        const id = Number(el.closest("tr").firstChild.textContent);
        if (el.matches(".glyphicon-remove")) {
          remove(id);
        } else {
          select(id);
        }
        return false;
      }}
    >
      {rows.map((item) => (
        <tr class={item.id === selected ? "danger" : ""} key={item.id}>
          <td class="col-md-1">{item.id}</td>
          <td class="col-md-4">
            <a>{item.label}</a>
          </td>
          <td class="col-md-1">
            <a>
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
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
    <fragment>
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Strve-keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="run" onClick={run}>
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="runlots" onClick={runLots}>
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="add" onClick={add}>
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="update" onClick={update}>
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="clear" onClick={clear}>
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="swaprows" onClick={swapRows}>
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <component $name={TbodyComponentName}>{TbodyComponent()}</component>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </fragment>
  );
}

createApp(() => MainBody()).mount("#main");
