var sf = require('scarletsframe');
window.sf = sf;
// Declare variable for the model
sf.model.for('bench-mark', function(self){
    self.list = [];
    self.selected = -1;
    self.selectedRow = null;
});

// Declare functions that controlling the model
sf.controller.run('bench-mark', function(self, root){
    var Measurer = root('measurer');

    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

    var nextId = 1;

    function _random(max) {
        return Math.round(Math.random()*1000)%max;
    }

    self.buildData = function(count = 1000){
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({
                id: nextId++,
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
            });

        return data;
    }

    self.unselect = function(){
        if(self.selected === -1) return;
        self.selected = -1;
        
        if(self.selectedRow !== undefined)
            self.selectedRow.className = "";
    }

    // Handle button
    self.b_run = function(){
        Measurer.start("run");
        self.list = self.buildData();
        self.unselect();
        Measurer.stop();
    }

    self.b_runlots = function(){
        Measurer.start("runLots");
        self.list = self.buildData(10000);
        self.unselect();
        Measurer.stop();
    }

    self.b_add = function(){
        Measurer.start("add");
        self.list = self.list.concat(self.buildData(1000));
        Measurer.stop();
    }

    self.b_update = function(){
        Measurer.start("update");
        for (var i = 0; i < self.list.length; i += 10) {
            self.list[i].label += ' !!!';
            self.list.softRefresh(i);
        }
        Measurer.stop();
    }

    self.b_clear = function(){
        Measurer.start("clear");
        self.list.splice(0);
        self.unselect();
        Measurer.stop();
    }

    self.b_swaprows = function(){
        Measurer.start("swapRows");
        if(self.list.length > 998){
            self.list.swap(1, 998);
        }
        Measurer.stop();
    }

    self.b_select = function(el){
        Measurer.start("select");
        self.unselect();
        self.selectedRow = el.parentNode.parentNode;
        self.selected = sf.model.index(self.selectedRow);
        self.selectedRow.className = "danger";
        Measurer.stop();
    }

    self.b_remove = function(el){
        Measurer.start("delete");
        self.list.splice(sf.model.index(el.parentNode.parentNode), 1);
        Measurer.stop();
    }
});

// Declare measure function in different scope
sf.controller.run('measurer', function(self){
    var startTime;
    var lastMeasure;

    self.start = function(name) {
        startTime = performance.now();
        lastMeasure = name;
    }
    self.stop = function() {
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
});

// We're not using dynamic resource loader
sf.loader.off();