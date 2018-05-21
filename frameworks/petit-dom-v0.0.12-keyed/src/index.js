import { h, mount, patch } from "petit-dom"
import { Store } from "./store"

function startMeasure(name, meth) {
    startTime = performance.now()
    lastMeasure = name
    //
    meth.call(store)
    updateView()
    //
    stopMeasure()
}

function stopMeasure() {
    const last = lastMeasure

    if (lastMeasure) {
        window.setTimeout(
            function metaStopMeasure() {
                lastMeasure = null
                const stop = performance.now()
                const duration = 0
                console.log(last + " took " + (stop - startTime))
            },
            0
        )
    }
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

let startTime
let lastMeasure

var store = new Store()
var main = document.getElementById("main")
var vel = render()
var el = mount(vel)
main.appendChild(el)

function render() {
  //console.log('render')
    return (
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>petit-dom</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    id="run"
                                    onclick={runAction}>
                                    Create 1,000 rows
                                </button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    id="runlots"
                                    onclick={runLotsAction}>
                                    Create 10,000 rows
                                </button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    id="add"
                                    onclick={addAction}>
                                    Append 1,000 rows
                                </button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    id="update"
                                    onclick={updateAction}>
                                    Update every 10th row
                                </button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    id="clear"
                                    onclick={clearAction}>
                                    Clear
                                </button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    id="swaprows"
                                    onclick={swapRowsAction}>
                                    Swap Rows
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody>
                  {renderAllRows(store.data)}
                </tbody>
            </table>
            <span
                className="preloadicon glyphicon glyphicon-remove"
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
    <tr className={css}>
        <td className="col-md-1">{id}</td>
        <td className="col-md-4">
            <a onclick={selectAction(id)}>{label}</a>
        </td>
        <td className="col-md-1">
            <a onclick={deleteAction(id)}>
                <span className="glyphicon glyphicon-remove" aria-hidden="true">
                </span>
            </a>
        </td>
        <td className="col-md-6"></td>
    </tr>
  )
}

Row.shouldUpdate = function (oldProps, newProps) {
  return oldProps.label !== newProps.label || oldProps.css !== newProps.css
}
