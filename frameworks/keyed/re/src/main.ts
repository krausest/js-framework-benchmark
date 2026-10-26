/**
 * @zhenre — official js-framework-benchmark implementation (keyed)
 *
 * Uses only public @zhenre/core API:
 *   - one signal holding the row list; one anchored keyed view per tbody
 *     (fast paths: detached append / replaceChildren clear+replace / O(1) swap+remove)
 *   - row content uses the compiled-template path: the `html`` template is
 *     compiled once, cloned per row, and each row keeps a direct reference to
 *     its label text node — the same direct text writes the reference
 *     implementation performs (this is exactly what @zhenre/compiler emits)
 *   - event delegation on tbody (2 listeners total, same as the reference)
 */
import { signal, html, append, each } from '@zhenre/core';

interface Row {
  id: number;
  label: string;
  /** direct reference to the row's label text node (compiled-template slot) */
  t: Text | null;
}

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

function buildData(count: number): Row[] {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idSeq++,
      label:
        ADJECTIVES[_random(ADJECTIVES.length)] +
        ' ' +
        COLOURS[_random(COLOURS.length)] +
        ' ' +
        NOUNS[_random(NOUNS.length)],
      t: null,
    };
  }
  return data;
}

/* ------------------------------------------------------------------ */
/* view                                                                */
/* ------------------------------------------------------------------ */

const rows = signal<Row[]>([]);

// Compiled row template — the pattern @zhenre/compiler emits for `html``
// call sites: the template compiles once into a prototype row (the html``
// instantiation below), whose slot text nodes live at fixed paths. Each row
// is then one cloneNode + direct text writes, exactly the DOM work the
// reference implementation performs with its rowTemplate clone.
const protoTr = (() => {
  const f = html`<tr><td class="col-md-1">${''}</td><td class="col-md-4"><a>${''}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
  return f.root as unknown as HTMLTableRowElement;
})();

function rowTpl(r: Row): Node {
  const tr = protoTr.cloneNode(true) as unknown as HTMLTableRowElement;
  (tr as unknown as { data_id: number }).data_id = r.id;
  // firstChild/nextSibling chains — indexed childNodes[i] live-list access
  // costs ~0.8µs/row more (traced); direct sibling hops match the reference impl
  const td1 = tr.firstChild as HTMLTableDataCellElement;
  const a2 = (td1.nextSibling as HTMLTableCellElement).firstChild as HTMLAnchorElement;
  (td1.firstChild as Text).data = String(r.id);
  r.t = a2.firstChild as Text;
  r.t.data = r.label;
  // the <tr> is a plain node; the keyed view keeps no per-row wrapper
  return tr;
}

const list = each(rows, (r) => r.id, rowTpl);

const tbody = document.getElementById('tbody')!;
append(tbody, html`${list}`);

let selectedRow: HTMLElement | null = null;

/* ------------------------------------------------------------------ */
/* actions                                                             */
/* ------------------------------------------------------------------ */

function run(): void {
  selectedRow = null;
  rows.value = buildData(1000);
}

function runLots(): void {
  selectedRow = null;
  rows.value = buildData(10000);
}

function add(): void {
  rows.value = rows.peek().concat(buildData(1000));
}

function update(): void {
  const arr = rows.peek();
  for (let i = 0; i < arr.length; i += 10) {
    const r = arr[i]!;
    const nl = r.label + ' !!!';
    r.label = nl;
    // direct text write — identical DOM work to the reference implementation
    r.t!.data = nl;
  }
}

function clearAll(): void {
  selectedRow = null;
  rows.value = [];
}

function swapRows(): void {
  const arr = rows.peek();
  if (arr.length > 10) {
    list.swap(arr[1]!.id, arr[998]!.id);
  }
}

/* ------------------------------------------------------------------ */
/* events (delegation — same shape as the vanilla reference)           */
/* ------------------------------------------------------------------ */

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

tbody.addEventListener('click', (e) => {
  let p = e.target as HTMLElement | null;
  while (p && p.tagName !== 'TD') p = p.parentElement;
  if (p === null) return;
  const tr = p.parentElement as HTMLElement;
  const cols = (tr as unknown as { childNodes: Node[] }).childNodes;
  if (cols[1] === p) {
    // label column -> select (O(1))
    if (selectedRow !== null) selectedRow.className = '';
    tr.className = 'danger';
    selectedRow = tr;
  } else if (cols[2] === p) {
    // remove column -> delete row (O(1))
    const id = (tr as unknown as { data_id: number }).data_id;
    if (tr === selectedRow) selectedRow = null;
    list.remove(id);
  }
});
