import {html} from 'lighterhtml';

export default ({run, runLots, add, update, clear, swapRows}) => html`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>lighterhtml keyed</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="run" onclick=${run}>Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="runlots" onclick=${runLots}>Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="add" onclick=${add}>Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="update" onclick=${update}>Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="clear" onclick=${clear}>Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block"
                    id="swaprows" onclick=${swapRows}>Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
