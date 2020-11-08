import Service from '@ember/service';

export default class StateService extends Service {
  helpers = new Map();
  prevId = null;
  updateSelection(id) {
    const oldInstance = this.helpers.get(this.prevId)
    if (oldInstance) {
      oldInstance.isSelected = false;
      oldInstance.recompute();
    }
    this.prevId = id;
    const newInstance = this.helpers.get(this.prevId)
    if (newInstance) {
      newInstance.isSelected = true;
      newInstance.recompute();
    }
  }
}
