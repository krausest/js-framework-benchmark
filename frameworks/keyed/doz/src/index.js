import Doz from 'doz'
import utils from './utils.js'

let currentBench = "";

new Doz({
    mixin: utils,
    root: '#main',
    store: 'list',
    props: {
        rows: []
    },
    template(h) {
        return h`
            <div class="container">
                <div class="jumbotron">
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Doz keyed</h1>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-sm-6 smallpad">
                                    <button type='button' class='btn btn-primary btn-block' onclick='this.run(1)'>Create 1,000 rows</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type='button' class='btn btn-primary btn-block' onclick='this.runLots(1000)'>Create 10,000 rows</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type='button' class='btn btn-primary btn-block' onclick='this.add()'>Append 1,000 rows</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type='button' class='btn btn-primary btn-block' onclick='this.update()'>Update every 10th row</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type='button' class='btn btn-primary btn-block' onclick='this.clear()'>Clear</button>
                                </div>
                                <div class="col-sm-6 smallpad">
                                    <button type='button' class='btn btn-primary btn-block' onclick='this.swapRows()'>Swap Rows</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="table table-hover table-striped test-data">
                    <tbody>
                        ${this.each(this.props.rows, row => `
                            <tr>
                                <td class="col-md-1">${row.id}</td>
                                <td class="col-md-4">${row.label}</td>
                                <td class="col-md-1">
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                </td>
                                <td class="col-md-6"></td>
                            </tr>`
                        )}
                    </tbody>
                </table>
                <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
            </div>
        `
    },

    onCreate() {
        this.currentBench = '';
        this.rows = [];
    },

    onUpdate() {
        console.log('update', this.currentBench);
        console.timeEnd(this.currentBench);
    }
});