import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scheduleOnce, cancel } from '@ember/runloop';
export default class FastEachComponent extends Component {
  @tracked fragment = null;
  t1 = null;
  t2 = null;
  @action createRef(node) {
    this.node = node;
    this.fragment = document.createDocumentFragment();
    this.t1 = scheduleOnce('afterRender', this, this.runAppend);
  }
  willDestroy() {
    cancel(this.t1);
    clearTimeout(this.t2);
  }
  @action runAppend() {
    this.t2 = setTimeout(()=>{
      this.appendFragment();
    });
  }
  @action appendFragment() {
    this.node.appendChild(this.fragment);
  }
}
