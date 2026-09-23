/**
 * js-framework-benchmark row data for the OpenElement keyed implementation.
 *
 * Compiled modules ban runtime top-level statements (compiler diagnostic
 * OEC9008), so the generator and its word lists live in this ordinary module
 * and the compiled element imports them. The algorithm is the verbatim stock
 * JFB generator — same word lists, same _random, same module-level
 * monotonically increasing id counter as frameworks/keyed/vanillajs/src/Main.js
 * — so the rows are distributionally identical to every stock implementation.
 *
 * `id` starts at 1 and only resets on page reload, as the benchmark requires
 * (README section 4.1 note 6).
 */

export interface Row {
  id: number;
  label: string;
  /**
   * The row's class attribute value. JFB's select benchmark requires the
   * clicked row's <tr> to carry class "danger" and no other row to.
   *
   * It lives on the row because that is the only place grammar v1 can read a
   * per-row value from: an item template's attributes accept static literals or
   * `{item.<field>}` (and nothing else), so the class slot must be a field of
   * the item. The authoritative selection state stays a single `selected` id on
   * the element (see main.tsx), and this field is derived from it.
   */
  cls: string;
}

/**
 * The class JFB's select benchmark asserts on the clicked row. It lives here
 * rather than in main.tsx because compiled modules ban runtime top-level
 * statements (OEC9008).
 */
export const ROW_CLASS = 'danger';

let idCounter = 1;

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
];
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
];
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
];

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

export function buildData(count: number): Row[] {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${
        nouns[_random(nouns.length)]
      }`,
      cls: '',
    };
  }
  return data;
}
