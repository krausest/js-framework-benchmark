import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Table } from "./types";

@customElement('jumbotron-buttons')
export class JumbotronElement extends LitElement {
  @property() title: string;
  @property() table: Table;

  buttonFor = (id: string, text: string, click: () => void) => {
    return html`
      <div class="col-sm-6 smallpad">
        <button
          type="button"
          class="btn btn-primary btn-block"
          id=${id}
          @click=${click}>${text}</button>
      </div>
    `
  }

  render() {
    return html`
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>${this.title}</h1>
          </div>

          <div class="col-md-6">
            <div class="row">
              ${this.buttonFor('run', 'Create 1,000 rows', this.table.run)}
              ${this.buttonFor('runlots', 'Create 10,000 rows', this.table.runLots)}
              ${this.buttonFor('add', 'Append 1,000 rows', this.table.add)}
              ${this.buttonFor('update', 'Update every 10th row', this.table.update)}
              ${this.buttonFor('clear', 'Clear', this.table.clear)}
              ${this.buttonFor('swaprows', 'Swap Rows', this.table.swapRows)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
