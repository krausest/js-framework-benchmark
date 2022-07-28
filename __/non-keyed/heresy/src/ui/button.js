export default {
  extends: 'div',
  mappedAttributes: ['id', 'cb', 'text'],
  oninit() {
    this.classList.add('col-sm-6', 'smallpad');
  },
  render() {
    const {id, cb, text} = this;
    this.html`
    <button
      type="button" class="btn btn-primary btn-block"
      id=${id}
      onclick=${cb}
    >
      ${text}
    </button>`;
  }
};
