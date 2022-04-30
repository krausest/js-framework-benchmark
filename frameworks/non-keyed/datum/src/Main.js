const Datum = require('Datum');

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
        this.data = buildData(1000);
        selected(null);
    });

    this.runLots = new Datum.Click(function () {
        this.data = buildData(10000);
        selected(null);
    });

    this.add = new Datum.Click(function () {
        this.data.push.apply(this.data, buildData(1000));
    });

    this.update = new Datum.Click(function () {
        for (var i = 0; i < this.data.length; i += 10) {
            this.data[i].update();
        }
    });

    this.clear = new Datum.Click(function () {
        this.data = [];
        selected(null);
    });

    this.swapRows = new Datum.Click(function () {
        if (this.data.length > 998) {
            var a = this.data[1];
            var b = this.data.splice(998, 1, a)[0];
            this.data.splice(1, 1, b);
        }
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
            var index = self.data.indexOf(this);
            self.data.splice(index, 1);
        });

        this.select = new Datum.Binding({
            click: function() {
                selected(this);
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
