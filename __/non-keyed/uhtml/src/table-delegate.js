import {html} from 'uhtml';

const handler = ({currentTarget, target}) => {
  const a = target.closest('a');
  const {action} = a.dataset;
  currentTarget.state[action](+a.closest('tr').id);
};

export default (state) => {
  const {data, selected} = state;
  return html`
    <table class="table table-hover table-striped test-data"
      @click=${handler} .state=${state}>
      <tbody>${
      data.map(({id, label}) => html`
        <tr id=${id} class=${id === selected ? 'danger' : ''}>
          <td class="col-md-1">${id}</td>
          <td class="col-md-4">
            <a data-action="select">${label}</a>
          </td>
          <td class="col-md-1">
            <a data-action="remove">
              <span class="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td class="col-md-6" />
        </tr>
      `)
      }</tbody>
    </table>
  `;
};
