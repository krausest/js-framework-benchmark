import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FormulaList } from "@starbeam/core";
import { cached } from "@starbeam/js";

import { starbeam } from "./integration";
import { Item, Table } from "./types";

@customElement('table-element')
export class TableElement extends LitElement {
  @property() table: Table;

  @cached
  get rows() {
    return FormulaList(this.table.data, {
      key: item => item.id,
      value: ({ id, label }) => {
        let isSelected = id === this.table.selected;
        let select = () => this.table.select(id);
        let remove = () => this.table.remove(id);

        return html`
          <tr id=${id} class=${isSelected ? 'danger' : ''}>
            <td class="col-md-1">${id}</td>
            <td class="col-md-4">
              <a @onClick=${select}>${label}</a>
            </td>
            <td class="col-md-1">
              <a @onClick=${remove}>
                <span class="glyphicon glyphicon-remove"aria-hidden="true"></span>
              </a>
            </td>
            <td class="col-md-6"></td>
          </tr>
        `;
      }
    });
  }

  @starbeam
  render() {
    return html`
      <table class="table table-hover table-striped test-data">
        <tbody>${this.rows.current}</tbody>
      </table>
    `
  };
}

