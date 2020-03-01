import { h, app } from "hyperapp"
import { state, actions } from "./store"
import RowsView from "./rowsView"

function view(state, actions) {
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
                                    onclick={_ => actions.run()}>
                                    Create 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="runlots"
                                    onclick={_ => actions.runLots()}>
                                    Create 10,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="add"
                                    onclick={_ => actions.add()}>
                                    Append 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="update"
                                    onclick={_ => actions.update()}>
                                    Update every 10th row
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="clear"
                                    onclick={_ => actions.clear()}>
                                    Clear
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="swaprows"
                                    onclick={_ =>
                                            actions.swapRows()
                                        }>
                                    Swap Rows
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    <RowsView state={state} actions={actions} />
                </tbody>
            </table>
            <span
                class="preloadicon glyphicon glyphicon-remove"
                aria-hidden="true"
            />
        </div>
    )
}

app(state, actions, view, document.getElementById("main"))
