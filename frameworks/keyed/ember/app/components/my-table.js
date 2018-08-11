import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class extends Component {
  @service rows;

  @action create() {
    this.rows.run();
  }

  @action add() {
    this.rows.add();
  }
  @action update() {
    this.rows.update();
  }
  @action runLots() {
    this.rows.runLots();
  }
  @action clear() {
    this.rows.clear();
  }
  @action swapRows() {
    this.rows.swapRows();
  }
  @action remove(identifier) {
    this.rows.remove(identifier);
  }
  @action select(identifier) {
    this.rows.select(identifier);
  }
}
