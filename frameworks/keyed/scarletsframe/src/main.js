var sf = require('scarletsframe');
var $ = sf.dom;

// Declare variable for the model
sf.model.for('bench-mark', function(self){
    self.list = [];
    self.selected = -1;
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
                isSelected:'',
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
            });

        return data;
    }

    self.unselect = function(){
        if(self.selected === -1) return;

        if(self.list[self.selected] !== undefined){
            self.list[self.selected].isSelected = false;
            self.list.softRefresh(self.selected);
        }

        self.selected = -1;
    }

    // Handle button
    self.b_run = function(){
        Measurer.start("run");
        self.list = self.buildData();
        self.selected = -1;
        Measurer.stop();
    }

    self.b_runlots = function(){
        Measurer.start("runLots");
        self.list = self.buildData(10000);
        self.selected = -1;
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
        self.selected = -1;
        Measurer.stop();
    }

    self.b_swaprows = function(){
        Measurer.start("swapRows");

        if(self.list.length > 998)
            self.list.swap(1, 998);

        Measurer.stop();
    }

    self.b_select = function(el){
        Measurer.start("select");
        self.unselect();

        var rowIndex = $.parent(el, '[sf-bind-list]');
        self.selected = rowIndex = sf.model.index(rowIndex);

        self.list[rowIndex].isSelected = true;
        self.list.softRefresh(rowIndex);
        Measurer.stop();
    }

    self.b_remove = function(el){
        Measurer.start("delete");

        var rowIndex = $.parent(el, '[sf-bind-list]');
        rowIndex = sf.model.index(rowIndex);

        self.list.splice(rowIndex, 1);

        if(rowIndex === self.selected)
            self.selected = -1;

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

// Fix for (https://github.com/krausest/js-framework-benchmark/pull/519#issuecomment-464855788)
sf(function(){
    tbody.innerHTML = 
    `<tr sf-repeat-this="x in list" class="{{ x.isSelected ? 'danger' : '' }}">
        <td class="col-md-1">{{ x.id }}</td>
        <td class="col-md-4">
            <a class="lbl" sf-click="b_select(this)">{{ x.label }}</a>
        </td>
        <td class="col-md-1">
         <a class="remove" sf-click="b_remove(this)">
           <span class="remove glyphicon glyphicon-remove" aria-hidden="true"></span>
         </a>
        </td>
        <td class="col-md-6"></td>
    </tr>`;

    sf.model.init(tbody);
});