
const alight = require('alight');

var startTime;
var lastMeasure;

var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function () {
    window.setTimeout(function () {
        var stop = performance.now();
        console.log(lastMeasure + " took " + (stop - startTime));
    }, 0);
};

var TableViewModel = function () {
    var self = this;

    self.id = 1;
    self.data = []

    function _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }

    function buildData(count) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push(new ItemViewModel({
                id: self.id++,
                selected: false,
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
            }, self));
        }
        return data;
    }

    self.run = function () {
        startMeasure("run");
        self.data = buildData(1000)
        stopMeasure();
    };

    self.runLots = function () {
        startMeasure("runLots");
        self.data = buildData(10000)
        stopMeasure();
    };

    self.add = function () {
        startMeasure("add");
        self.data.push.apply(self.data, buildData(1000));
        stopMeasure();
    };

    self.update = function () {
        startMeasure("update");
        var tmp = self.data;
        for (let i = 0; i < tmp.length; i += 10) {
            tmp[i].label = tmp[i].label + ' !!!';
        }
        stopMeasure();
    };

    self.clear = function () {
        startMeasure("clear");
        self.data.splice(0, self.data.length)
        stopMeasure();
    };

    self.swapRows = function () {
        var swapArrayElements = function (a, x, y) {
            if (a.length === 1) return a;
            a.splice(y, 1, a.splice(x, 1, a[y])[0]);
            return a;
          };

        startMeasure("swapRows");
        self.data = swapArrayElements(self.data, 1, 998)
        stopMeasure();
    };

    self.select = function (id) {
        startMeasure("select");
        self.data.forEach(x => x.selected = false)
        self.data.filter(x => x.id == id).forEach(x => x.selected = true);
        stopMeasure();
    };

    self.del = function (item) {
        startMeasure("delete");
        var tmp = self.data;
        const idx = tmp.findIndex(d => d.id === item.id);
        self.data.splice(idx, 1);
        stopMeasure();
    };
};

var ItemViewModel = function (data, parent) {
    var self = this;

    self.id = data.id
    self.selected = data.selected
    self.label = data.label

    self.del = function () {
        parent.del(self);
    };

    self.select = function () {
        parent.select(self.id)
    };
};

alight(document.body, new TableViewModel());