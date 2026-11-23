export interface Row {
  readonly id: number
  readonly label: string
}

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
  'fancy',
] as const
const colours = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange',
] as const
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
  'keyboard',
] as const
let nextId = 1

// Та же последовательность id и обращений к Math.random, что у рукописного
// адаптера: оба варианта получают одинаковые строки при одном seed.
export function buildRows(count: number): readonly Row[] {
  return Array.from({ length: count }, () => ({
    id: nextId++,
    label: `${randomItem(adjectives)} ${randomItem(colours)} ${randomItem(nouns)}`,
  }))
}

function randomItem<Value>(values: readonly Value[]): Value {
  return values[Math.round(Math.random() * 1_000) % values.length]!
}
