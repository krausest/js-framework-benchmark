import Component, { tracked } from "@glimmer/component";
import {
  add,
  deleteRow,
  run,
  runLots,
  swapRows,
  update
} from "./../../../utils/benchmark-helpers";

function isRendering(ctx) {
  if (ctx.__owner__._rendering || ctx.__owner__._scheduled) {
    return true;
  }
  return false;
}

export default class Glimmer extends Component {
  @tracked public id = 1;
  @tracked public data = [];

  public create() {
    if (isRendering(this)) {
      return;
    }
    const result = run(this.id);
    this.data = result.data;
    this.id = result.id;
  }

  public add() {
    if (isRendering(this)) {
      return;
    }
    const result = add(this.id, this.data);
    this.data = result.data;
    this.id = result.id;
  }

  public update() {
    if (isRendering(this)) {
      return;
    }
    update(this.data);
  }
  public runLots() {
    if (isRendering(this)) {
      return;
    }
    const result = runLots(this.id);
    this.data = result.data;
    this.id = result.id;
    this.resetSelection();
  }

  public clear() {
    this.data = [];
  }

  public swapRows() {
    if (isRendering(this)) {
      return;
    }
    this.data = swapRows(this.data);
  }

  public remove(id) {
    if (isRendering(this)) {
      return;
    }
    this.data = deleteRow(this.data, id);
    this.resetSelection();
  }

  public select(id) {
    if (isRendering(this)) {
      return;
    }
    this.data.forEach(item => {
      if (item.id === id) {
        item.selected = true;
      } else if (item.selected) {
        item.selected = false;
      }
    });
  }

  private resetSelection() {
    this.data.forEach(item => {
      if (item.selected) {
        item.selected = false;
      }
    });
  }
}
