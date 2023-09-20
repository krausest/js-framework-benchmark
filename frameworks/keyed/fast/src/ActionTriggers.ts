import { customElement, FASTElement, html, attr, css, FAST } from '@microsoft/fast-element';

const template = html<ActionTriggers>`
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" @click=${x => x.run()}>Create 1,000 rows</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" @click=${x => x.runlots()}>Create 10,000 rows</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" @click=${x => x.add()}>Append 1,000 rows</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" @click=${x => x.update()}>Update every 10th row</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" @click=${x => x.clear()}>Clear</button>
  </div>
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" @click=${x => x.swaprows()}>Swap Rows</button>
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
  public run() {}
  public runlots() {}
  public add() {}
  public update() {}
  public clear() {}
  public swaprows() {}
}
