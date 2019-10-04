import * as mim from "mimbl"
import {IMainContainer} from "./Row"
import {Store} from "./Store"
import {TBody} from"./TBody"


// var startTime;
// var lastMeasure;
// var startMeasure = function(name) {
//     //console.timeStamp(name);
//     startTime = performance.now();
//     lastMeasure = name;
// }
// var stopMeasure = function() {
//     var last = lastMeasure;
//     if (lastMeasure) {
//         window.setTimeout(function () {
//             lastMeasure = null;
//             var stop = performance.now();
//             var duration = 0;
//             console.log(last+" took "+(stop-startTime));
//         }, 0);
//     }
// }

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

    // schedulePrintDuration() {
    //     this.callMe( () => stopMeasure(), false);
    // }

    run()
    {
        // startMeasure("run");
        this.tbody.run();
        // this.schedulePrintDuration();
    }
    
    add()
    {
        // startMeasure("add");
        this.tbody.add();
        // this.schedulePrintDuration();
    }
    
    update()
    {
        // startMeasure("update");
        this.tbody.update();
        // this.schedulePrintDuration();
    }
    
    runLots()
    {
        // startMeasure("runLots");
        this.tbody.runLots();
        // this.schedulePrintDuration();
    }
    
    clear()
    {
        // startMeasure("clear");
        this.tbody.clear();
        this.tbody = new TBody( this);
        this.updateMe();
        // this.schedulePrintDuration();
    }
    
    swapRows()
    {
        // startMeasure("swapRows");
        this.tbody.swapRows();
        // this.schedulePrintDuration();
    }
    
    onSelectRowClicked( row)
    {
        // startMeasure("select");
        this.tbody.onSelectRowClicked(row);
        // this.schedulePrintDuration();
    }
    
    onDeleteRowClicked( row)
    {
        // startMeasure("delete");
        this.tbody.onDeleteRowClicked(row);
        // this.schedulePrintDuration();
    }
    
    render()
    {
        return (<div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mimbl (keyed)</h1>
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