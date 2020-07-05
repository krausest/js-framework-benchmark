let ID = 1;
let startTime;
let lastMeasure;

export const startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};

export const stopMeasure = function() {
    const last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            const stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
};

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export function buildData(count = 1000) {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
        	id: ID++,
        	label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)],
        });
    }
    return data;
}