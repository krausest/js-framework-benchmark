import { Observable } from 'kr-observable';

export class RowStore extends Observable {
  id;
  label;
  constructor(id, label) {
    super();
    this.id = id
    this.label = label
  }
}
