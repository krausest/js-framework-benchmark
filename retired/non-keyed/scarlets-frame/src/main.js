import { model } from "scarletsframe";

// Create template model
model('benchmark', function(My){
    My.list = [];
    My.selectedItem = null;

    // Handle button
    My.run = function(){
        My.selectedItem = null;
        My.list.assign(Store.buildData(1000));
    }

    My.runlots = function(){
        My.selectedItem = null;
        My.list.assign(Store.buildData(10000));
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
    	// Copy the object value
        var ref = {...My.list[1]};

        // Swap values between object
        My.list.assign(1, My.list[998]);
        My.list.assign(998, ref);
    }

    My.select = function(item){
        // Reset last item selection
        if(My.selectedItem !== item && My.selectedItem !== null)
            My.selectedItem.selected = false;

        // Select current item
        item.selected = true;
        My.selectedItem = item;
    }

    My.remove = function(item){
        // Find item index from the list
        var i = My.list.indexOf(item);

        // Remove item and the element
        if(i !== -1)
            My.list.splice(i, 1);

        // Invalidate the selected item
        if(My.selectedItem === item)
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