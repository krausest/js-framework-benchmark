import * as ui from "hyperoop";
import { actions } from "./store";
import RowsView from "./rowsView";

function view() {

    return (
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>HyperOOP</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="run"
                                    onclick={_ =>
                                        actions.run.bind(actions)()}>
                                    Create 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="runlots"
                                    onclick={_ =>
                                        actions.runLots.bind(actions)()
                                        }>
                                    Create 10,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="add"
                                    onclick={_ => actions.add.bind(actions)()}>
                                    Append 1,000 rows
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="update"
                                    onclick={_ => actions.update.bind(actions)()}>
                                    Update every 10th row
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="clear"
                                    onclick={_ => actions.clear.bind(actions)()}>
                                    Clear
                                </button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    id="swaprows"
                                    onclick={_ => actions.swapRows.bind(actions)()
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
                    <RowsView act={actions} />
                </tbody>
            </table>
            <span
                class="preloadicon glyphicon glyphicon-remove"
                aria-hidden="true"
            />
        </div>
    )
}

ui.init(document.getElementById("main"), ui.view(actions, view))
