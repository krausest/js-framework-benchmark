const Datum = require('Datum');

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

var HomeViewModel = function () {

    this.data = [];

    var selected = new Datum();

    var id = 1;

    var self = this;

    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

    function getRandomNumber(max) {
        return Math.round(Math.random() * 1000) % max;
    }

    function buildData(count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push(new ItemViewModel(id++, getRandomLabel()));
        }
        return data;
    }

    function getRandomLabel() {
        return adjectives[getRandomNumber(adjectives.length)] + " " +
            colours[getRandomNumber(colours.length)] + " " +
            nouns[getRandomNumber(nouns.length)];
    }

    this.run = new Datum.Click(function () {
        startMeasure("run");
        this.data = buildData(1000);
        selected(null);
        stopMeasure();
    });

    this.runLots = new Datum.Click(function () {
        startMeasure("runLots");
        this.data = buildData(10000);
        selected(null);
        stopMeasure();
    });

    this.add = new Datum.Click(function () {
        startMeasure("add");
        this.data.push.apply(this.data, buildData(1000));
        stopMeasure();
    });

    this.update = new Datum.Click(function () {
        startMeasure("update");
        for (var i = 0; i < this.data.length; i += 10) {
            this.data[i].update();
        }
        stopMeasure();
    });

    this.clear = new Datum.Click(function () {
        startMeasure("clear");
        this.data = [];
        selected(null);
        stopMeasure();
    });

    this.swapRows = new Datum.Click(function () {
        startMeasure("swapRows");
        if (this.data.length > 998) {
            var a = this.data[1];
            var b = this.data.splice(998, 1, a)[0];
            this.data.splice(1, 1, b);
        }
        stopMeasure();
    });

    function ItemViewModel(id, itemLabel) {

        var label = new Datum(itemLabel);

        this.label = new Datum.Text(label);

        this.id = new Datum.Text(function() {

            return id;
        });

        this.update = function() {
            label(label() + " !!!");
        };

        this.del = new Datum.Click(function () {
            startMeasure("delete");
            var index = self.data.indexOf(this);
            self.data.splice(index, 1);
            stopMeasure();
        });

        this.select = new Datum.Binding({
            click: function() {
                startMeasure("select");
                selected(this);
                stopMeasure();
            },
            classes: {
                danger: function() {
                    return selected() == this;
                }
            }
        });
    }
};

new Datum.BindingRoot(new HomeViewModel());
