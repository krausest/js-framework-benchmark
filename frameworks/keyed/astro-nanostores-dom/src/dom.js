import { rows, selectedId, actions, run, runLots, add, update, clear, swapRows, removeRow, select } from "./store.js";

const tbody = document.querySelector("tbody");
const template = document.getElementById("row-template");

actions.subscribe((cmd) => {
  if (!cmd) return;

  switch (cmd.type) {
    case "set": {
      rows.set(cmd.data);
      selectedId.set(null);
      tbody.replaceChildren();

      const frag = document.createDocumentFragment();
      for (const id of cmd.ids) {
        const item = cmd.data[id];
        const tr = template.content.cloneNode(true).firstElementChild;
        tr.firstElementChild.textContent = item.id;
        const a = tr.children[1].firstElementChild;
        a.appendChild(document.createTextNode(item.label));
        item._el = tr;
        frag.appendChild(tr);
      }
      tbody.appendChild(frag);
      break;
    }

    case "append": {
      const obj = { ...rows.get() };
      const frag = document.createDocumentFragment();
      for (const item of cmd.data) {
        obj[item.id] = item;
        const tr = template.content.cloneNode(true).firstElementChild;
        tr.firstElementChild.textContent = item.id;
        const a = tr.children[1].firstElementChild;
        a.appendChild(document.createTextNode(item.label));
        item._el = tr;
        frag.appendChild(tr);
      }
      rows.set(obj);
      tbody.appendChild(frag);
      break;
    }

    case "update": {
      for (const id of cmd.ids) {
        const item = rows.get()[id];
        item.label += " !!!";
        item._el.children[1].firstElementChild.firstChild.nodeValue = item.label;
      }
      break;
    }

    case "swap": {
      const rowsData = rows.get();
      const trA = rowsData[cmd.a]._el;
      const trB = rowsData[cmd.b]._el;
      const refForA = trB.nextSibling;
      tbody.insertBefore(trB, trA);
      tbody.insertBefore(trA, refForA);
      break;
    }

    case "remove": {
      const rowsData = rows.get();
      rowsData[cmd.id]._el.remove();
      const obj = { ...rowsData };
      delete obj[cmd.id];
      rows.set(obj);
      break;
    }

    case "clear": {
      tbody.replaceChildren();
      rows.set({});
      selectedId.set(null);
      break;
    }
  }
});

selectedId.subscribe((newId) => {
  const prev = tbody.querySelector(".danger");
  if (prev) prev.classList.remove("danger");
  if (newId !== null) {
    rows.get()[newId]._el.classList.add("danger");
  }
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
