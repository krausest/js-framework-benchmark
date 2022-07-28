import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
export default class EqHelper extends Helper {
  @service('state') state;

  id = null;
  isSelected = false;

  willDestroy() {
    this.state.helpers.delete(this.id);
  }

  compute([{id}]) {
    this.id = id;
    this.state.helpers.set(id, this);
    return this.isSelected;
  }
}
