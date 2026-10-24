import { customElement, FASTElement, html, attr, css, FAST } from '@microsoft/fast-element';

// NOTE - element IDs must remain here because the benchmark lib needs them
const template = html<ActionTriggers>`
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id="run" @click=${x => x.run()}>Create 1,000 rows</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${x => x.runlots()}>
      Create 10,000 rows
    </button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id="add" @click=${x => x.add()}>Append 1,000 rows</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id="update" @click=${x => x.update()}>
      Update every 10th row
    </button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id="clear" @click=${x => x.clear()}>Clear</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${x => x.swaprows()}>Swap Rows</button>
  </div>
`;

/**
 * We're using `shadowOptions: null` to avoid Shadow DOM.
 * This way we can get global Bootstrap styles applied
 * because our component is rendered to Light DOM.
 *
 * https://www.fast.design/docs/fast-element/working-with-shadow-dom#shadow-dom-configuration
 */
@customElement({
  name: 'action-triggers',
  template,
  shadowOptions: null
})
export class ActionTriggers extends FASTElement {
  run() {
    this.$emit('action', { name: 'run' });
  }
  runlots() {
    this.$emit('action', { name: 'runlots' });
  }
  add() {
    this.$emit('action', { name: 'add' });
  }
  update() {
    this.$emit('action', { name: 'update' });
  }
  clear() {
    this.$emit('action', { name: 'clear' });
  }
  swaprows() {
    this.$emit('action', { name: 'swaprows' });
  }
}
