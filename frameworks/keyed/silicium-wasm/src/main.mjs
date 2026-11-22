// SPDX-License-Identifier: Apache-2.0
// Consumes silicium-dom (LicenseRef-Silicium-Community-1.0, Patent Pending).

import { mountSiliciumDataGrid } from "silicium-dom";

const ROW_HTML =
  '<tr><td class="col-md-1"></td><td class="col-md-4"><a class="lbl"></a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>';

const tbody = document.getElementById("tbody");
const wasmSource = new URL("./silicium_dom.wasm", import.meta.url);
const grid = await mountSiliciumDataGrid(tbody, { keyed: true, rowHtml: ROW_HTML, wasmSource });

document.getElementById("run").addEventListener("click", () => grid.render(1000, false));
document.getElementById("runlots").addEventListener("click", () => grid.render(10000, false));
document.getElementById("add").addEventListener("click", () => grid.append(1000));
document.getElementById("update").addEventListener("click", () => grid.updateEvery10th());
document.getElementById("clear").addEventListener("click", () => grid.clear());
document.getElementById("swaprows").addEventListener("click", () => grid.swapRows(1, 998));
