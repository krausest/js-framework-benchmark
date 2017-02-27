import { h, app } from "hyperapp"
import { model, reducers } from "./store"
import RowsView from "./rowsView"

let startTime
let lastMeasure

function startMeasure(name, cb) {
    startTime = performance.now()
    lastMeasure = name
    cb()
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

function view(model, actions) {
    stopMeasure()

    return (
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>HyperApp v0.6.0</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="run"
                                    onclick={_ =>
                                        startMeasure("run", actions.run)}>
                                    Create 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="runlots"
                                    onclick={_ =>
                                        startMeasure(
                                            "runLots",
                                            actions.runLots
                                        )}>
                                    Create 10,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="add"
                                    onclick={_ =>
                                        startMeasure("add", actions.add)}>
                                    Append 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="update"
                                    onclick={_ =>
                                        startMeasure("update", actions.update)}>
                                    Update every 10th row
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="clear"
                                    onclick={_ =>
                                        startMeasure("clear", actions.clear)}>
                                    Clear
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="swaprows"
                                    onclick={_ =>
                                        startMeasure(
                                            "swapRows",
                                            actions.swapRows
                                        )}>
                                    Swap Rows
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    <RowsView model={model} actions={actions} />
                </tbody>
            </table>
            <span
                class="preloadicon glyphicon glyphicon-remove"
                aria-hidden="true"
            />
        </div>
    )
}

app({
    root: document.getElementById("main"),
    model,
    reducers,
    view
})
