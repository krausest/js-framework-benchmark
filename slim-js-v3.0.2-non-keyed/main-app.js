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
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

class Store {
    constructor() {
        this.data = [];
        this.backup = null;
        this.selected = null;
        this.id = 1;
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            // this.data[i].label += ' !!!';
            this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
        }
    }
    delete(id) {
        id = parseInt(id);
        const idx = this.data.findIndex(d => d.id==id);
        this.data = this.data.filter((e,i) => i!=idx);
        return this;
    }
    run(amount) {
        this.data = this.buildData(amount);
        this.selected = null;
    }
    add(amount) {
        this.data = this.data.concat(this.buildData(amount));
        this.selected = null;
    }
    update() {
        this.updateData();
        this.selected = null;
    }
    select(id) {
        this.selected = parseInt(id);
    }
    hideAll() {
        this.backup = this.data;
        this.data = [];
        this.selected = null;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = null;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = null;
    }
    clear() {
        this.data = [];
        this.selected = null;
    }
    swapRows() {
        if(this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
    }
}

Slim.tag('main-app',

`
<div id='main'>
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Slim.js</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                            <button click="create1k" type='button' class='btn btn-primary btn-block' id='run'>Create 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button click="create10k" type='button' class='btn btn-primary btn-block' id='runlots'>Create 10,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button click="append1k" type='button' class='btn btn-primary btn-block' id='add'>Append 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button click="update10" type='button' class='btn btn-primary btn-block' id='update'>Update every 10th row</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button click="testClear" type='button' class='btn btn-primary btn-block' id='clear'>Clear</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button click="swap" type='button' class='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-striped test-data">
            <tbody id="tbody">
                <tr s:repeat="items as data">
                    <td class="col-md-1" bind>{{data.id}}</td>
                    <td class="col-md-4">
                        <a bind:marker="data.id" click="doSelect" bind>{{data.label}}</a>
                    </td>
                    <td class="col-md-1">
                        <a>
                            <span click="deleteOne" bind:marker="data.id" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td class="col-md-6">
                    </td>
                </tr>
            </tbody>
        </div>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
</div>
`,

class extends Slim {
    onBeforeCreated() {
        this.items = [];
        this.store = new Store();
        this.selectedNode = null;
    }

    doSelect(e) {
        startMeasure('select');
        this.store.select(e.target.getAttribute('marker'));
        this.selectedNode && this.selectedNode.classList.remove('danger');
        this.selectedNode = e.target.parentElement.parentElement;
        this.selectedNode.classList.add('danger');
        stopMeasure();
    }

    deleteOne(e) {
        startMeasure('delete');
        this.store.delete(e.target.getAttribute('marker'));
        if (e.target.parentElement.parentElement.parentElement === this.selectedNode) {
            this.selectedNode.classList.remove('danger');
            this.selectedNode = null;
        }
        this.items = this.store.data;
        stopMeasure();
    }

    update10() {
        startMeasure('update');
        this.store.update();
        this.items = this.store.data;
        stopMeasure();
    }

    testClear() {
        startMeasure('clear');
        this.store.clear();
        this.items = this.store.data;
        stopMeasure();
    }

    append1k() {
        startMeasure('add');
        this.store.add(1000);
        this.items = this.store.data;
        stopMeasure();
    }

    swap() {
        startMeasure('swap');
        this.store.swapRows();
        this.items = this.store.data;
        stopMeasure();
    }

    create10k() {
        this.store.clear();
        this.store.runLots();
        startMeasure('runLots');
        this.items = this.store.data;
        stopMeasure();
    }

    create1k() {
        this.store.clear();
        this.store.run(1000);
        startMeasure('run');
        this.items = this.store.data;
        stopMeasure();
    }
});