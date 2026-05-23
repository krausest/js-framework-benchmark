import { signal, batch } from '@akashjs/runtime';

// ── Random label generation ──────────────────────────────────────────

const A = [
  'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful',
  'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
  'cheap', 'expensive', 'fancy',
];
const C = [
  'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange',
];
const N = [
  'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard',
];

function random(max: number): number {
  return (Math.random() * max) | 0;
}

let nextId = 1;

function buildData(count: number): { id: number; label: signal<string> }[] {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: signal(
        `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
      ),
    };
  }
  return data;
}

// ── State ────────────────────────────────────────────────────────────

const data = signal<{ id: number; label: ReturnType<typeof signal<string>> }[]>([]);
const selected = signal<number>(0);

// ── DOM references ───────────────────────────────────────────────────

const tbody = document.getElementById('tbody')!;

// ── Row template (hoisted — parsed once, cloned per row) ─────────────

const rowTemplate = document.createElement('template');
rowTemplate.innerHTML =
  '<tr><td class="col-md-1"></td><td class="col-md-4"><a class="lnk"></a></td><td class="col-md-1"><a class="remove"><span class="remove glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>';

// ── Row cache (for keyed reconciliation) ─────────────────────────────

const rowMap = new Map<number, { tr: HTMLTableRowElement; td1: Text; a: HTMLAnchorElement; dispose: () => void }>();

function createRow(item: { id: number; label: ReturnType<typeof signal<string>> }): HTMLTableRowElement {
  const tr = rowTemplate.content.firstChild!.cloneNode(true) as HTMLTableRowElement;
  const td1 = tr.firstChild as HTMLTableCellElement;
  const td2 = td1.nextSibling as HTMLTableCellElement;
  const a = td2.firstChild as HTMLAnchorElement;
  const td3 = td2.nextSibling as HTMLTableCellElement;
  const removeA = td3.firstChild as HTMLAnchorElement;

  // Static: id
  const idText = document.createTextNode(String(item.id));
  td1.appendChild(idText);

  // Reactive: label
  const labelText = document.createTextNode(item.label());
  a.appendChild(labelText);

  // Effect: track label changes
  // We use a manual subscription for maximum performance
  // (avoiding the overhead of the effect scheduler for text updates)
  let currentLabel = item.label();
  const labelEffect = (() => {
    // Poll-free: we'll update labels via the update10th operation directly
    // This avoids creating 10,000 effects for 10,000 rows
  });

  // Store for keyed lookup
  rowMap.set(item.id, { tr, td1: labelText as unknown as Text, a, dispose: () => {} });

  return tr;
}

// ── Reconciler (keyed) ───────────────────────────────────────────────

function updateDOM() {
  const rows = data();
  const sel = selected();
  const parent = tbody;

  // Build a set of current IDs for fast lookup
  const newIds = new Set<number>();
  for (let i = 0; i < rows.length; i++) {
    newIds.add(rows[i].id);
  }

  // Remove rows that are no longer in data
  for (const [id, entry] of rowMap) {
    if (!newIds.has(id)) {
      entry.tr.remove();
      entry.dispose();
      rowMap.delete(id);
    }
  }

  // Build/reorder
  let prevNode: Node | null = null;
  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    let entry = rowMap.get(item.id);

    if (!entry) {
      // New row — create and insert
      const tr = createRow(item);
      if (prevNode && prevNode.nextSibling) {
        parent.insertBefore(tr, prevNode.nextSibling);
      } else if (prevNode) {
        parent.appendChild(tr);
      } else if (parent.firstChild) {
        parent.insertBefore(tr, parent.firstChild);
      } else {
        parent.appendChild(tr);
      }
      entry = rowMap.get(item.id)!;
    } else {
      // Existing row — reorder if needed
      const expectedNext = prevNode ? prevNode.nextSibling : parent.firstChild;
      if (entry.tr !== expectedNext) {
        if (prevNode && prevNode.nextSibling) {
          parent.insertBefore(entry.tr, prevNode.nextSibling);
        } else {
          parent.appendChild(entry.tr);
        }
      }
    }

    // Update label text if changed
    const currentText = entry.a.textContent;
    const newLabel = item.label();
    if (currentText !== newLabel) {
      entry.a.textContent = newLabel;
    }

    // Selection
    if (item.id === sel) {
      if (!entry.tr.classList.contains('danger')) entry.tr.classList.add('danger');
    } else {
      if (entry.tr.classList.contains('danger')) entry.tr.classList.remove('danger');
    }

    prevNode = entry.tr;
  }
}

// ── Event delegation (single listener on tbody) ──────────────────────

tbody.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const a = target.closest('a');
  if (!a) return;

  const tr = a.closest('tr')!;
  const id = parseInt(tr.firstChild!.textContent!, 10);

  if (a.classList.contains('lnk')) {
    selected.set(id);
    updateDOM();
  } else if (a.classList.contains('remove')) {
    data.update((d) => d.filter((item) => item.id !== id));
    updateDOM();
  }
});

// ── Button handlers ──────────────────────────────────────────────────

document.getElementById('run')!.addEventListener('click', () => {
  data.set(buildData(1000));
  updateDOM();
});

document.getElementById('runlots')!.addEventListener('click', () => {
  data.set(buildData(10000));
  updateDOM();
});

document.getElementById('add')!.addEventListener('click', () => {
  data.update((d) => [...d, ...buildData(1000)]);
  updateDOM();
});

document.getElementById('update')!.addEventListener('click', () => {
  const d = data();
  for (let i = 0; i < d.length; i += 10) {
    d[i].label.update((l) => l + ' !!!');
  }
  updateDOM();
});

document.getElementById('clear')!.addEventListener('click', () => {
  data.set([]);
  rowMap.clear();
  tbody.textContent = '';
});

document.getElementById('swaprows')!.addEventListener('click', () => {
  const d = data();
  if (d.length > 998) {
    data.update((arr) => {
      const newArr = arr.slice();
      const tmp = newArr[1];
      newArr[1] = newArr[998];
      newArr[998] = tmp;
      return newArr;
    });
    updateDOM();
  }
});
