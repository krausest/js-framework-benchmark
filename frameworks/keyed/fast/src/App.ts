import './index'; // import all our components
import { customElement, FASTElement, html, attr, css, FAST, repeat } from '@microsoft/fast-element';
import { DataItem, buildData } from './utils/build-dummy-data';

const template = html<BenchmarkApp>`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Fast-"keyed"</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <action-triggers></action-triggers>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody id="tbody">
      ${repeat(
        x => x.data,
        html<DataItem>`
          <tr data-id="${x => x.id}">
            <td class="col-md-1">${x => x.id}</td>
            <td class="col-md-4">
              <a class="lbl">${x => x.label}</a>
            </td>
            <td class="col-md-1">
              <a class="remove"> <span class="remove glyphicon glyphicon-remove" aria-hidden="true"></span></a>
            </td>
            <td class="col-md-6"></td>
          </tr>
        `
      )}
    </tbody>
  </table>
`;

/**
 * We're using `shadowOptions: null` to avoid Shadow DOM.
 * This way we can get global Bootstrap styles applied
 * because our component is rendered to Light DOM.
 *
 * https://www.fast.design/docs/fast-element/working-with-shadow-dom#shadow-dom-configuration
 */
@customElement({
  name: 'benchmark-app',
  template,
  shadowOptions: null
})
export class BenchmarkApp extends FASTElement {
  data: DataItem[];

  constructor() {
    super();
    this.data = buildData();
  }
}
