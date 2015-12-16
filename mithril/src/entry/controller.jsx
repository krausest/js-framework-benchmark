/**
 * Created by stef on 17.11.15.
 */
'use strict';
/** @jsx m */

var m = require('mithril')
var Store = require('./store');
let startTime = 0;

var Row = {
    controller: function(props) {
        return {
            click: function() {
                const id = props.id;
                startTime = performance.now();
                console.log("clicked on ",id);
                props.onclick(id);
            },
            remove: function() {
                const id = props.id;
                startTime = performance.now();
                console.log("delete ",id);
                props.onremove(id);
            },
        }
    },
    view: function(ctrl, props) {
        return (<tr key={props.id} className={props.styleClass}>
            <td class="col-md-1">{props.id}</td>
            <td class="col-md-4">
                <a onclick={ctrl.click}>{props.label}</a>
            </td>
            <td class="col-md-1"><a onclick={ctrl.remove}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td class="col-md-6"></td>
        </tr>);
    }
}

var Controller = {
    controller: function() {
        return {
            data: function() { return Store.data;},
            selected: function() { return Store.selected;},
            run: function() {
                console.log('time run');
                console.time('run');
                startTime = performance.now();
                Store.run();
                console.timeEnd('run');
            },
            add: function() {
                startTime = performance.now();
                Store.add();
            },
            update: function() {
                startTime = performance.now();
                Store.update();
            },
            select: function(id) { Store.select(id); },
            remove: function(id) { Store.remove(id); },
            done: function() {
                console.time('duration');
                let duration = Math.round(performance.now() - startTime) + " ms";
                document.getElementById("duration").innerHTML = duration;
                console.timeEnd('duration');
            }
        }
    },

    view: function(ctrl) {


        let rows = ctrl.data().map((d,i) => {
            let sel = d.id === ctrl.selected() ? 'danger':'';
            return m.component(Row, {onclick:ctrl.select, onremove:ctrl.remove, key:d.id, label:d.label, id:d.id, styleClass:sel});
// this doesn't work here return (<Row onclick={ctrl.select} onremove={ctrl.remove} key={d.id} label={d.label} id={d.id} styleClass={sel}></Row>);
        });
        var ret = <div className="container" config={ctrl.done}>
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-8">
                        <h1>Mithril</h1>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="btn btn-primary btn-block" id="add" onclick={ctrl.add}>Add 10 rows</button>
                        <button type="button" class="btn btn-primary btn-block" id="run" onclick={ctrl.run}>Create 1000 rows</button>
                        <button type="button" class="btn btn-primary btn-block" id="update" onclick={ctrl.update}>Update every 10th row</button>
                        <h3 id="duration"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;</h3>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>;
        return ret;
    }
};

export default Controller;