import { grain, WritableGrain } from '@grainular/grains';

export type Item = { id: number; label: WritableGrain<string> };

// prettier-ignore
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
// prettier-ignore
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
// prettier-ignore
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

// The current id tracker, needs to start at 1, hard req
let nextId = 1;

const random = (max: number) => Math.round(Math.random() * 1000) % max;
export const createItems = (count: number): Item[] => {
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
        data[i] = {
            id: nextId++,
            label: grain(
                adjectives[random(adjectives.length)] +
                    ' ' +
                    colours[random(colours.length)] +
                    ' ' +
                    nouns[random(nouns.length)],
            ),
        };
    }
    return data;
};
