import * as jsx from "@xania/glow.js";
import { viewList, RowContext } from "@xania/glow.js";
import { TableStore, DataRow } from "./table-store";

interface JumbotronProps {
  store: TableStore;
}

function Jumbotron(props: JumbotronProps) {
  const { store } = props;

  function run(counter = 5) {
    store.create10000Rows();
    setTimeout(() => {
      if (counter) {
        store.clear();
        setTimeout(() => run(counter - 1), 200);
      }
    }, 200);
  }
  return (
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>XaniaJS-"keyed"</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button
                click={store.create1000Rows}
                type="button"
                class="btn btn-primary btn-block"
                id="run"
              >
                Create 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.create10000Rows}
                type="button"
                class="btn btn-primary btn-block"
                id="runlots"
              >
                Create 10,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.append1000Rows}
                type="button"
                class="btn btn-primary btn-block"
                id="add"
              >
                Append 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.updateEvery10thRow}
                type="button"
                class="btn btn-primary btn-block"
                id="update"
              >
                Update every 10th row
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.clear}
                type="button"
                class="btn btn-primary btn-block"
                id="clear"
              >
                Clear
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.swapRows}
                type="button"
                class="btn btn-primary btn-block"
                id="swaprows"
              >
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  const rows = viewList<DataRow>();
  const store = new TableStore(rows);
  return (
    <div id="main">
      <div class="container">
        <Jumbotron store={store} />
        <table class="table table-hover table-striped test-data">
          <tbody>{rows.map((context) => Row(context, store))}</tbody>
        </table>
        <span
          class="preloadicon glyphicon glyphicon-remove"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
}

function Row(context: RowContext<DataRow>, store: TableStore) {
  return (
    <tr class={context.property("className")} data_id={context.property("id")}>
      <td class="col-md-1">{context.property("id")}</td>
      <td class="col-md-4">
        <a class="lbl" click={context.call(store.select)}>
          {context.property("label")}
        </a>
      </td>
      <td class="col-md-1">
        <a class="remove" click={store.delete}>
          <span
            class="remove glyphicon glyphicon-remove"
            aria-hidden="true"
          ></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  );
}

// interface InputProps<T> {
//   value: State<T>;
// }

// function Input<T>(props: InputProps<T>) {
//   const tpl = jsx.factory;
//   const { value } = props;
//   return <input value={value} keyup={onKeyUp} />;

//   function onKeyUp({ target }) {
//     value.update(target.value);
//   }
// }

const main = document.getElementById("main");
jsx.render2(main, <Container />);
