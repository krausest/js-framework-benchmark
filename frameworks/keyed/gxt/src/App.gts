import { Component, cell } from '@lifeart/gxt';
import { type Item, buildData, swapRows, updateData } from './utils';
import { Row } from './Row.gts';
import { Button } from './Button.gts';
import { RemoveIcon } from './RemoveIcon.gts';

export class Application extends Component {
  itemsCell = cell<Item[]>([]);
  selectedCell = cell(0);
  get items() {
    return this.itemsCell.value;
  }
  set items(value: Item[]) {
    this.itemsCell.value = value;
  }
  get selected() {
    return this.selectedCell.value;
  }
  set selected(value: number) {
    this.selectedCell.value = value;
  }
  removeItem = (item: Item) => {
    this.items = this.items.filter((i) => i.id !== item.id);
  };
  onSelect = (item: Item) => {
    if (this.selected === item.id) {
      this.selected = 0;
      return;
    }
    this.selected = item.id;
  };
  run = () => {
    this.items = buildData(1000);
  };
  add = () => {
    this.items = [...this.items, ...buildData(1000)];
  };
  runlots = () => {
    this.items = buildData(10000);
  };
  swaprows = () => {
    this.items = swapRows(this.items);
  };
  clear = () => {
    this.items = [];
  };
  update = () => {
    updateData(this.items, 10);
  };
  <template>
    <div class='container'>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'>
            <h1>GlimmerNext</h1>
          </div>
          <div class='col-md-6'>
            <div class='row'>
              <Button id='run' {{on 'click' this.run}} @text="Create 1 000 items" />

              <Button id='runlots' {{on 'click' this.runlots}} @text="Create 10 000 items" />

              <Button id='add' {{on 'click' this.add}} @text="Append 1 000 rows" />

              <Button id='update' {{on 'click' this.update}} @text="Update every 10th row" />

              <Button id='clear' {{on 'click' this.clear}} @text="Clear" />

              <Button id='swaprows' {{on 'click' this.swaprows}} @text="Swap rows" />
            </div>
          </div>
        </div>
      </div>

      <table class='table table-hover table-striped test-data'>
        <tbody>
          {{#each this.items sync=true as |item|}}
            <Row
              @item={{item}}
              @onSelect={{this.onSelect}}
              @selected={{this.selected}}
              @onRemove={{this.removeItem}}
            />
          {{/each}}
        </tbody>
      </table>
      <RemoveIcon class="preloadicon" />
    </div>
  </template>
}
