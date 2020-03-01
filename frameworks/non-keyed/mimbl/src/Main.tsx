import * as mim from "mimbl"
import {IMainContainer} from "./Row"
import {Store} from "./Store"
import {TBody} from"./TBody"


export class Main extends mim.Component implements IMainContainer
{
    store: Store;
    tbody: TBody;

    constructor()
    {
        super();

        this.store = new Store();
        this.tbody = new TBody( this);

        (window as any).app = this;
    }

    run = () =>
    {
        this.tbody.run();
    }

    add = () =>
    {
        this.tbody.add();
    }

    update = () =>
    {
        this.tbody.update();
    }

    runLots = () =>
    {
        this.tbody.runLots();
    }

    clear = () =>
    {
        this.tbody.clear();
        this.tbody = new TBody( this);
        this.updateMe();
    }

    swapRows = () =>
    {
        this.tbody.swapRows();
    }

    onSelectRowClicked( row)
    {
        this.tbody.onSelectRowClicked(row);
    }

    onDeleteRowClicked( row)
    {
        this.tbody.onDeleteRowClicked(row);
    }

    render()
    {
        return (<div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mimbl (non-keyed)</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="run" click={this.run}>Create 1,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="runlots" click={this.runLots}>Create 10,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="add" click={this.add}>Append 1,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="update" click={this.update}>Update every 10th row</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="clear" click={this.clear}>Clear</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="swaprows" click={this.swapRows}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data" updateStrategy={{allowKeyedNodeRecycling:false}}>
                {this.tbody}
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
    }
}

mim.mount( <Main/>, document.getElementById('main'));