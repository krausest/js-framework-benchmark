import './index';
import { DataItem, buildData } from './utils/build-dummy-data';

class DataStore {
  data: DataItem[];
  backup?: DataItem[];
  selectedId: number;
  id: number;

  constructor() {
    this.data = buildData();
    this.backup = undefined;
    this.selectedId = -1;
    this.id = 1;
  }
}

class Main {
  dataStore: DataStore;

  constructor() {
    this.dataStore = new DataStore();
  }
}
