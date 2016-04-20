var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        var duration = 0;
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
}

export default class HomeController {
    constructor($scope) {
        this.$scope = $scope;
        this.start = 0;
        this.data = [];
        this.id = 1;
    }

    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        }
        return data;
    }
    printDuration() {
        stopMeasure();
    }
    _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }
    add() {
        startMeasure("add");
        this.start = performance.now();
        this.data = this.data.concat(this.buildData(1000));
        this.printDuration();
    }
    select(item) {
        startMeasure("select");
        this.start = performance.now();
        this.selected = item.id;
        this.printDuration();
    }
    del(item) {
        startMeasure("delete");
        this.start = performance.now();
        const idx = this.data.findIndex(d => d.id===item.id);
        this.data.splice(idx, 1);
        this.printDuration();
    }
    update() {
        startMeasure("update");
        this.start = performance.now();
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
        this.printDuration();
    }
    run() {
        startMeasure("run");
        this.start = performance.now();
        this.data = this.buildData();
        this.printDuration();
    };
    hideAll() {
        startMeasure("hideAll");
        this.start = performance.now();
        this.backup = this.data;
        this.data = [];
        this.selected = null;
        this.printDuration();
    };
    showAll() {
        startMeasure("showAll");
        this.start = performance.now();
        this.data = this.backup;
        this.backup = null;
        this.selected = null;
        this.printDuration();
    };
    runLots() {
        startMeasure("runLots");
        this.start = performance.now();
        this.data = this.buildData(10000);
        this.selected = null;
        this.printDuration();
    };
    clear() {
        startMeasure("clear");
        this.start = performance.now();
        this.data = [];
        this.selected = null;
        this.printDuration();
    };
    swapRows() {
    	startMeasure("clear");
    	if(this.data.length > 10) {
    		var a = this.data[4];
    		this.data[4] = this.data[9];
    		this.data[9] = a;
    	}
    	this.printDuration();
    };
}

HomeController.$inject = ['$scope'];