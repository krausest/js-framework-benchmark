import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class extends Component {
  @service rows;

  @action async create() {
    this.rows.run();
  }

  @action async add() {
    this.rows.add();
  }
  @action async update() {
    this.rows.update();
  }
  @action async runLots() {
    this.rows.runLots();
  }
  @action async clear() {
    this.rows.clear();
  }
  @action async swapRows() {
    this.rows.swapRows();
  }
  @action async remove(identifier) {
    this.rows.remove(identifier);
  }
  @action async select(identifier) {
    this.rows.select(identifier);
  }
}
