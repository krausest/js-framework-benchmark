import { html } from 'uhtml';

// Table component: it subscribes to the data signal
// as it relies its array content to change and update rows
export default ({ data, select, remove }) => html`
  <table class="table table-hover table-striped test-data">
    <tbody>${data.value.map(({ id, label, selected }) => html`
      <tr id=${id} class=${id === selected ? 'danger' : ''}>
        <td class="col-md-1">${id}</td>
        <td class="col-md-4">
          <a onclick=${select}>${label}</a>
        </td>
        <td class="col-md-1">
          <a onclick=${remove}>
            <span class="glyphicon glyphicon-remove" aria-hidden="true" />
          </a>
        </td>
        <td class="col-md-6" />
      </tr>
    `)}</tbody>
  </table>
`;
