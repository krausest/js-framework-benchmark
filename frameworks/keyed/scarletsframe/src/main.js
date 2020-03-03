var sf = window.sf = require('scarletsframe');

// Declare variable for the model
sf.model.for('bench-mark', function(self){
    self.list = [];
    self.selectedItem = null;

    // Handle button
    self.b_run = function(){
        self.list = Store.buildData();
        self.selectedItem = null;
    }

    self.b_runlots = function(){
        self.list = Store.buildData(10000);
        self.selectedItem = null;
    }

    self.b_add = function(){
        self.list = self.list.concat(Store.buildData(1000));
    }

    self.b_update = function(){
        for (var i = 0; i < self.list.length; i += 10) {
            self.list[i].label += ' !!!';
        }
    }

    self.b_clear = function(){
        self.list.splice(0);
        self.selectedItem = null;
    }

    self.b_swaprows = function(){
        if(self.list.length > 998)
            self.list.swap(1, 998);
    }

    self.b_select = function(item){
        // Reset last item selection
        if(self.selectedItem !== item && self.selectedItem !== null)
            self.selectedItem.selected = false;

        // Select current item
        item.selected = true;
        self.selectedItem = item;
    }

    self.b_remove = function(item){
        // Find item index from the list
        var i = self.list.indexOf(item);

        // Invalidate the selected item
        if(self.selectedItem === item)
            self.selectedItem = null;

        // Remove item and the element
        if(i !== -1)
            self.list.splice(i, 1);
    }
});


// ==== Other stuff ====
var Store = new function(){
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

    function _random(max) {
        return Math.round(Math.random()*1000)%max;
    }

    var nextId = 1;
    this.buildData = function(count = 1000){
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({
                id: nextId++,
                selected:'',
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
            });

        return data;
    }
};