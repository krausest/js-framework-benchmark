import { rows, selectedId, run, runLots, add, update, clear, swapRows, removeRow, select } from "./store.js";

const tbody = document.getElementById("tbody");
const template = document.getElementById("trow");
const rowMap = new Map();

function createRow(data) {
  const tr = template.content.firstElementChild.cloneNode(true);
  tr.children[0].textContent = data.id;
  tr.children[1].firstChild.textContent = data.label;
  return tr;
}

rows.subscribe((data) => {
  const currentIds = new Set();
  for (let i = 0; i < data.length; i++) {
    currentIds.add(data[i].id);
  }

  for (const [id, tr] of rowMap) {
    if (!currentIds.has(id)) {
      tr.remove();
      rowMap.delete(id);
    }
  }

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    let tr;
    if (rowMap.has(data[i].id)) {
      tr = rowMap.get(data[i].id);
      const labelNode = tr.children[1].firstChild;
      if (labelNode.textContent !== data[i].label) {
        labelNode.textContent = data[i].label;
      }
    } else {
      tr = createRow(data[i]);
      rowMap.set(data[i].id, tr);
    }
    fragment.appendChild(tr);
  }

  tbody.textContent = "";
  tbody.appendChild(fragment);
});

selectedId.subscribe((id) => {
  for (const [rowId, tr] of rowMap) {
    tr.className = rowId === id ? "danger" : "";
  }
});

document.getElementById("run").onclick = run;
document.getElementById("runlots").onclick = runLots;
document.getElementById("add").onclick = add;
document.getElementById("update").onclick = update;
document.getElementById("clear").onclick = clear;
document.getElementById("swaprows").onclick = swapRows;

tbody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = parseInt(tr.children[0].textContent);

  const tag = e.target.tagName;
  if (tag === "SPAN" || (tag === "A" && e.target.firstElementChild)) {
    removeRow(id);
  } else if (tag === "A") {
    select(id);
  }
});
