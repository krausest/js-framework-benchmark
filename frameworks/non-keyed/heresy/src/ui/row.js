export default {
  extends: 'tr',
  mappedAttributes: ['label'],
  onlabel({detail}) {
    if (detail !== this._label)
      this.render();
  },
  render() {
    const {id, label} = this;
    this._label = label;
    this.html`
    <td class="col-md-1">${id}</td>
    <td class="col-md-4">
      <a data-action='select'>${label}</a>
    </td>
    <td class="col-md-1">
      <a data-action='delete'>
        <span class="glyphicon glyphicon-remove" aria-hidden="true" />
      </a>
    </td>
    <td class="col-md-6" />`;
  }
};
