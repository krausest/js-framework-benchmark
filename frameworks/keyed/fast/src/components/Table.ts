import { customElement, FASTElement, html, repeat, observable } from '@microsoft/fast-element';
import { RowItem } from 'src/utils/build-dummy-data';

const template = html<Table>`
  <table class="table table-hover table-striped test-data">
    <tbody id="tbody">
      ${repeat(
        x => x.rows,
        html`
          <tr data-id="${row => row.id}">
            <td class="col-md-1">${row => row.id}</td>
            <td class="col-md-4">
              <a class="lbl">${row => row.label}</a>
            </td>
            <td class="col-md-1">
              <a class="remove" data-row-id="${row => row.id}" @click=${(x, c) => c.parent.handleClick(c.event)}>
                <span class="remove glyphicon glyphicon-remove" aria-hidden="true"></span
              ></a>
            </td>
            <td class="col-md-6"></td>
          </tr>
        `,
        /**
         * List Rendering without view recycling
         *
         * With positioning set to true, and resycle set to false,
         * Fast wil re-render when internal properties of
         * RowItem[] change (e.g. id or label)
         *
         * https://www.fast.design/docs/fast-element/using-directives
         */
        { positioning: true, recycle: false }
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

  handleClick(event: Event) {
    const currentTarget = event.currentTarget as HTMLElement;

    if (currentTarget.classList.contains('remove')) {
      const rowId = currentTarget.dataset['rowId'];
      this.$emit('action', { name: 'deleteRow', data: Number(rowId) });
    }
  }
}
