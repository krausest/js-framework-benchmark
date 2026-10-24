export interface RowItem {
  label: string;
  id: number;
}

export function _random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

let id = 1;

export function buildData(count = 1000): RowItem[] {
  const adjectives = [
    'pretty',
    'large',
    'big',
    'small',
    'tall',
    'short',
    'long',
    'handsome',
    'plain',
    'quaint',
    'clean',
    'elegant',
    'easy',
    'angry',
    'crazy',
    'helpful',
    'mushy',
    'odd',
    'unsightly',
    'adorable',
    'important',
    'inexpensive',
    'cheap',
    'expensive',
    'fancy'
  ];
  const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];

  const nouns = [
    'table',
    'chair',
    'house',
    'bbq',
    'desk',
    'car',
    'pony',
    'cookie',
    'sandwich',
    'burger',
    'pizza',
    'mouse',
    'keyboard'
  ];
  const data = [];

  for (let i = 0; i < count; i++) {
    const adjective = adjectives[_random(adjectives.length)];
    const color = colors[_random(colors.length)];
    const noun = nouns[_random(nouns.length)];
    const label = `${adjective} ${color} ${noun}`;

    data.push({ id, label });

    id++;
  }

  return data;
}
