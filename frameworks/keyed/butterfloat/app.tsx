import { ComponentContext, jsx, ObservableEvent } from 'butterfloat'
import { AppViewModel } from './app-vm.js'
import { Row } from './row.js'
import { map } from 'rxjs'

interface AppEvents {
  run: ObservableEvent<MouseEvent>
  runlots: ObservableEvent<MouseEvent>
  add: ObservableEvent<MouseEvent>
  update: ObservableEvent<MouseEvent>
  clear: ObservableEvent<MouseEvent>
  swaprows: ObservableEvent<MouseEvent>
}

export function App(
  _props: unknown,
  { bindImmediateEffect, events }: ComponentContext<AppEvents>,
) {
  const vm = new AppViewModel()

  const children = vm.rows.pipe(map((row) => () => <Row vm={row} />))

  bindImmediateEffect(events.run, () => {
    vm.createRows(1000)
  })
  bindImmediateEffect(events.runlots, () => {
    vm.createRows(10000)
  })
  bindImmediateEffect(events.add, () => vm.appendRows(1000))
  bindImmediateEffect(events.clear, () => vm.clear())

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Butterfloat</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="run"
                  events={{ click: events.run }}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="runlots"
                  events={{ click: events.runlots }}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="add"
                  events={{ click: events.add }}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="update"
                  events={{ click: events.update }}
                >
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="clear"
                  events={{ click: events.clear }}
                >
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="swaprows"
                  events={{ click: events.swaprows }}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody
          id="tbody"
          childrenBind={children}
          childrenBindMode="append"
        ></tbody>
      </table>
    </div>
  )
}
