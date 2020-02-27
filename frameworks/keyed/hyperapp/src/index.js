import { h, Lazy, app } from "hyperapp"
import { state, actions } from "./store"

const Row = ({ data, label, styleClass }) => (
  <tr key={data.id} class={styleClass}>
    <td class="col-md-1">{data.id}</td>
    <td class="col-md-4">
        <a onclick={[actions.select, data.id]}>{label}</a>
    </td>
    <td class="col-md-1">
        <a onclick={[actions.delete, data.id]}>
            <span class="glyphicon glyphicon-remove" aria-hidden="true">
            </span>
        </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
);

const LazyRow = ({ data, label, styleClass }) => (
  <Lazy
    view={Row}
    data={data}
    label={label}
    styleClass={styleClass}
  />
);

function view(state) {
  const rows = state.data.map(data => (
    <LazyRow
      data={data}
      label={data.label}
      styleClass={data.id === state.selected ? 'danger' : ''}
    />
  ));
  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>HyperApp</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="run"
                  onclick={actions.run}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="runlots"
                  onclick={actions.runLots}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="add"
                  onclick={actions.add}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="update"
                  onclick={actions.update}
                >
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="clear"
                  onclick={actions.clear}
                >
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="swaprows"
                  onclick={actions.swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {rows}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  )
}

app({
  init: state,
  view,
  node: document.getElementById("main")
});
