import { state } from './state.js';

export const PaddedButton = <template>
  <div class="col-sm-6 smallpad">
    <button
      type="button"
      class="btn btn-primary btn-block"
      ...attributes
    >{{yield}}</button>
  </div>
</template>;

export const Jumbotron = <template>
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Ember (keyed)</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <PaddedButton id="run" onclick={{state.create}}>
            Create 1,000 rows
          </PaddedButton>
          <PaddedButton id="runlots" onclick={{state.runLots}}>
            Create 10,000 rows
          </PaddedButton>
          <PaddedButton id="add" onclick={{state.add}}>
            Append 1,000 rows
          </PaddedButton>
          <PaddedButton id="update" onclick={{state.update}}>
            Update every 10th row
          </PaddedButton>
          <PaddedButton id="clear" onclick={{state.clear}}>
            Clear
          </PaddedButton>
          <PaddedButton id="swaprows" onclick={{state.swapRows}}>
            Swap Rows
          </PaddedButton>
        </div>
      </div>
    </div>
  </div>
</template>;
