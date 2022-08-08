import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TableData } from "./data";

import './jumbotrun';
import './table';


@customElement('main-element')
export class MainElement extends LitElement {
  table = new TableData();

  render() {
    return html`
      <link href="/css/currentStyle.css" rel="stylesheet"/>
      <div class="container">
        <jumbotron-buttons .table=${this.table} title="Lit + Starbeam"></jumbotron-buttons>
        <table-element .table=${this.table}></table-element>

        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
    `;
  }
}
