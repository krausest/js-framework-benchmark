import {html} from 'uhtml';

export default ({run, runLots, add, update, clear, swapRows}) => html`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>µhtml non-keyed</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="run" @click=${run}>Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="runlots" @click=${runLots}>Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="add" @click=${add}>Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="update" @click=${update}>Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="clear" @click=${clear}>Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="swaprows" @click=${swapRows}>Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
