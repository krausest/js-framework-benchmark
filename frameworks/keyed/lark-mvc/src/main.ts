import { defineView } from "@lark.js/mvc";
import template from "./main.html";
import { buildData } from "./data";
import type { RowData } from "./data";

const MainView = defineView({
  template,

  _data: [] as RowData[],
  _selected: null as number | null,

  make(): void {
    this._data = [];
    this._selected = null;
    this.updater.set({ data: [], selected: null });
  },

  assign(): void {
    this.updater.snapshot();
    this.updater.set({
      data: this._data,
      selected: this._selected,
    });
  },

  render(): void {
    this.assign();
    this.updater.digest();
  },

  // --- button handlers (static @click, no dynamic params) ---

  "run<click>"(): void {
    this._data = buildData(1000);
    this._selected = null;
    this.render();
  },

  "runLots<click>"(): void {
    this._data = buildData(10000);
    this._selected = null;
    this.render();
  },

  "add<click>"(): void {
    this._data = this._data.concat(buildData(1000));
    this.render();
  },

  "update<click>"(): void {
    const d = this._data;
    for (let i = 0; i < d.length; i += 10) {
      d[i].label += " !!!";
    }
    this.render();
  },

  "clear<click>"(): void {
    this._data = [];
    this._selected = null;
    this.render();
  },

  "swapRows<click>"(): void {
    const d = this._data;
    if (d.length > 998) {
      const tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
    }
    this.render();
  },

  // --- selector-based handler for all <a> clicks inside the view ---
  // Uses data-action and data-id attributes to dispatch.

  "$a<click>"(e: MouseEvent): void {
    e.preventDefault();
    const target = e.target as Element;
    const a = target.closest("a") as HTMLElement | null;
    if (!a) return;
    const action = a.dataset.action;
    const id = Number(a.dataset.id);
    if (action === "select") {
      this._selected = id;
      this.render();
    } else if (action === "remove") {
      const idx = this._data.findIndex((d: RowData) => d.id === id);
      if (idx !== -1) {
        this._data.splice(idx, 1);
      }
      this.render();
    }
  },
});

export default MainView;
