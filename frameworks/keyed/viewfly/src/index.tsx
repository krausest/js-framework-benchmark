import { createDerived, createSignal } from '@viewfly/core'
import { createApp } from '@viewfly/platform-browser'

export interface Model {
  id: number
  label: string
}

const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

const buildData = (count: number) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};

const selected = createSignal<number | null>(null)
const rows = createSignal<Model[]>([])

function setRows(update = rows().slice()) {
  rows.set(update)
}

function add() {
  rows.set(rows().concat(buildData(1000)))
}

function remove(id: number) {
  rows().splice(
    rows().findIndex((d) => d.id === id),
    1
  )
  setRows()
}

function select(id: number) {
  selected.set(id)
}

function run() {
  setRows(buildData(1000))
  selected.set(null)
}

function update() {
  const _rows = rows()
  for (let i = 0; i < _rows.length; i += 10) {
    _rows[i].label += ' !!!'
  }
  setRows()
}

function runLots() {
  setRows(buildData(10000))
  selected.set(null)
}

function clear() {
  setRows([])
  selected.set(null)
}

function swapRows() {
  const _rows = rows()
  if (_rows.length > 998) {
    const d1 = _rows[1]
    const d998 = _rows[998]
    _rows[1] = d998
    _rows[998] = d1
    setRows()
  }
}

function Jumbotron() {
  return () => {
    return (
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Viewfly (keyed)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="run"
                  onClick={run}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="runlots"
                  onClick={runLots}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="add"
                  onClick={add}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="update"
                  onClick={update}
                >
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="clear"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="swaprows"
                  onClick={swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function Row(props: Model) {
  const isSelected = createDerived(() => {
    return selected() === props.id
  })
  return () => {
    const { id, label } = props
    return <tr class={{ danger: isSelected() }}>
      <td class="col-md-1">{id}</td>
      <td class="col-md-4">
        <a>{label}</a>
      </td>
      <td class="col-md-1">
        <a>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  }
}

function Table() {
  return () => {
    return (
      <table class="table table-hover table-striped test-data" onClick={(event) => {
        // eslint-disable-next-line no-undef
        const el = event.target as HTMLTableElement
        const id = Number(el.closest('tr')!.firstChild!.textContent)
        if (el.matches('.glyphicon-remove')) {
          remove(id)
        } else {
          select(id)
        }
        return false;
      }}>
        <tbody>
        {
          rows().map(row => {
            return <Row key={row.id} id={row.id} label={row.label} />
          })
        }
        </tbody>
      </table>
    )
  }
}

function App() {
  return () => {
    return (
      <>
        <Jumbotron />
        <Table />
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
      </>
    )
  }
}

// eslint-disable-next-line no-undef
createApp(<App />).mount(document.querySelector('#main')!)
