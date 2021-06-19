import {html} from 'uhtml';

const stateHandler = new WeakMap;

export default (state) => {
  if (!stateHandler.has(state))
    stateHandler.set(state, [
      ({currentTarget, target}) => {
        const a = target.closest('a');
        const {action} = a.dataset;
        state[action](+currentTarget.id);
      },
      false
    ]);
  
  const handler = stateHandler.get(state);
  const {data, selected} = state;
  return html.for(state)`
    <table class="table table-hover table-striped test-data">
      <tbody>${
      data.map(item => {
        const {id, label} = item;
        return html.for(data, id)`
        <tr @click=${handler} id=${id} class=${id === selected ? 'danger' : ''}>
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
        </tr>`;
      })
      }</tbody>
    </table>
  `;
};
