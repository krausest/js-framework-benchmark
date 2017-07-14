const html = require('choo/html');

module.exports = function rowsView (state, emit) {
  const data = state.data;
  const selected = state.selected;
  function del(id) {
    return function(e) {
      emit('delete', { id: id });
    };
  }
  
  function click(id) {
    return function (e) {
      emit('select', { id: id });
    };
  }

  function className(id) {
    return id === selected ? 'danger' : '';
  }

  return data.map((d, i) => {
    const id = d.id;
    const label = d.label;
    return html`
      <tr class=${className(id)}>
        <td class="col-md-1">${id}</td>
        <td class="col-md-4">
          <a onclick=${click(id)}>${label}</a>
        </td>
        <td class="col-md-1">
          <a onclick=${del(id)}>
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </a>
        </td>
        <td class="col-md-6"></td>
      </tr>
    `;
  });
};
