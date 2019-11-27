export default {
  extends: 'tr',
  observedAttributes: ['label'],
  onattributechanged() {
    this.render();
  },
  render() {
    const {id} = this;
    this.html`
    <td class="col-md-1">${id}</td>
    <td class="col-md-4">
      <a data-action='select'>${this.getAttribute('label')}</a>
    </td>
    <td class="col-md-1">
      <a data-action='delete'>
        <span class="glyphicon glyphicon-remove" aria-hidden="true" />
      </a>
    </td>
    <td class="col-md-6" />`;
  }
};
