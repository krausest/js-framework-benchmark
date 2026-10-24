let idCounter = 1;

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];

const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];

const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function random(max) { return Math.round(Math.random() * 1000) % max; };

export type DataEntry = { id: string; label: string };

export function buildData(count): DataEntry[] {
    let data = new Array<DataEntry>(count);
    for (let i = 0; i < count; i++) {
        data[i] = {
            id: `${idCounter++}`,
            label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`
        }
    }
    return data;
}