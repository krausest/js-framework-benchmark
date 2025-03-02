import { Observable } from 'kr-observable';

export class RowStore extends Observable {
  static ignore = ['id']
  id;
  label;
  selected = false
  constructor(id, label) {
    super();
    this.id = id
    this.label = label
  }
}