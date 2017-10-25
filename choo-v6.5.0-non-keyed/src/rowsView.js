const html = require('choo/html');
const utils = require('./utils');
const startMeasure = utils.startMeasure;

module.exports = function rowsView(state, emit) {
  const data = state.data;
  const selected = state.selected;

  return data.map(d => {
    const id = d.id;
    const label = d.label;
    const className = classNameSelected(selected);
    return row({ id, label, className }, emit);
  });
};

function row(state, emit) {
  const id = state.id;
  const label = state.label;
  const className = state.className;

  const row = html`
  <tr id=${id} class=${className(id)}>
    <td class="col-md-1">${id}</td>
    <td class="col-md-4">
      <a onclick=${click(id, emit)}>${label}</a>
    </td>
    <td class="col-md-1">
      <a onclick=${del(id, emit)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
  `;

  row.isSameNode = target => target && target.id === id;

  return row;
}

function del(id, emit) {
  return e => {
    startMeasure('delete');
    emit('delete', { id: id });
  };
}

function click(id, emit) {
  return e => {
    startMeasure('select');
    emit('select', { id: id });
  };
}

function classNameSelected(selected) {
  return id => (id === selected ? 'danger' : '');
}
