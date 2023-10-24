import { makeObservable, observable } from 'mobx';

export class RowStore {
  id;

  label;

  constructor(id, label) {
    makeObservable(this, {
      label: observable,
    });

    this.id = id;
    this.label = label;
  }
}
