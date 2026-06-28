import { defineView } from "@lark.js/mvc";
import template from "./main.html";
import { buildData } from "./data";
import type { RowData } from "./data";

export default defineView((ctx) => {
  let data: RowData[] = [];
  let selected: number | null = null;

  function render(): void {
    ctx.updater.set({ data, selected });
    ctx.updater.digest();
  }

  return {
    template,
    events: {
      "run<click>"(): void {
        data = buildData(1000);
        selected = null;
        render();
      },

      "runLots<click>"(): void {
        data = buildData(10000);
        selected = null;
        render();
      },

      "add<click>"(): void {
        data = data.concat(buildData(1000));
        render();
      },

      "update<click>"(): void {
        for (let i = 0; i < data.length; i += 10) {
          data[i].label += " !!!";
        }
        render();
      },

      "clear<click>"(): void {
        data = [];
        selected = null;
        render();
      },

      "swapRows<click>"(): void {
        if (data.length > 998) {
          const tmp = data[1];
          data[1] = data[998];
          data[998] = tmp;
        }
        render();
      },

      "select<click>"(e: Event & { params?: Record<string, string> }): void {
        e.preventDefault();
        selected = Number(e.params?.id);
        render();
      },

      "remove<click>"(e: Event & { params?: Record<string, string> }): void {
        e.preventDefault();
        const id = Number(e.params?.id);
        const idx = data.findIndex((d: RowData) => d.id === id);
        if (idx !== -1) {
          data.splice(idx, 1);
        }
        render();
      },
    },
  };
});
