
import ko from 'knockout';

var HomeViewModel = function () {
    var self = this;
    self.id = 1;

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
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
            }, self));
        }
        return data;
    }

    self.selected = ko.observable(null);
    self.data = ko.observableArray();

    self.run = function () {
        self.data(buildData(1000));
        self.selected(null);
    };

    self.runLots = function () {
        self.data(buildData(10000));
        self.selected(null);
    };

    self.add = function () {
        self.data.push.apply(self.data, buildData(1000));
    };

    self.update = function () {
        var tmp = self.data();
        for (let i = 0; i < tmp.length; i += 10) {
            tmp[i].label(tmp[i].label() + ' !!!');
        }
    };

    self.clear = function () {
        self.data.removeAll();
        self.selected(null);
    };

    self.swapRows = function () {
        var tmp = self.data();
        if (tmp.length > 998) {
            var a = tmp[1];
            tmp[1] = tmp[998];
            tmp[998] = a;
            self.data(tmp);
        }
    };

    self.select = function (id) {
        self.selected(id);
    };

    self.del = function (item) {
        var tmp = self.data();
        const idx = tmp.findIndex(d => d.id === item.id);
        self.data.splice(idx, 1);
    };
};

var ItemViewModel = function (data, parent) {
    var self = this;

    self.id = ko.observable(data.id);
    self.label = ko.observable(data.label);

    self.del = function () {
        parent.del(self);
    };

    self.select = function () {
        parent.select(self.id());
    };
};

ko.applyBindings(new HomeViewModel(), document.getElementById('main'));
