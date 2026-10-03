/**
 * js-framework-benchmark keyed implementation for OpenElement.
 *
 * Ordinary OpenElement authoring only: one compiled custom element whose
 * `render()` returns the whole JFB page. The row list is a single keyed
 * list Region (`this.rows.map((row) => <tr key={row.id}>...)`), which is the
 * each-key path: the Region matches items by key, so reordering moves the
 * existing <tr> nodes and a row keeps its own DOM node for its lifetime.
 *
 * Two shapes are dictated by the compiler grammar (grammar v1), not chosen:
 *
 * 1. Selection is carried as a per-row `cls` field written through the item
 *    attribute slot `class={row.cls}`. An item template's attributes accept
 *    only static literals or `{item.<field>}` (compile.ts lowerItemElement),
 *    so neither a conditional nor a `this.<field>` read is expressible inside
 *    a row. `selected` stays the single source of truth and `cls` is derived
 *    from it on every mutation.
 * 2. Row clicks are handled by one delegated listener on the <table>. Item
 *    templates reject event handlers outright (OEC9011 "attribute name
 *    "onClick" is unsafe" for item attributes), so a per-row handler is not
 *    expressible. The delegation is a framework binding (`onClick=...`), the
 *    same shape frameworks/keyed/lit/src/main.ts uses on its table.
 *
 * Update cost is proportional to the rows that actually changed: a changed row
 * gets a new object, every untouched row keeps its reference, and the array is
 * reassigned.
 */
import { element, OpenElement, property } from '@openelement/element';
import { buildData, ROW_CLASS, type Row } from './data.ts';

@element('openelement-table', { root: 'light' })
export class OpenElementTable extends OpenElement {
  @property({ reflect: false })
  rows: Row[] = [];

  /** The one authoritative piece of selection state: the selected row id. */
  @property({ reflect: false })
  selected = 0;

  private nextLabel(row: Row): Row {
    return { id: row.id, label: `${row.label} !!!`, cls: row.cls };
  }

  run(): void {
    this.selected = 0;
    this.rows = buildData(1000);
  }

  runLots(): void {
    this.selected = 0;
    this.rows = buildData(10000);
  }

  add(): void {
    this.rows = this.rows.concat(buildData(1000));
  }

  update(): void {
    const next = this.rows.slice();
    for (let i = 0; i < next.length; i += 10) {
      next[i] = this.nextLabel(next[i]);
    }
    this.rows = next;
  }

  clear(): void {
    this.selected = 0;
    this.rows = [];
  }

  swapRows(): void {
    if (this.rows.length > 998) {
      const next = this.rows.slice();
      const tmp = next[1];
      next[1] = next[998];
      next[998] = tmp;
      this.rows = next;
    }
  }

  select(id: number): void {
    if (this.selected === id) return;
    this.selected = id;
    this.rows = this.rows.map((row) => {
      const shouldBeDanger = row.id === id;
      if (shouldBeDanger === (row.cls === ROW_CLASS)) return row;
      return { id: row.id, label: row.label, cls: shouldBeDanger ? ROW_CLASS : '' };
    });
  }

  remove(id: number): void {
    this.rows = this.rows.filter((row) => row.id !== id);
  }

  /**
   * One delegated listener for the whole table. The anchors carry
   * data-action/data-id (the same contract frameworks/keyed/lit uses), and
   * this only reads the event target — it never writes the DOM.
   */
  handleTableClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target === null) return;
    const anchor = target.closest('a');
    if (anchor === null) return;
    const action = anchor.getAttribute('data-action');
    const id = Number(anchor.getAttribute('data-id'));
    if (action === 'remove') this.remove(id);
    else if (action === 'select') this.select(id);
  }

  render() {
    return (
      <div class='container'>
        <div class='jumbotron'>
          <div class='row'>
            <div class='col-md-6'>
              <h1>OpenElement keyed</h1>
            </div>
            <div class='col-md-6'>
              <div class='row'>
                <div class='col-sm-6 smallpad'>
                  <button type='button' class='btn btn-primary btn-block' id='run' onClick={this.run}>
                    Create 1,000 rows
                  </button>
                </div>
                <div class='col-sm-6 smallpad'>
                  <button type='button' class='btn btn-primary btn-block' id='runlots' onClick={this.runLots}>
                    Create 10,000 rows
                  </button>
                </div>
                <div class='col-sm-6 smallpad'>
                  <button type='button' class='btn btn-primary btn-block' id='add' onClick={this.add}>
                    Append 1,000 rows
                  </button>
                </div>
                <div class='col-sm-6 smallpad'>
                  <button type='button' class='btn btn-primary btn-block' id='update' onClick={this.update}>
                    Update every 10th row
                  </button>
                </div>
                <div class='col-sm-6 smallpad'>
                  <button type='button' class='btn btn-primary btn-block' id='clear' onClick={this.clear}>
                    Clear
                  </button>
                </div>
                <div class='col-sm-6 smallpad'>
                  <button type='button' class='btn btn-primary btn-block' id='swaprows' onClick={this.swapRows}>
                    Swap Rows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class='table table-hover table-striped test-data' onClick={this.handleTableClick}>
          <tbody id='tbody'>
            {this.rows.map((row) => (
              <tr key={row.id} data-id={row.id} class={row.cls}>
                <td class='col-md-1'>{row.id}</td>
                <td class='col-md-4'>
                  <a data-action='select' data-id={row.id}>
                    {row.label}
                  </a>
                </td>
                <td class='col-md-1'>
                  <a data-action='remove' data-id={row.id}>
                    <span class='glyphicon glyphicon-remove' aria-hidden='true'></span>
                  </a>
                </td>
                <td class='col-md-6'></td>
              </tr>
            ))}
          </tbody>
        </table>
        <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
      </div>
    );
  }
}
