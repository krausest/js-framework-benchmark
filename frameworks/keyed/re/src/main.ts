/**
 * @zhenre — official js-framework-benchmark implementation (keyed)
 *
 * Uses only public @zhenre/core API, in its leanest form:
 *   - `rowRenderer()` — the compiled-row path: one HTML source, fixed slot
 *     paths, 50-row mega-template, ONE native cloneNode per batch
 *   - `mountRows()` — the DOM-anchored keyed view: the tbody IS the state.
 *     No shadow item array, no per-row JS objects — the engine provides
 *     detached batch builds, O(1) container clear and O(1) swap/remove.
 *     (The full reactive engine — signal/mountList/KeyedView — ships in the
 *     same package for apps that want data-array reconciliation.)
 *   - ids and labels live in the DOM only (ids generated from a sequence at
 *     build time); update/select/remove operate directly on the row nodes
 *   - event delegation on tbody (2 listeners total, same as the reference)
 */
import { rowRenderer, mountRows } from '@zhenre/core';

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

const ADJECTIVES = [
  'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful',
  'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
  'cheap', 'expensive', 'fancy',
];
const COLOURS = [
  'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange',
];
const NOUNS = [
  'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard',
];

let idSeq = 1;

function makeLabel(): string {
  return (
    ADJECTIVES[_random(ADJECTIVES.length)] +
    ' ' +
    COLOURS[_random(COLOURS.length)] +
    ' ' +
    NOUNS[_random(NOUNS.length)]
  );
}

/* ------------------------------------------------------------------ */
/* view                                                                */
/* ------------------------------------------------------------------ */

const tbody = document.getElementById('tbody')!;

// Compiled row renderer — the pattern @zhenre/compiler emits for keyed row
// templates. Slot values are generated per row at build time (id sequence +
// fresh label) and written straight into the template's hot text nodes, so
// nothing is allocated per row beyond the DOM itself.
const NO_ITEMS: readonly unknown[] = [];
let renderRows: ReturnType<typeof rowRenderer> | null = null;
function rows(): NonNullable<typeof renderRows> {
  return (renderRows ??= rowRenderer(
    '<tr><td class="col-md-1"></td><td class="col-md-4"><a></a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>',
    [
      [0, 0], // td1 > text  (id)
      [1, 0, 0], // td2 > a > text (label)
    ],
    {
      batch: 50,
      template: document.getElementById('re-tpl') as HTMLTemplateElement,
      values(_, texts) {
        texts[0]!.data = idSeq++ as unknown as string;
        texts[1]!.data = makeLabel();
      },
    },
  ));
}

const list = mountRows(tbody, (n, target) => rows().batch(NO_ITEMS, 0, n, target, null));

let selectedRow: HTMLElement | null = null;

/* ------------------------------------------------------------------ */
/* actions                                                             */
/* ------------------------------------------------------------------ */

function run(e: MouseEvent): void {
  e.stopPropagation();
  selectedRow = null;
  list.build(1000);
}

function runLots(e: MouseEvent): void {
  e.stopPropagation();
  selectedRow = null;
  list.build(10000);
}

function add(e: MouseEvent): void {
  e.stopPropagation();
  list.append(1000);
}

function update(e: MouseEvent): void {
  e.stopPropagation();
  // label text lives in the row node — read-modify-write it in place
  const kids = tbody.children;
  for (let i = 0, n = kids.length; i < n; i += 10) {
    const tr = kids[i] as HTMLElement;
    (tr.children[1]!.firstChild!.firstChild as Text).data += ' !!!';
  }
}

function clearAll(e: MouseEvent): void {
  e.stopPropagation();
  selectedRow = null;
  list.clear();
}

function swapRows(e: MouseEvent): void {
  e.stopPropagation();
  if (tbody.children.length > 998) list.swapAt(1, 998);
}

/* ------------------------------------------------------------------ */
/* events (delegation on tbody — same shape as the vanilla reference)  */
/* ------------------------------------------------------------------ */

function rowClick(e: MouseEvent): void {
  e.stopPropagation();
  const t = e.target as HTMLElement | null;
  if (t === null) return;
  const tag = t.tagName;
  if (tag === 'SPAN') {
    // remove glyph — the only <span> in a row (runner clicks td3>a>span);
    // fixed 3-hop walk, no loop, no HTMLCollection reads
    const tr = t.parentElement!.parentElement!.parentElement! as HTMLElement;
    if (tr === selectedRow) selectedRow = null;
    tr.remove();
    return;
  }
  // label anchor (td2>a) / remove anchor (td3>a) / bare td — one hop to td
  const td = tag === 'TD' ? t : tag === 'A' ? (t.parentElement as HTMLElement | null) : null;
  if (td === null) return;
  const tr = td.parentElement as HTMLElement;
  const cols = tr.children;
  if (cols[1] === td) {
    // label column -> select (O(1))
    if (selectedRow !== null) selectedRow.className = '';
    tr.className = 'danger';
    selectedRow = tr;
  } else if (cols[2] === td) {
    // remove column -> delete row (O(1): the row node is already in hand)
    if (tr === selectedRow) selectedRow = null;
    tr.remove();
  }
}

for (const [id, fn] of [
  ['run', run],
  ['runlots', runLots],
  ['add', add],
  ['update', update],
  ['clear', clearAll],
  ['swaprows', swapRows],
] as const) {
  document.getElementById(id)!.addEventListener('click', fn);
}

// one delegated row handler; stopPropagation keeps the click from reaching
// document-level observers (same shape as the vanilla references)
tbody.addEventListener('click', rowClick);
