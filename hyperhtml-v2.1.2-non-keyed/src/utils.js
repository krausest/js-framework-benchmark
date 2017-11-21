//

let startTime;
let lastMeasure;
export function startMeasure(name) {
  startTime = performance.now();
  lastMeasure = name;
}

export function stopMeasure() {
  const last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function metaStopMeasure() {
      lastMeasure = null;
      const stop = performance.now();
      const duration = 0;
      console.log(last + ' took ' + (stop - startTime));
    }, 0);
  }
}

//

let id = 1;

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

export function buildData(count) {
  count = count || 1000;
  return new Array(count).fill('').map(() => {
    return {
      id: id++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[
        _random(colours.length)
      ]} ${nouns[_random(nouns.length)]}`
    };
  });
}
