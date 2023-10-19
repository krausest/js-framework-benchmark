import { Component, xml, useState } from "@odoo/owl";
import { buildData } from './data'

export class Root extends Component {
  static template = xml`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>OWL (keyed)</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="run"
              t-on-click="run"
            >
              Create 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="runlots"
              t-on-click="runLots"
            >
              Create 10,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="add"
              t-on-click="add"
            >
              Append 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="update"
              t-on-click="update"
            >
              Update every 10th row
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="clear"
              t-on-click="clear"
            >
              Clear
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="swaprows"
              t-on-click="swapRows"
            >
              Swap Rows
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody>
      <tr
		t-foreach="state.rows" t-as="row" t-key="row.id"
		t-att-class="{danger: row.id === state.selected}"
      >
        <td class="col-md-1" t-esc="row.id"></td>
        <td class="col-md-4">
          <a t-on-click="() => this.select(row.id)" t-esc="row.label"></a>
        </td>
        <td class="col-md-1">
          <a t-on-click="() => this.remove(row.id)">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </a>
        </td>
        <td class="col-md-6"></td>
      </tr>
    </tbody>
  </table>
  <span
    class="preloadicon glyphicon glyphicon-remove"
    aria-hidden="true"
  ></span>
	`;

	state = useState({
		rows: [],
		selected: undefined
	});

	setRows(update) {
		this.state.rows = update
	}

	add() {
		this.setRows(this.state.rows.concat(buildData(1000)))
	}

	remove(id) {
		this.state.rows.splice(
			this.state.rows.findIndex((d) => d.id === id),
			1
		)
	}

	select(id) {
		this.state.selected = id
	}

	run() {
		this.setRows(buildData())
		this.state.selected = undefined
	}

	update() {
		const _rows = this.state.rows
		for (let i = 0; i < _rows.length; i += 10) {
			_rows[i].label += ' !!!'
		}
	}

	runLots() {
		this.setRows(buildData(10000))
		this.state.selected = undefined
	}

	clear() {
		this.setRows([])
		this.state.selected = undefined
	}

	swapRows() {
		const _rows = this.state.rows
		if (_rows.length > 998) {
			const d1 = _rows[1]
			const d998 = _rows[998]
			_rows[1] = d998
			_rows[998] = d1
		}
	}
}

