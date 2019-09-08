const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const len_ADJECTIVES = ADJECTIVES.length;
const len_COLOURS = COLOURS.length;
const len_NOUNS = NOUNS.length;

let _nextId = 1;

export function buildData(count){

    if(count === 1){

        return {

            id: _nextId++,
            label: ADJECTIVES[_random(len_ADJECTIVES)] + " " + COLOURS[_random(len_COLOURS)] + " " + NOUNS[_random(len_NOUNS)]
        }
    }

    const data = new Array(count);

    for(let i = 0; i < count; i++){

        data[i] = {

            id: _nextId++,
            label: ADJECTIVES[_random(len_ADJECTIVES)] + " " + COLOURS[_random(len_COLOURS)] + " " + NOUNS[_random(len_NOUNS)]
        };
    }

    return data;
}

function _random(max){

    return (Math.random() * max) | 0;
}