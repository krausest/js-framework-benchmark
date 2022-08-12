import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FormulaFn, FormulaList } from "@starbeam/core";
import { cached } from "@starbeam/js";

import { starbeam } from "./integration";
import { Item, Table } from "./types";

@customElement('label-element')
export class LabelElement extends LitElement {
  @property() table: Table;
  @property() item: Item;

  @starbeam
  render() {
    let select = () => this.table.select(this.item.id);
    return html`<a @click=${select}>${this.item.label}</a>`;
  }
}

@customElement('table-element')
export class TableElement extends LitElement {
  @property() table: Table;



  @cached
  get rows() {
    let selected = this.table.selected;

    return FormulaList(this.table.data, {
      key: item => `${item.id}-${this.table.selected}`,
      value: (item) => {
        let { id } = item;
        let isSelected = id === selected;
        let remove = () => this.table.remove(id);

        return html`
          <tr id=${id} class=${isSelected ? 'danger' : ''}>
            <td class="col-md-1">${id}</td>
            <td class="col-md-4">
              <label-element .table=${this.table} .item=${item}></label-element>
            </td>
            <td class="col-md-1">
              <a @click=${remove}>
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

