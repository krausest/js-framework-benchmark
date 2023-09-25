import './index'; // import all our components
import { customElement, FASTElement, html, observable, when } from '@microsoft/fast-element';
import { RowItem, buildData } from './utils/build-dummy-data';

const template = html<BenchmarkApp>`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Fast-"keyed"</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <action-triggers
            @action=${(x, c) => {
              x.onAction(c.event);
            }}
          ></action-triggers>
        </div>
      </div>
    </div>
  </div>
  ${when(
    x => x.rows?.length,
    html`
      <data-table
        :rows=${x => x.rows}
        :selectedRowId=${x => x.selectedRowId}
        @action=${(x, c) => {
          x.onAction(c.event);
        }}
      ></data-table>
    `
  )}
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
  @observable rows?: RowItem[];
  backupData?: RowItem[];

  createOneThousandRows() {
    this.clear();
    this.rows = buildData();
  }

  createTenThousandRows() {
    this.rows = buildData(10000);
  }

  appendOneThousandRows() {
    this.rows = this.rows ? this.rows.concat(buildData(1000)) : buildData();
  }

  updateEveryTenthRowLabel() {
    if (!this.rows) return;

    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += ' !!!';
    }

    this.triggerRerender();
  }

  clear() {
    this.rows = [];
  }

  swapTwoRows() {
    if (!this.rows) return;

    if (this.rows.length > 998) {
      const secondRow = this.rows[1];
      const secondToLastRow = this.rows[998];
      this.rows[1] = secondToLastRow;
      this.rows[998] = secondRow;
    }

    this.triggerRerender();
  }

  deleteSingleRow(rowId: number) {
    if (!this.rows) return;

    const rowIndex = this.rows.findIndex(row => row.id === rowId);
    if (rowIndex > -1) {
      this.rows.splice(rowIndex, 1);
    }
  }

  onAction(event: Event) {
    const eventDetails = (event as CustomEvent).detail;
    const { name, data } = eventDetails;

    if (name === 'add') return this.appendOneThousandRows();
    if (name === 'run') return this.createOneThousandRows();
    if (name === 'update') return this.updateEveryTenthRowLabel();
    if (name === 'runlots') return this.createTenThousandRows();
    if (name === 'clear') return this.clear();
    if (name === 'swaprows') return this.swapTwoRows();
    if (name === 'deleteSingleRow') return this.deleteSingleRow(data);

    throw new Error('unknown event name!');
  }

  private triggerRerender() {
    if (!this.rows) return;
    // trigger an update
    this.rows = this.rows.slice();
  }
}
