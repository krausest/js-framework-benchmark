import Component, { tracked } from '@glimmer/component';
import {
    add, deleteRow, run, runLots, swapRows, update,
  } from './../../../utils/benchmark-helpers';

export default class Glimmer extends Component {
    @tracked public id = 1;
    @tracked public data = [];

    public create() {
        const result = run(this.id);
        this.data = result.data;
        this.id = result.id;
    }

    public add() {
        this.data = add(this.id, this.data).data;
    }

    public update() {
        update(this.data);
    }
    public runLots() {
        const result = runLots(this.id);
        this.data = result.data;
        this.id = result.id;
        this.resetSelection();
    }

      public clear() {
        this.data = [];
      }

      public swapRows() {
        this.data = swapRows(this.data);
      }

      public remove(id) {
        this.data = deleteRow(this.data, id);
        this.resetSelection();
      }

      public select(id) {
        this.data.forEach((item) => {
            if (item.id === id) {
                item.selected = true;
            } else if (item.selected) {
                item.selected = false;
            }
        });
      }

    private resetSelection() {
        this.data.forEach((item) => {
            if (item.selected) {
                item.selected = false;
            }
        });
    }
}
