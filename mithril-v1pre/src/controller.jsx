/**
 * Created by stef on 17.11.15.
 */
'use strict';
/** @jsx m */

var m = require('mithril')
var {Store} = require('./store');

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            var stop = performance.now();
            var duration = 0;
            console.log(lastMeasure+" took "+(stop-startTime));
        }, 0);
    }
}

var Row = {
    oninit: function(vnode) {
        vnode.state = {
            click: function() {
                const id = props.id;
                vnode.attrs.onclick(id);
            },
            remove: function() {
                const id = props.id;
                vnode.attrs.onremove(id);
            },
        }
    },
    view: function(vnode) {
        return (<tr key={vnode.attrs.id} className={vnode.attrs.styleClass}>
            <td class="col-md-1">{vnode.attrs.id}</td>
            <td class="col-md-4">
                <a onclick={this.click}>{vnode.attrs.label}</a>
            </td>
            <td class="col-md-1"><a onclick={this.remove}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td class="col-md-6"></td>
        </tr>);
    }
}

var Controller = {
    oninit: function(vnode) {
        vnode.state = {
            data: function() { return Store.data;},
            selected: function() { return Store.selected;},
            run: function() {
                startMeasure("run")
                Store.run();
            },
            add: function() {
                startMeasure("add")
                Store.add();
            },
            update: function() {
                startMeasure("update")
                Store.update();
            },
            select: function(id) {
                startMeasure("select");
                Store.select(id);
            },
            remove: function(id) {
                startMeasure("delete")
                Store.remove(id);
            },
            runLots: function() {
                startMeasure("runLots")
                Store.runLots();
            },
            clear: function() {
                startMeasure("clear")
                Store.clear();
            },
            swapRows: function() {
                startMeasure("swapRows")
                Store.swapRows();
            },
            done: function() {
                stopMeasure();
            }
        }
    },

    view: function() {
        let rows = this.data().map((d,i) => {
            let sel = d.id === this.selected() ? 'danger':'';
            return m(Row, {onclick:this.select, onremove:this.remove, key:d.id, label:d.label, id:d.id, styleClass:sel});
// this doesn't work here return (<Row onclick={this.select} onremove={this.remove} key={d.id} label={d.label} id={d.id} styleClass={sel}></Row>);
        });
        var ret = <div className="container" onupdate={this.done}>
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mithril v1pre</h1>
                    </div>
                    <div class="col-md-6">
                        <div className="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="run" onclick={this.run}>Create 1,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="runlots" onclick={this.runLots}>Create 10,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="add" onclick={this.add}>Append 1,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="update" onclick={this.update}>Update every 10th row</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="clear" onclick={this.clear}>Clear</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick={this.swapRows}>Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody class="">
                {rows}
                </tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>;
        return ret;
    }
};

export { Controller };