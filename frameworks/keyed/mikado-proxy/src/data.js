const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const len_ADJECTIVES = ADJECTIVES.length;
const len_COLOURS = COLOURS.length;
const len_NOUNS = NOUNS.length;

let nextId = 1;

/**
 * @param store
 * @param {number} count
 * @param {boolean=} append
 */

export default function(store, count, append){

    let i = store.length;

    if(append){

        count += i;
    }
    else if(i){

        store.splice(0);
        i = 0;
    }

    for(; i < count; i++){

        store[i] = {

            "id": nextId++,
            "label": ADJECTIVES[random(len_ADJECTIVES)] + " " + COLOURS[random(len_COLOURS)] + " " + NOUNS[random(len_NOUNS)]
        };
    }
}

function random(max){

    return (Math.random() * max) | 0;
}