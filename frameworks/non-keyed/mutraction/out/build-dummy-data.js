function choose(words) {
    return words[Math.floor(Math.random() * words.length)];
}
let id = 1;
const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
export function buildData(count = 1000) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const label = `${choose(adjectives)} ${choose(colors)} ${choose(nouns)}`;
        data.push({ id, label });
        id++;
    }
    return data;
}
