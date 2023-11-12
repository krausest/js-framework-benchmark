import {htmlFor} from 'uhtml/keyed';

export default (state) => {
  const {data, selected, selectRow, removeRow} = state;
  return htmlFor(state)`
    <table class="table table-hover table-striped test-data" .state=${state}>
      <tbody>${
      data.map(({id, label, html}) => html`
        <tr id=${id} class=${id === selected ? 'danger' : ''}>
          <td class="col-md-1">${id}</td>
          <td class="col-md-4">
            <a onclick=${selectRow}>${label}</a>
          </td>
          <td class="col-md-1">
            <a onclick=${removeRow}>
              <span class="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td class="col-md-6" />
        </tr>`
      )}</tbody>
    </table>
  `;
};
