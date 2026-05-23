import { For, shallowRef } from "vitarx";
import { buildData } from "./data";

export default function App() {
  // benchmark 数据池
  const rows = shallowRef([]);
  const selected = shallowRef(null);

  function setRows(update = rows.value.slice()) {
    rows.value = update;
  }

  function add() {
    rows.value.push(...buildData(1000));
    setRows();
  }

  function remove(id) {
    rows.value.splice(
      rows.value.findIndex((d) => d.id === id),
      1
    );
    setRows();
  }

  function select(id) {
    selected.value = id;
  }

  function run() {
    setRows(buildData());
    selected.value = undefined;
  }

  function update() {
    const _rows = rows.value;
    for (let i = 0; i < _rows.length; i += 10) {
      _rows[i].label.value += " !!!";
    }
  }

  function runLots() {
    setRows(buildData(10000));
    selected.value = undefined;
  }

  function clear() {
    setRows([]);
    selected.value = undefined;
  }

  function swapRows() {
    const _rows = rows.value;
    if (_rows.length > 998) {
      const d1 = _rows[1];
      _rows[1] = _rows[998];
      _rows[998] = d1;
    }
    setRows();
  }

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Vitarx 4 (keyed)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <button id="run" onClick={run}>
                Create 1,000 rows
              </button>
              <button id="runlots" onClick={runLots}>
                Create 10,000 rows
              </button>
              <button id="add" onClick={add}>
                Append 1,000 rows
              </button>
              <button id="update" onClick={update}>
                Update every 10th row
              </button>
              <button id="clear" onClick={clear}>
                Clear
              </button>
              <button id="swaprows" onClick={swapRows}>
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>

      <table class="table table-hover table-striped test-data">
        <tbody>
          <For each={rows.value} key="id">
            {(row) => {
              return (
                <tr class={row.id === selected.value ? "danger" : ""}>
                  <td class="col-md-1">{row.id}</td>
                  <td class="col-md-4">
                    <a onClick={() => select(row.id)}>{row.label}</a>
                  </td>
                  <td class="col-md-1">
                    <a onClick={() => remove(row.id)}>
                      <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                    </a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>

      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}
