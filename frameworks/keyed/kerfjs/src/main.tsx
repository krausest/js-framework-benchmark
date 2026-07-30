/**
 * kerfjs entry for krausest js-framework-benchmark — keyed.
 *
 * Rows live in an `arraySignal`, so the structural scenarios produce granular
 * patch events the keyed-list reconciler applies in O(changes) rather than
 * iterating all N items on every render:
 *
 *   - Append:   N inserts (no full re-render).
 *   - Update:   N updates (touches only the changed rows).
 *   - Swap:     1 move (1 insertBefore).
 *   - Remove:   1 remove.
 *   - Create:   first render, no granular wins available — same speed as before.
 *
 * Selection is tracked as a single `selectedId` signal (the upstream-preferred
 * shape — one id for the whole table, not a per-row flag). `each()`'s `cacheKey`
 * reads `selectedId` so only the two rows whose selected-ness flipped are
 * re-rendered; the snapshot reconciler's in-place fast path then morphs just
 * those two rows in their existing DOM nodes (no node replacement, no table
 * relayout), matching the select-row cost of every other framework.
 */

import { arraySignal } from 'kerfjs/array-signal';
import { batch, delegate, each, mount, signal } from 'kerfjs';

interface Row {
  id: number;
  label: string;
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

let nextId = 1;

function pick(arr: string[]): string {
  return arr[(Math.random() * arr.length) | 0];
}

function buildData(count: number): Row[] {
  const data = new Array<Row>(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${pick(ADJECTIVES)} ${pick(COLOURS)} ${pick(NOUNS)}`,
    };
  }
  return data;
}

const rows = arraySignal<Row>([]);
const selectedId = signal(-1);

const root = document.getElementById('main')!;

mount(root, () => (
  <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6"><h1>kerfjs-keyed</h1></div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="run">Create 1,000 rows</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="add">Append 1,000 rows</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="update">Update every 10th row</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="clear">Clear</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="swaprows">Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data">
      <tbody id="tbody">
        {each(
          rows,
          (row) => (
            <tr data-key={row.id} className={row.id === selectedId.value ? 'danger' : ''}>
              <td className="col-md-1">{String(row.id)}</td>
              <td className="col-md-4"><a className="lbl" data-id={String(row.id)}>{row.label}</a></td>
              <td className="col-md-1"><a className="remove" data-id={String(row.id)}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
              <td className="col-md-6"></td>
            </tr>
          ),
          // cacheKey: re-render a row only when its selected-ness flips. The
          // in-place fast path then morphs just the two affected rows.
          (row) => row.id === selectedId.value,
        )}
      </tbody>
    </table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
));

delegate(root, 'click', '#run', () => {
  batch(() => {
    selectedId.value = -1;
    rows.replace(buildData(1000));
  });
});
delegate(root, 'click', '#runlots', () => {
  batch(() => {
    selectedId.value = -1;
    rows.replace(buildData(10000));
  });
});
delegate(root, 'click', '#add', () => {
  // Append 1k rows via individual insert events. Wrap in batch() so all
  // 1k inserts coalesce into a single mount re-render that drains the
  // whole patch queue in one granular reconcile pass.
  batch(() => {
    const additions = buildData(1000);
    const startIndex = rows.value.length;
    for (let i = 0; i < additions.length; i++) {
      rows.insert(startIndex + i, additions[i]);
    }
  });
});
delegate(root, 'click', '#update', () => {
  // Update every 10th row via granular .update events, batched.
  batch(() => {
    const len = rows.value.length;
    for (let i = 0; i < len; i += 10) {
      rows.update(i, (r) => ({ ...r, label: r.label + ' !!!' }));
    }
  });
});
delegate(root, 'click', '#clear', () => {
  batch(() => {
    selectedId.value = -1;
    rows.replace([]);
  });
});
delegate(root, 'click', '#swaprows', () => {
  if (rows.value.length <= 998) return;
  // Two granular moves, batched into a single re-render.
  batch(() => {
    rows.move(998, 1);
    rows.move(2, 998);  // after the first move, the original row at 1 is now at index 2
  });
});
delegate(root, 'click', 'a.lbl', (_e, el) => {
  const id = (el as HTMLElement).dataset.id;
  if (id === undefined) return;
  // Single signal write — the cacheKey + in-place fast path re-render only the
  // previously- and newly-selected rows.
  selectedId.value = Number(id);
});
delegate(root, 'click', 'a.remove', (_e, el) => {
  const id = (el as HTMLElement).dataset.id;
  if (id === undefined) return;
  const target = Number(id);
  const items = rows.value;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === target) {
      rows.remove(i);
      break;
    }
  }
});
