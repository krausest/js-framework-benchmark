import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import BsButton from 'ember-temp/components/bs-button';
import {
  run, runLots, add, update, swapRows, deleteRow,
} from 'ember-temp/utils/benchmark-helpers';

function eq(a, b) {
  return a === b;
}

export default class MyTable extends Component {
  @tracked
  id = 1;

  @tracked
  data = [];

  @tracked selected = undefined;

  @action create() {
    const result = run(this.id);

    this.id = result.id;
    this.data = result.data;
    this.selected  = undefined;
  }

  @action add() {
    const result = add(this.id, this.data);
    this.id = result.id;
    this.data = result.data;
  }

  @action update() {
    update(this.data);
  }

  @action runLots() {
    const result = runLots(this.id);

    this.data = result.data;
    this.id = result.id;
    this.selected = undefined;
  }

  @action clear() {
    this.data = [];
    this.selected  = undefined;
  }

  @action swapRows() {
    this.data = swapRows(this.data);
  }

  @action remove({id}) {
    this.data = deleteRow(this.data, id);
    this.selected = undefined;
  }

  @action select({id}) {
    this.selected = id;
  }

  <template>
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Ember</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <BsButton id="run" {{on 'click' this.create}}>
                Create 1,000 rows
              </BsButton>
            </div>
            <div class="col-sm-6 smallpad">
              <BsButton id="runlots" {{on 'click' this.runLots}}>
                Create 10,000 rows
              </BsButton>
            </div>
            <div class="col-sm-6 smallpad">
              <BsButton id="add" {{on 'click' this.add}}>
                Append 1,000 rows
              </BsButton>
            </div>
            <div class="col-sm-6 smallpad">
              <BsButton id="update" {{on 'click' this.update}}>
                Update every 10th row
              </BsButton>
            </div>
            <div class="col-sm-6 smallpad">
              <BsButton id="clear" {{on 'click' this.clear}}>
                Clear
              </BsButton>
            </div>
            <div class="col-sm-6 smallpad">
              <BsButton id="swaprows" {{on 'click' this.swapRows}}>
                Swap Rows
              </BsButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    {{#if this.data.length}}
      <table class="table table-hover table-striped test-data">
        <tbody>
          {{#each this.data key="id" as |item|}}
            <tr class={{if (eq item.id this.selected) 'danger'}}>
              <td class="col-md-1">{{item.id}}</td>
              <td class="col-md-4"><a onclick={{fn this.select item}}>{{item.label}}</a></td>
              <td class="col-md-1"><a onclick={{fn this.remove item}}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
              <td class="col-md-6"></td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    {{/if}}

    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </template>
}
