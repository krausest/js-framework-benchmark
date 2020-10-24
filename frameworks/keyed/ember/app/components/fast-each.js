import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class FastEachComponent extends Component {
  @tracked fragment = null;
  t1 = null;
  t2 = null;
  @action createRef(node) {
    this.node = node;
    let t = Date.now();
    this.fragment = document.createDocumentFragment();
    this.t1 = setTimeout(() => {
      this.appendFragment();
      this.t2 = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(Date.now() - t);
      });
    }, 20);
  }
  willDestroy() {
    clearTimeout(this.t1);
    clearTimeout(this.t2);
  }
  @action appendFragment() {
    this.node.appendChild(this.fragment);
  }
}
