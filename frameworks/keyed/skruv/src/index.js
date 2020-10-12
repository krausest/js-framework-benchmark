import { renderNode } from '../node_modules/skruv/vDOM.js'
import { createState } from '../node_modules/skruv/state.js'
import get from '../node_modules/skruv/cache.js'
import { body, table, tbody, tr, td, span, div, button, h1, a } from '../node_modules/skruv/html.js'
import { buildData } from "./store.js"

const updateRow = (id, label) => ({
  id,
  label: label + " !!!",
})

const append1K = () => {
  state.data = state.data.concat(buildData(1000))
}

const create1K = () => {
  state.data = buildData(1000)
}

const create10K = () => {
  state.data = buildData(10000)
}

const clearAllRows = () => {
  state.data = []
}

const deleteRow = (id) => {
  state.data = state.data.filter((d) => d.id.num !== id)
}

const updateEveryTenth = () => {
  state.data = state.data.map((d, i) => (i % 10 === 0 ? updateRow(d.id, d.label) : d))
  state.selected = undefined
}

const selectRow = (id) => {
  state.selected = id
}

const swapRows = () => {
  if (state.data.length <= 998) return

  const temp = state.data[1].toJSON
  state.data[1] = state.data[998].toJSON
  state.data[998] = temp
}

const Row = (data, selected) =>
  tr({ key: data.id, class: selected ? "danger" : "", }, [
    td({ class: "col-md-1" }, data.id.num),
    td({ class: "col-md-4" },
      a({ onclick: () => selectRow(data.id.num) }, data.label),
    ),
    td({ class: "col-md-1" },
      a({ onclick: () => deleteRow(data.id.num) },
        span({
          class: "glyphicon glyphicon-remove",
          "aria-hidden": "true",
        })
      ),
    ),
    td({ class: "col-md-6" }),
  ])

const vView = () => body({},
  div({ class: "container" }, [
    div({ class: "jumbotron" },
      div({ class: "row" }, [
        div({ class: "col-md-6" }, h1({}, "Skruv")),
        div({ class: "col-md-6" },
          div({ class: "row" }, [
            div({ class: "col-sm-6 smallpad" },
              button({
                type: "button",
                class: "btn btn-primary btn-block",
                id: "run",
                onclick: create1K,
              },
                "Create 1,000 rows"
              )
            ),
            div({ class: "col-sm-6 smallpad" },
              button({
                type: "button",
                class: "btn btn-primary btn-block",
                id: "runlots",
                onclick: create10K,
              },
                "Create 10,000 rows"
              )
            ),
            div({ class: "col-sm-6 smallpad" },
              button({
                type: "button",
                class: "btn btn-primary btn-block",
                id: "add",
                onclick: append1K,
              },
                "Append 1,000 rows"
              )
            ),
            div({ class: "col-sm-6 smallpad" },
              button({
                type: "button",
                class: "btn btn-primary btn-block",
                id: "update",
                onclick: updateEveryTenth,
              },
                "Update every 10th row"
              )
            ),
            div({ class: "col-sm-6 smallpad" },
              button({
                type: "button",
                class: "btn btn-primary btn-block",
                id: "clear",
                onclick: clearAllRows,
              },
                "Clear"
              )
            ),
            div({ class: "col-sm-6 smallpad" },
              button({
                type: "button",
                class: "btn btn-primary btn-block",
                id: "swaprows",
                onclick: swapRows,
              },
                "Swap Rows"
              )
            )
          ])
        )]
      )
    ),
    table({ class: "table table-hover table-striped test-data" },
      tbody({}, state.data.toJSON.map((data) => get(Row)(data, data.id.num === state.selected))
      )
    ),
    span({
      class: "preloadicon glyphicon glyphicon-remove",
      "aria-hidden": "true",
    })
  ])
)

let root = document.body

const render = () => { root = renderNode(vView, root) }

let scheduled = false
export const view = () => {
  if (scheduled) return
  scheduled = true
  window.requestAnimationFrame(() => {
    scheduled = false
    render()
  })
}

view()

const state = createState({
  data: [],
  selected: false,
}, view)
