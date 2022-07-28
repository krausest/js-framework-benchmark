import {html} from 'lighterhtml';

const click = ({currentTarget, target}) => {
  const a = target.closest('a');
  const {action} = a.dataset;
  currentTarget.props[action](+a.closest('tr').id);
};

export default (state) => {
  const {data, selected} = state;
  return html`
    <table onclick=${click} props=${state}
      class="table table-hover table-striped test-data">
      <tbody>${
      data.map(({id, label}) => html`
        <tr id=${id} class=${id === selected ? 'danger' : ''}>
          <td class="col-md-1">${id}</td>
          <td class="col-md-4">
            <a data-action="select">${label}</a>
          </td>
          <td class="col-md-1">
            <a data-action="remove">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </a>
          </td>
          <td class="col-md-6" />
        </tr>
      `)
      }</tbody>
    </table>
  `;
};
