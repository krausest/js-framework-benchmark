import { defineComponent, ref, shallowRef } from 'strve-rv';
import { buildData } from './data.js';

const Main = defineComponent(() => {
  const selected = ref();
  const rows = shallowRef([]);

  function setRows(update = rows.value.slice()) {
    rows.value = update;
  }

  function add() {
    rows.value = rows.value.concat(buildData(1000));
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
      _rows[i].label += ' !!!';
    }
    setRows();
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
      const d998 = _rows[998];
      _rows[1] = d998;
      _rows[998] = d1;
      setRows();
    }
  }

  return () => (
    <fragment>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'>
            <h1>Strve-rv-keyed</h1>
          </div>
          <div class='col-md-6'>
            <div class='row'>
              <div class='col-sm-6 smallpad'>
                <button type='button' class='btn btn-primary btn-block' id='run' onClick={run}>
                  Create 1,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  type='button'
                  class='btn btn-primary btn-block'
                  id='runlots'
                  onClick={runLots}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button type='button' class='btn btn-primary btn-block' id='add' onClick={add}>
                  Append 1,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  type='button'
                  class='btn btn-primary btn-block'
                  id='update'
                  onClick={update}
                >
                  Update every 10th row
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button type='button' class='btn btn-primary btn-block' id='clear' onClick={clear}>
                  Clear
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  type='button'
                  class='btn btn-primary btn-block'
                  id='swaprows'
                  onClick={swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class='table table-hover table-striped test-data'>
        <tbody
          onClick={(event) => {
            const el = event.target;
            const id = Number(el.closest('tr').firstChild.textContent);
            if (el.matches('.glyphicon-remove')) {
              remove(id);
            } else {
              select(id);
            }
            return false;
          }}
        >
          {rows.value.map((item) => (
            <tr class={item.id === selected.value ? 'danger' : ''} key={item.id}>
              <td class='col-md-1'>{item.id}</td>
              <td class='col-md-4'>
                <a>{item.label}</a>
              </td>
              <td class='col-md-1'>
                <a>
                  <span class='glyphicon glyphicon-remove' aria-hidden='true'></span>
                </a>
              </td>
              <td class='col-md-6'></td>
            </tr>
          ))}
        </tbody>
      </table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
    </fragment>
  );
});

defineComponent(
  {
    mount: '#main',
  },
  () => {
    return () => <component $is={Main} />;
  }
);
