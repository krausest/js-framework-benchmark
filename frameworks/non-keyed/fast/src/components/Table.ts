import { customElement, FASTElement, html, repeat, observable } from '@microsoft/fast-element';
import { RowItem } from 'src/utils/build-dummy-data';

let fixedRowId = 10_0000;

const template = html<Table>`
  <table class="table table-hover table-striped test-data" @click=${(x, c) => x.handleClick(c.event)}>
    <tbody id="tbody">
      ${repeat(
        x => x.rows,
        html`
          <tr
            data-id="${row => row.id}"
            data-indexId="${(x, c) => c.index + 1}"
            class="${(row, c) => (c.parent.selectedRowId === row.id ? 'danger' : '')}"
          >
            <td class="col-md-1">${row => row.id}</td>
            <td class="col-md-4">
              <a class="lbl" data-row-id="${row => row.id}">${row => row.label}</a>
            </td>
            <td class="col-md-1">
              <a class="remove" data-row-id="${row => row.id}">
                <span class="remove glyphicon glyphicon-remove" aria-hidden="true"></span
              ></a>
            </td>
            <td class="col-md-6"></td>
          </tr>
        `,
        { positioning: true }
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
  name: 'data-table',
  template,
  shadowOptions: null
})
export class Table extends FASTElement {
  @observable rows!: RowItem[];
  @observable selectedRowId = -1;

  handleClick(event: Event) {
    const target = event.target as HTMLElement;

    if (target.classList.contains('remove')) {
      const rowId = target.parentElement?.dataset['rowId'];
      this.$emit('action', { name: 'deleteSingleRow', data: Number(rowId) });
      return;
    }

    if (target.classList.contains('lbl')) {
      const rowId = target.dataset['rowId'];
      this.selectRow(Number(rowId));
      return;
    }
  }

  private selectRow(rowId: number) {
    this.selectedRowId = rowId;
  }
}
