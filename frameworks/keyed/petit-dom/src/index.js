import { h, mount, patch } from "petit-dom"
import { Store } from "./store"


var store = new Store()

function startMeasure(name, meth) {
    meth.call(store)
    updateView()
}

var runAction = () => startMeasure("run", store.run)
var runLotsAction = () =>  startMeasure("runLots", store.runLots)
var addAction = () => startMeasure("add", store.add)
var updateAction = () => startMeasure("update", store.update)
var clearAction = () => startMeasure("clear", store.clear)
var swapRowsAction = () => startMeasure("swapRows", store.swapRows)

var selectAction = id => () => {
  store.select(id)
  updateView()
}

var deleteAction = id => () => {
  store.delete(id)
  updateView()
}

function updateView() {
  var vel2 = render()
  patch(vel2, vel)
  vel = vel2
}

var main = document.getElementById("main")
var vel = render()
var el = mount(vel)
main.appendChild(el)

function render() {
  //console.log('render')
    return (
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>petit-dom</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="run"
                                    onclick={runAction}>
                                    Create 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="runlots"
                                    onclick={runLotsAction}>
                                    Create 10,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="add"
                                    onclick={addAction}>
                                    Append 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="update"
                                    onclick={updateAction}>
                                    Update every 10th row
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="clear"
                                    onclick={clearAction}>
                                    Clear
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="swaprows"
                                    onclick={swapRowsAction}>
                                    Swap Rows
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                  {renderAllRows(store.data)}
                </tbody>
            </table>
            <span
                class="preloadicon glyphicon glyphicon-remove"
                aria-hidden="true"
            />
        </div>
    )
}

function renderAllRows(data) {
  const rows = Array(data.length)
  for (var i = 0; i < data.length; i++) {
    var {id, label} = data[i]
    rows[i] = (
      <Row
        key={id}
        id={id}
        label={label}
        css={id === store.selected ? "danger" : ""}
      />
    )
  }
  return rows
}

function Row({id, label, css}) {
  return (
    <tr class={css}>
        <td class="col-md-1">{id}</td>
        <td class="col-md-4">
            <a onclick={selectAction(id)}>{label}</a>
        </td>
        <td class="col-md-1">
            <a onclick={deleteAction(id)}>
                <span class="glyphicon glyphicon-remove" aria-hidden="true">
                </span>
            </a>
        </td>
        <td class="col-md-6"></td>
    </tr>
  )
}

Row.shouldUpdate = function (oldProps, newProps) {
  return oldProps.label !== newProps.label || oldProps.css !== newProps.css
}
