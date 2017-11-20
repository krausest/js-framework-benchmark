import { Component } from 'hyperhtml/esm';
import { startMeasure } from './utils';

const rows = new WeakMap;
const set = (state, row) => (rows.set(state, row), row);

export default class Row extends Component {
  static for(state) {
    return (rows.get(state) || set(state, new Row(state))).render();
  }
  constructor(state) {
    super().state = state;
  }
  get className() {
    return this.state.id === Row.app.store.selected ? 'danger' : '';
  }
  select() {
    startMeasure('select');
    Row.app.store.select(this.state.id);
    Row.app.update();
  }
  remove() {
    startMeasure('delete');
    Row.app.store.delete(this.state.id);
    Row.app.update();
  }
  render() {
    return this.html`
      <tr class=${this.className}>
        <td class=col-md-1>${this.state.id}</td>
        <td class=col-md-4>
          <a data-call=select onclick=${this}>${this.state.label}</a>
        </td>
        <td class=col-md-1>
          <a data-call=remove onclick=${this}>
            <span class="glyphicon glyphicon-remove" aria-hidden=true></span>
          </a>
        </td>
        <td class=col-md-6></td>
      </tr>`;
  }
}
