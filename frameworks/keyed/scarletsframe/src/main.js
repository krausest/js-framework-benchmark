// var sf = window.sf = require('scarletsframe');
const sf = window.sf = require('scarletsframe/dist/scarletsframe.es6.js');

// Declare variable for the model
sf.model('benchmark', function(My){
    My.list = [];
    My.selectedItem = null;

    // Handle button
    My.run = function(){
        My.selectedItem = null;
        My.list = Store.buildData(1000);
    }

    My.runlots = function(){
        My.selectedItem = null;
        My.list = Store.buildData(10000);
    }

    My.add = function(){
        My.list.push(...Store.buildData(1000));
    }

    My.update = function(){
        for (var i = 0; i < My.list.length; i += 10)
            My.list[i].label += ' !!!';
    }

    My.clear = function(){
        My.list.splice(0);
        My.selectedItem = null;
    }

    My.swaprows = function(){
        if(My.list.length > 998)
            My.list.swap(1, 998);
    }

    My.remove = function(item){
        // Find item index from the list
        const i = My.list.indexOf(item);

        // Remove item and the element
        if(i !== -1)
            My.list.splice(i, 1);

        // Invalidate the selected item
        if(item === My.selectedItem)
            My.selectedItem = null;
    }
});


// ==== Other stuff ====
const Store = new function(){
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

    const _random = (max)=> Math.round(Math.random() * 1000) % max;

    let nextId = 1;
    this.buildData = function(count){
        let data = new Array(count);
        for (let i = 0; i < count; i++){
            data[i] = {
                id: nextId++,
                label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
            };
        }

        return data;
    }
};