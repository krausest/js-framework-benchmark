import Component, { tracked } from '@glimmer/component';

import {
    add, deleteRow, run, runLots, swapRows, update
} from './-utils/benchmark-helpers';

export default class Glimmerjs extends Component {
    @tracked public id = 1;
    @tracked public data = [];
    @tracked public selected = undefined;

    public run() {
        const result = run(this.id);

        this.data = result.data;
        this.id = result.id;
        this.selected = undefined;
    }

    public runLots() {
        const result = runLots(this.id);

        this.data = result.data;
        this.id = result.id;
        this.selected = undefined;
    }

    public add() {
        const result = add(this.id, this.data);

        this.data = result.data;
    }

    public update() {
        this.data = update(this.data);
    }

    public clear() {
        this.data = [];
        this.selected = undefined;
    }

    public swapRows() {
        this.data = swapRows(this.data);
    }

    public select(id) {
        this.selected = id;
    }

    public delete(id) {
        this.data = deleteRow(this.data, id);
        this.selected = undefined;
    }
}
