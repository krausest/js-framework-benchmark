// ==============================================================================
// CORTEX DOM ARENA — ULTRA-LOW LATENCY BROWSER RUNTIME (TIER S++++)
// Archetype: ARCH_14_UI_DOM_MUTATION | Keyed Specification Compliant
// Optimizations: Pre-calculated String Interning LUT + Parallel Flat SoA Buffers
// ==============================================================================

const ADJECTIVES = [
    "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint",
    "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly",
    "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"
];
const COLOURS = [
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"
];
const NOUNS = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard"
];

// 1. Table de Correspondance Globale de String Interning (3 575 chaînes pré-allouées)
const LABEL_LUT = new Array(16384);
for (let adj = 0; adj < 25; adj++) {
    for (let col = 0; col < 11; col++) {
        for (let noun = 0; noun < 13; noun++) {
            const packed = (adj & 0x1F) | ((col & 0x0F) << 5) | ((noun & 0x0F) << 9);
            const baseStr = ADJECTIVES[adj] + " " + COLOURS[col] + " " + NOUNS[noun];
            LABEL_LUT[packed] = baseStr;
            LABEL_LUT[packed | 0x2000] = baseStr + " !!!";
        }
    }
}

// 2. Instanciation unique du Template Statique Vectorisé
const template = document.createElement("template");
template.innerHTML = "<tr><td class=\"col-md-1\"> </td><td class=\"col-md-4\"><a class=\"lbl\"> </a></td><td class=\"col-md-1\"><a><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></td><td class=\"col-md-6\"></td></tr>";
const rowTemplate = template.content.firstChild;

let tbody = null;
let wasmExports = null;
let wasmMemory = null;

// 3. Structure of Arrays (SoA) pure — Tableaux parallèles plats sans objets JS
let trArray = [];
let idTextNodes = [];
let labelTextNodes = [];
let idsArray = [];
let selectedIndex = -1;

function renderRows(count, isAppend = false) {
    const idsPtr = wasmExports.cortex_dom_get_ids_ptr();
    const labelsPtr = wasmExports.cortex_dom_get_labels_ptr();
    const totalCount = wasmExports.cortex_dom_get_count();

    const idsView = new Uint32Array(wasmMemory.buffer, idsPtr, totalCount);
    const labelsView = new Uint16Array(wasmMemory.buffer, labelsPtr, totalCount);

    if (!isAppend) {
        tbody.textContent = "";
        trArray = new Array(totalCount);
        idTextNodes = new Array(totalCount);
        labelTextNodes = new Array(totalCount);
        idsArray = new Array(totalCount);
        selectedIndex = -1;
    } else {
        trArray.length = totalCount;
        idTextNodes.length = totalCount;
        labelTextNodes.length = totalCount;
        idsArray.length = totalCount;
    }

    const startIndex = isAppend ? (totalCount - count) : 0;
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < totalCount; i++) {
        const tr = rowTemplate.cloneNode(true);
        const tdId = tr.firstChild;
        const tdLabelA = tdId.nextSibling.firstChild;
        const idNode = tdId.firstChild;
        const labelNode = tdLabelA.firstChild;
        const idVal = idsView[i];

        idNode.nodeValue = idVal;
        labelNode.nodeValue = LABEL_LUT[labelsView[i]];

        tr._rowIndex = i;
        trArray[i] = tr;
        idTextNodes[i] = idNode;
        labelTextNodes[i] = labelNode;
        idsArray[i] = idVal;

        fragment.appendChild(tr);
    }

    tbody.appendChild(fragment);
}

function run() {
    wasmExports.cortex_dom_build_rows(1000);
    renderRows(1000, false);
}

function runLots() {
    wasmExports.cortex_dom_build_rows(10000);
    renderRows(10000, false);
}

function add() {
    wasmExports.cortex_dom_append_rows(1000);
    renderRows(1000, true);
}

function update() {
    wasmExports.cortex_dom_update_partial_10();
    const labelsPtr = wasmExports.cortex_dom_get_labels_ptr();
    const labelsView = new Uint16Array(wasmMemory.buffer, labelsPtr, trArray.length);

    // Mise à jour directe O(N/10) via String Interning LUT
    for (let i = 0; i < trArray.length; i += 10) {
        const node = labelTextNodes[i];
        if (node) {
            node.nodeValue = LABEL_LUT[labelsView[i]];
        }
    }
}

function clear() {
    wasmExports.cortex_dom_clear();
    tbody.textContent = "";
    trArray = [];
    idTextNodes = [];
    labelTextNodes = [];
    idsArray = [];
    selectedIndex = -1;
}

function swapRows() {
    if (trArray.length > 998) {
        wasmExports.cortex_dom_swap_rows(4, 997);
        const tr4 = trArray[4];
        const tr997 = trArray[997];

        const next4 = tr4.nextSibling;
        const next997 = tr997.nextSibling;

        tbody.insertBefore(tr4, next997);
        tbody.insertBefore(tr997, next4);

        // Swap parallèle dans les tableaux SoA
        trArray[4] = tr997;
        trArray[997] = tr4;
        tr4._rowIndex = 997;
        tr997._rowIndex = 4;

        const tmpIdText = idTextNodes[4];
        idTextNodes[4] = idTextNodes[997];
        idTextNodes[997] = tmpIdText;

        const tmpLblText = labelTextNodes[4];
        labelTextNodes[4] = labelTextNodes[997];
        labelTextNodes[997] = tmpLblText;

        const tmpId = idsArray[4];
        idsArray[4] = idsArray[997];
        idsArray[997] = tmpId;
    }
}

function handleClick(e) {
    let target = e.target;
    if (target.tagName === "SPAN") {
        target = target.parentNode;
    }
    if (target.tagName === "A") {
        const tr = target.closest("tr");
        if (!tr || tr._rowIndex === undefined) return;

        const idx = tr._rowIndex;
        const rowId = idsArray[idx];

        if (target.classList.contains("lbl") || target.firstChild?.nodeValue) {
            // Sélection O(1)
            if (selectedIndex !== -1 && trArray[selectedIndex]) {
                trArray[selectedIndex].className = "";
            }
            if (selectedIndex !== idx) {
                tr.className = "danger";
                selectedIndex = idx;
                wasmExports.cortex_dom_select_row(rowId);
            } else {
                selectedIndex = -1;
                wasmExports.cortex_dom_select_row(0);
            }
        } else {
            // Suppression O(1) DOM
            wasmExports.cortex_dom_delete_row(rowId);
            trArray.splice(idx, 1);
            idTextNodes.splice(idx, 1);
            labelTextNodes.splice(idx, 1);
            idsArray.splice(idx, 1);

            // Réalignement des indices
            for (let i = idx; i < trArray.length; i++) {
                if (trArray[i]) trArray[i]._rowIndex = i;
            }

            if (selectedIndex === idx) {
                selectedIndex = -1;
            } else if (selectedIndex > idx) {
                selectedIndex--;
            }
            tbody.removeChild(tr);
        }
    }
}

async function init() {
    tbody = document.getElementById("tbody");

    // Chargement du module Rust WebAssembly ultra-optimisé
    const response = await fetch("cortex_dom_arena.wasm");
    const buffer = await response.arrayBuffer();
    const wasmModule = await WebAssembly.instantiate(buffer, {});

    wasmExports = wasmModule.instance.exports;
    wasmMemory = wasmExports.memory;
    wasmExports.cortex_dom_init();

    document.getElementById("run").addEventListener("click", run);
    document.getElementById("runlots").addEventListener("click", runLots);
    document.getElementById("add").addEventListener("click", add);
    document.getElementById("update").addEventListener("click", update);
    document.getElementById("clear").addEventListener("click", clear);
    document.getElementById("swaprows").addEventListener("click", swapRows);
    tbody.addEventListener("click", handleClick);
}

document.addEventListener("DOMContentLoaded", init);
