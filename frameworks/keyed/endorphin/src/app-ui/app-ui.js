let startTime;
let lastMeasure;

function startMeasure(name) {
    startTime = performance.now();
    lastMeasure = name;
}

function stopMeasure() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

export function onAdd ({ store }) {
    startMeasure("add");
    store.add();
    stopMeasure();
}

export function onClear ({ store }) {
    startMeasure("clear");
    store.clear();
    stopMeasure();
}

export function onPartialUpdate ({ store }) {
    startMeasure("update");
    store.update();
    stopMeasure();
}

export function onRemove( id, { store } ) {
    startMeasure("delete");
    store.delete(id);
    stopMeasure();
}

export function onRun ({ store }) {
    startMeasure("run");
    store.run();
    stopMeasure();
}

export function onRunLots ({ store }) {
    startMeasure("runLots");
    store.runLots();
    stopMeasure();
}

export function onSelect ( id, { store } ) {
    startMeasure("select");
    store.select(id);
    stopMeasure();
}

export function onSwapRows ({ store }) {
    startMeasure("swapRows");
    store.swapRows();
    stopMeasure();
}
