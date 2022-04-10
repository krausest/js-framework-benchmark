import Service from '@ember/service';

export default class StateService extends Service {
  helpers = new Map();
  prevId = null;

  updateHelper(id, isSelected) {
    const instance = this.helpers.get(id)
    if (instance) {
      instance.isSelected = isSelected;
      instance.recompute();
    }
  }
  updateSelection(id) {
    this.updateHelper(this.prevId, false);
    this.prevId = id;
    this.updateHelper(this.prevId, true);
  }
}
