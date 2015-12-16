/**
 * Created by stef on 17.11.15.
 */

'use strict';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

// model
var Store = {
    selected : undefined,
    data : [],
    id : 1,
    remove: function(id) {
        const idx = this.data.findIndex(d => d.id==id);
        console.log("delete idx ",idx);
        this.data.splice(idx, 1);
    },
    buildData: function(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    },
    run: function() {
        this.data = this.buildData();
        this.selected = undefined;
    },
    update : function(mod=10) {
        this.data = this.data.map((data, index) => {
            if (index % mod ==0) {
                return Object.assign({}, data, {label: data.label+"."});
            } else {
                return data;
            }
        });
        this.selected = undefined;
    },
    add : function() {
        this.data = [].concat(this.data, this.buildData(10));
        console.log("this.dada")
        this.selected = undefined;
    },
    select: function(id) {
        this.selected = id;
    }
};

export default Store;