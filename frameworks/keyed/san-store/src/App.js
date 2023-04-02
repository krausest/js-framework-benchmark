import {Component} from 'san';
import {connectSan} from './store';

class AppComponent extends Component {
    static trimWhitespace = 'all';
    static autoFillStyleAndId = false;
    static template = `
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>san store (keyed)</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="run" on-click="run">Create 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="runlots" on-click="runLots">Create 10,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="add" on-click="add">Append 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="update" on-click="update">Update every 10th row</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="clear" on-click="clear">Clear</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="swaprows" on-click="swapRows">Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-striped test-data" on-click="handleClick($event)">
            <tbody>
                <tr s-for="item in rows trackBy item.id" class="{{item.selected ? 'danger':''}}">
                    <td class="col-md-1">{{item.id}}</td>
                    <td class="col-md-4">
                        <a data-action="select" data-id="{{item.id}}">{{item.label}}</a>
                    </td>
                    <td class="col-md-1">
                        <a>
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"
                                data-action="remove" data-id="{{item.id}}"></span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>
            </tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
    `;

    run() {
        this.actions.run(1000);
    }
    runLots() {
        this.actions.run(10000);
    }
    add() {
        this.actions.add(1000);
    }
    update() {
        this.actions.update();
    }
    clear() {
        this.actions.clear();
    }
    swapRows() {
        this.actions.swapRows();
    }
    handleClick(e) {
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;
        action && this[action](+id);
    }
    remove(id) {
        this.actions.remove(id);
    }
    select(id) {
        this.actions.select(id);
    }
}

export default connectSan(
    {
        rows: 'rows'
    },
    {
        run: 'run',
        add: 'add',
        update: 'update',
        clear: 'clear',
        swapRows: 'swapRows',
        remove: 'remove',
        select: 'setSelected'
    }
)(AppComponent);