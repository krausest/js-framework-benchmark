import { Store } from './store';

var startTime : number;
var lastMeasure : string | null;
var startMeasure = function(name : string) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

export class App {
    constructor(public store : Store) { }
    run() {
        startMeasure("run");
        this.store.run();
        stopMeasure();
    }
    add() {
        startMeasure("add");
        this.store.add();
        stopMeasure();
    }
    update() {
        startMeasure("update");
        this.store.update();
        stopMeasure();
    }
    select(idx : number) {
        startMeasure("select");
        this.store.select(idx);
        stopMeasure();
    }
    delete(idx : number) {
        startMeasure("delete");
        this.store.delete(idx);
        stopMeasure();
    }
    runLots() {
        startMeasure("runLots");
        this.store.runLots();
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        this.store.clear();
        stopMeasure();
    }
    swapRows() {
        startMeasure("swapRows");
        this.store.swapRows();
        stopMeasure();
    }
}
