import { createApp, defineComponent, registerComponent, shallowRef } from 'strve-reactivity';
import { buildData } from './data.js';

const MainBody = defineComponent(() => {
  const selected = shallowRef();
  const rows = shallowRef([]);

  const run = () => {
    rows.value = buildData();
    selected.value = null;
  };

  const add = () => {
    const r = rows.value.slice();
    rows.value = r.concat(buildData(1000));
  };

  const update = () => {
    const r = rows.value.slice();
    for (let i = 0; i < r.length; i += 10) {
      r[i].label += ' !!!';
    }
    rows.value = r;
  };

  const runLots = () => {
    rows.value = buildData(10000);
    selected.value = null;
  };

  const clear = () => {
    rows.value = [];
    selected.value = null;
  };

  const swapRows = () => {
    const r = rows.value.slice();
    if (r.length > 998) {
      let tmp = r[1];
      r[1] = r[998];
      r[998] = tmp;
      rows.value = r;
    }
  };

  const remove = (id) => {
    const r = rows.value.slice();
    r.splice(
      r.findIndex((d) => d.id === id),
      1
    );
    rows.value = r;
  };

  const select = (id) => {
    selected.value = id;
  };

  return () => (
    <fragment>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'>
            <h1>Strve-reactivity-keyed</h1>
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
      <link href='/css/currentStyle.css' rel='stylesheet' />
    </fragment>
  );
});

createApp(() => <main-body></main-body>).mount('#main');

registerComponent('main-body', MainBody);
