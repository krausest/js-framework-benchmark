    resonate
        .createBodyComponent()
        .as(function (component) {

            var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
            var colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
            var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

            var adjectivesCount = adjectives.length;
            var colorsCount = colors.length;
            var nounsCount = nouns.length;

            var random = function (max) {
                return Math.round(Math.random() * 1000) % max;
            };

            var nextId = 1;

            var createData = function (count) {
                var data = new Array(count);

                for (var i = 0; i < count; i++) {
                    data[i] = {
                        id: nextId++,
                        label: adjectives[random(adjectivesCount)] + ' ' + colors[random(colorsCount)] + ' ' + nouns[random(nounsCount)]
                    };
                }

                return BindingArray.createFrom(data);
            };

            component.data = [];
            component.selected = -1;

            component.run = function () {
                component.data = createData(1000);
            };

            component.runLots = function () {
                component.data = createData(10000);
            };

            component.add = function () {
                var appended = createData(1000);
                for (var i = 0; i < appended.length; i++) {
                    component.data.push(appended[i]);
                }
            };

            component.update = function () {
                var data = component.data;
                for (var i = 0; i < data.length; i += 10) {
                    data[i].label += ' !!!';
                }
            };

            component.clear = function () {
                component.data = [];
            };

            component.swapRows = function () {
                var data = component.data;
                if (data.length > 998) {
                    var temp = data[1];
                    data[1] = data[998];
                    data[998] = temp;
                }
            };

            component.removeRow = function (index) {
                component.data.splice(index, 1);
            };

            component.selectRow = function (index) {
                component.selected = index;
            };
        });

        resonate.initialize();