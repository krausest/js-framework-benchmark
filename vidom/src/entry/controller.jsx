/**
 * Created by stef on 17.11.15.
 */
'use strict';
var { node, Component, mountToDom }  = require('vidom');

const {Store} = require('./store');

window.rowsUpdated = 0;
window.rowsMounted = 0;


export class Row extends Component {
    onRender({styleClass, onClick, onDelete, data}) {
        return (<tr key={data.id} className={styleClass}>
            <td className="col-md-1">{data.id}</td>
            <td className="col-md-4">
                <a onClick={() => onClick(data.id)}>{data.label}</a>
            </td>
            <td className="col-md-1"><a onClick={() => onDelete(data.id)}><span className="glyphicon glyphicon-remove"></span></a></td>
            <td className="col-md-6"></td>
        </tr>);
    }
}

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    //console.timeStamp(name);
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        var duration = 0;
        console.log(lastMeasure+" took "+(stop-startTime));
        //document.getElementById("duration").innerHTML = Math.round(stop - startTime) + " ms ("  + Math.round(duration) + " ms)" ;
    }, 0);
}
export class Controller extends Component{
    onInit() {
        this.state = {store: new Store()};
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update10 = this.update10.bind(this);

        var target = document.querySelector('#main');
/*        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                lastChange = performance.now(); //console.log(mutation.type, mutation.oldValue, mutation.target.nodeName);
            });
        });
        var config = { attributes: true, childList: true, subtree:true};
        observer.observe(target, config);*/
    }
    run() {
        startMeasure("run");
        this.state.store.run();
        this.state = {store: this.state.store};
        this.update();
    }
    add() {
        startMeasure("add");
        this.start = performance.now();
        this.state.store.add();
        this.state = {store: this.state.store};
        this.update();
    }
    update10() {
        startMeasure("update");
        this.start = performance.now();
        this.state.store.update();
        this.state = {store: this.state.store};
        this.update();
    }
    select(id) {
        startMeasure("select");
        this.start = performance.now();
        this.state.store.select(id);
        this.state = {store: this.state.store};
        this.update();
    }
    delete(id) {
        startMeasure("delete");
        this.start = performance.now();
        this.state.store.delete(id);
        this.state = {store: this.state.store};
        this.update();
    }
    onUpdate() {
        stopMeasure();
    }
    onRender () {
        var rows = this.state.store.data.map((d,i) => {
            return <Row key={d.id} data={d} onClick={this.select} onDelete={this.delete} styleClass={d.id === this.state.store.selected ? 'danger':''}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-8">
                        <h1>Vidom</h1>
                    </div>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Add 10 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run}>Create 1000 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update10}>Update every 10th row</button>
                        <h3 id="duration"><span className="glyphicon glyphicon-remove"></span>&nbsp;</h3>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody>{rows}</tbody>
            </table>
        </div>);
 }
}

mountToDom(document.getElementById('main'), node(Controller));