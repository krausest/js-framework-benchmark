import {
  OsfModel,
  OsfRegion,
  OsfModelView,
} from 'oldskull';

import type { IData } from './BenchmarkController';
import { ItemView } from './ItemView';
import { ItemModel } from './ItemModel';
import { ItemCollectionView } from './ItemCollectionView';
import { getData } from './utils';

export class BenchmarkView extends OsfModelView<OsfModel<IData>> {
  getHTML() {
    return `
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>Old Skull Framework</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='run'>Create 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='runlots'>Create 10,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='add'>Append 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='update'>Update every 10th row</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='clear'>Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="table table-hover table-striped test-data">

        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>`;
  }
  tableRegion = new OsfRegion(this, 'table');
  domEvents = [
    {
      el: '#run', on: 'click', call: this.createThousandRows.bind(this),
    },
    {
      el: '#runlots', on: 'click', call: this.createTenThousandRows.bind(this),
    },
    {
      el: '#add', on: 'click', call: this.appendThousandRows.bind(this),
    },
    {
      el: '#update', on: 'click', call: this.updateEveryTenthRow.bind(this),
    },
    {
      el: '#clear', on: 'click', call: this.clear.bind(this),
    },
    {
      el: '#swaprows', on: 'click', call: this.swap.bind(this),
    },
  ];
  async afterInit() {
    const itemsCollectionView = new ItemCollectionView(this.model.attrs.items, ItemView);
    await this.tableRegion.show(itemsCollectionView);
  }
  createThousandRows(): void {
    const items = getData(1000);
    const models = items.map(item => new ItemModel(item));
    this.model.attrs.items.set(models, true);
  }
  createTenThousandRows(): void {
    const items = getData(10000);
    const models = items.map(item => new ItemModel(item));
    this.model.attrs.items.set(models, true);
  }
  appendThousandRows() {
    const items = getData(1000);
    const models = items.map(item => new ItemModel(item));
    this.model.attrs.items.add(models);
  }
  updateEveryTenthRow() {
    const models = this.model.attrs.items.models;
    for (let i = 0; i < models.length; i += 10) {
      const model = models[i];
      model.set({
        id: model.attrs.id,
        label: `${model.attrs.label} !!!`,
      });
    }
  }
  clear() {
    this.model.attrs.items.set([], true);
  }
  swap() {
    if (this.tableRegion.view && this.tableRegion.view instanceof ItemCollectionView) {
      this.tableRegion.view.swap();
    }
  }
}
