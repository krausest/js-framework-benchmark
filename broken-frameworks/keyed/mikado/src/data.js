const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const len_ADJECTIVES = ADJECTIVES.length;
const len_COLOURS = COLOURS.length;
const len_NOUNS = NOUNS.length;

let nextId = 1;

export default function(count){

    const data = new Array(count);

    for(let i = 0; i < count; i++){

        data[i] = {

            "id": nextId++,
            "label": ADJECTIVES[random(len_ADJECTIVES)] + " " + COLOURS[random(len_COLOURS)] + " " + NOUNS[random(len_NOUNS)]
        };
    }

    return data;
}

function random(max){

    return (Math.random() * max) | 0;
}