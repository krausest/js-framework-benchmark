import { FASTElement, customElement } from '@microsoft/fast-element';
import { DataItem, buildData } from './build-dummy-data';

class DataStore {
  data: DataItem[];

  constructor() {
    this.data = buildData();
  }
}

new DataStore();
