// yoya-ui implementation (keyed): rows are reconciled through a keyed keySet; the selection stores
// only the selected key, and row state lives on each row's own api, so a click writes just two rows
// (clear the previous selection, set the current one).
//
// This source file is shared by both entries and is byte-identical in each: keyed/yoya-ui-runtime
// interprets it as-is, while keyed/yoya-ui-ast replaces the buildRow call below with the library
// compiler's equivalent output at build time (static fragment + positional writes). The
// application code itself contains nothing build-related.
// Both entries use the published npm packages: `npm install && npm run build-prod` (the entry point
// required by the benchmark).
import { keySet, ref, table, tr, vText } from '@yoyaflow/yoya-ui/core';

// Benchmark contract: row ids increase globally ("run" does not reset them); label text is free-form,
// but "update" must append ' !!!'
let nextId = 1;

const labelOf = (id) => `label ${id}`;

// The selection stores only the key, never a row reference: a removed row would leave that reference
// stale, while a key lookup in the container always resolves to the live row.
const selectedId = ref(null);

/** Row state hangs off the per-key api owned by the container: same key, same api, so replacing the
 * data or reordering rows never loses it. */
const rows = keySet([], (row) => row.id, (item) => {
  item.api.selected = ref(false);
  item.api.selectRow = () => {
    const previous = rows.item(selectedId.value);
    if (previous) {
      previous.api.selected.value = false;
    }
    item.api.selected.value = true;
    selectedId.value = item.data.id;
  };
});

function buildRows(count) {
  const list = [];
  for (let index = 0; index < count; index += 1) {
    const id = nextId++;
    list.push({ id, label: ref(labelOf(id)) });
  }
  return list;
}

/** Row markup: the compiled entry swaps only this function for compiler output, the rest of the file
 * stays untouched. */
function buildRow(item) {
  return tr((line) => {
    line.td((cell) => cell.className('col-md-1').child(String(item.data.id)));
    line.td((cell) => {
      cell.className('col-md-4');
      cell.a((link) => link.child(vText(item.data.label)));
    });
    line.td((cell) => {
      cell.className('col-md-1');
      cell.a((link) => {
        link.span((icon) => icon.className('glyphicon glyphicon-remove').attr('aria-hidden', 'true'));
        link.on('click', (event) => {
          event.stopPropagation();
          removeRow(item.data.id);
        });
      });
    });
    line.td((cell) => cell.className('col-md-6'));
    // The row's "danger" class is bound to the row's own api: one click writes two rows.
    line.toggleClass('danger', item.api.selected);
    line.on('click', () => {
      item.api.selectRow();
    });
  });
}

function removeRow(id) {
  if (selectedId.value === id) {
    selectedId.value = null; // the removed row was selected: clear it (same as the reference unselect)
  }
  rows.remove(id);
}

// Table shell (built once): identical structure in both entries, rows reconciled declaratively.
const tableView = table((node) => {
  node.className('table table-hover table-striped test-data');
  node.tbody((body) => {
    body.attr('id', 'tbody');
    body.keyed(rows, buildRow);
  });
});
tableView.bindTo('#table-host');

const run = () => {
  selectedId.value = null;
  rows.replaceAll(buildRows(1000));
};

const runLots = () => {
  selectedId.value = null;
  rows.replaceAll(buildRows(10000));
};

const add = () => {
  selectedId.value = null;
  rows.replaceAll([...rows.values(), ...buildRows(1000)]);
};

const update = () => {
  rows.values().forEach((row, index) => {
    if (index % 10 === 0) {
      row.label.value = `${row.label.value} !!!`;
    }
  });
};

const clear = () => {
  selectedId.value = null;
  rows.replaceAll([]);
};

const swapRows = () => {
  const current = rows.values();
  if (current.length <= 998) {
    return;
  }

  const next = current.slice();
  next[1] = current[998];
  next[998] = current[1];
  rows.replaceAll(next);
};

document.getElementById('run').addEventListener('click', run);
document.getElementById('runlots').addEventListener('click', runLots);
document.getElementById('add').addEventListener('click', add);
document.getElementById('update').addEventListener('click', update);
document.getElementById('clear').addEventListener('click', clear);
document.getElementById('swaprows').addEventListener('click', swapRows);
