import { rows, selectedId, run, runLots, add, update, clear, swapRows, removeRow, select } from "./store.js";

const tbody = document.querySelector("tbody");
const template = document.getElementById("row-template");
const dataMap = new Map();
let prevSelectedId = null;

rows.subscribe((newRows) => {
  const newIds = new Set();
  for (let i = 0; i < newRows.length; i++) {
    const item = newRows[i];
    newIds.add(item.id);
    let tr = dataMap.get(item.id);
    if (tr) {
      if (tr._label !== item.label) {
        tr._label = item.label;
        tr.children[1].firstElementChild.firstChild.nodeValue = item.label;
      }
    } else {
      tr = template.content.cloneNode(true).firstElementChild;
      tr.firstElementChild.textContent = item.id;
      tr._label = item.label;
      const a = tr.children[1].firstElementChild;
      a.appendChild(document.createTextNode(item.label));
      dataMap.set(item.id, tr);
    }
  }
  for (const [id, tr] of dataMap) {
    if (!newIds.has(id)) tr.remove();
  }
  let refNode = null;
  for (let i = newRows.length - 1; i >= 0; i--) {
    const tr = dataMap.get(newRows[i].id);
    if (tr.parentNode !== tbody || tr.nextSibling !== refNode) {
      tbody.insertBefore(tr, refNode);
    }
    refNode = tr;
  }
});

selectedId.subscribe((newId) => {
  if (prevSelectedId !== null) {
    const tr = dataMap.get(prevSelectedId);
    if (tr) tr.classList.remove("danger");
  }
  if (newId !== null) {
    const tr = dataMap.get(newId);
    if (tr) tr.classList.add("danger");
  }
  prevSelectedId = newId;
});

tbody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = parseInt(tr.firstElementChild.textContent, 10);
  const td = e.target.closest("td");
  if (td && td.cellIndex === 1) {
    select(id);
  } else if (td && td.cellIndex === 2) {
    removeRow(id);
  }
});

document.getElementById("main").addEventListener("click", (e) => {
  switch (e.target.id) {
    case "run": run(); break;
    case "runlots": runLots(); break;
    case "add": add(); break;
    case "update": update(); break;
    case "clear": clear(); break;
    case "swaprows": swapRows(); break;
  }
});
