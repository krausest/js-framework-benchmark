import { html } from 'uhtml';

import { create } from './utils.js';

// the Jumbotron can be used as component, even if it has no effect/subscription
export default ({ title, data }) => html`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1 .textContent=${title} />
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button id="run" type="button" class="btn btn-primary btn-block"
              onclick=${() => data.value = create(1_000)}
            >Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button id="runlots" type="button" class="btn btn-primary btn-block"
              onclick=${() => data.value = create(10_000)}
            >Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button id="add" type="button" class="btn btn-primary btn-block"
              onclick=${() => data.value = create(1_000, true)}
            >Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button id="update" type="button" class="btn btn-primary btn-block"
              onclick=${() => {
                const rows = create(-1);
                for (let i = 0; i < rows.length; i += 10) rows[i].label += ' !!!';
                data.value = rows;
              }}
            >Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button id="clear" type="button" class="btn btn-primary btn-block"
              onclick=${() => data.value = create(0)}
            >Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button id="swaprows" type="button" class="btn btn-primary btn-block"
              onclick=${() => {
                const rows = create(-1);
                if (998 < rows.length) {
                  [rows[1], rows[998]] = [rows[998], rows[1]];
                  data.value = rows;
                }
              }}
            >Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
