import { signal } from 'sigwork';

const rand = max => Math.round(Math.random() * 1000) % max
const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

let rowId = 1
export function buildData(count = 1000) {
   const data = new Array(count);
   for (let i = 0; i < count; i++) {
      data[i] = {
         id: rowId++,
         label: signal(`${adjectives[rand(adjectives.length)]} ${colours[rand(colours.length)]} ${nouns[rand(nouns.length)]}`)
      }
   }
   return data;
}