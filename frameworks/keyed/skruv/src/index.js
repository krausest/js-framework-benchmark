import { render, elementFactory } from 'skruv'
import { buildData } from "./store.js"
const { body, table, tbody, tr, td, span, div, button, h1, a } = elementFactory

const deleteRow = (row) => {
  state.data.splice(state.data.indexOf(row), 1)
  doRender()
}

const selectRow = (row) => {
  state.selected = row
  doRender()
}

const state = {
  data: [],
  selected: false,
}

const doRender = () => render(
  body(
    div({ class: "container" },
      div({ class: "jumbotron" },
        div({ class: "row" },
          div({ class: "col-md-6" }, h1("skruv")),
          div({ class: "col-md-6" },
            div({ class: "row" },
              div({ class: "col-sm-6 smallpad" },
                button({
                  type: "button",
                  class: "btn btn-primary btn-block",
                  id: "run",
                  onclick: () => {
                    state.data = buildData()
                    doRender()
                  },
                },
                  "Create 1,000 rows"
                )
              ),
              div({ class: "col-sm-6 smallpad" },
                button({
                  type: "button",
                  class: "btn btn-primary btn-block",
                  id: "runlots",
                  onclick: () => {
                    state.data = buildData(10000)
                    doRender()
                  },
                },
                  "Create 10,000 rows"
                )
              ),
              div({ class: "col-sm-6 smallpad" },
                button({
                  type: "button",
                  class: "btn btn-primary btn-block",
                  id: "add",
                  onclick: () => {
                    state.data.push(...buildData())
                    doRender()
                  },
                },
                  "Append 1,000 rows"
                )
              ),
              div({ class: "col-sm-6 smallpad" },
                button({
                  type: "button",
                  class: "btn btn-primary btn-block",
                  id: "update",
                  onclick: () => {
                    for (let i = 0; i < state.data.length; i++) {
                      if (i % 10 === 0) {
                        state.data[i].label += " !!!"
                      }
                    }
                    doRender()
                  },
                },
                  "Update every 10th row"
                )
              ),
              div({ class: "col-sm-6 smallpad" },
                button({
                  type: "button",
                  class: "btn btn-primary btn-block",
                  id: "clear",
                  onclick: () => {
                    state.data = []
                    doRender()
                  },
                },
                  "Clear"
                )
              ),
              div({ class: "col-sm-6 smallpad" },
                button({
                  type: "button",
                  class: "btn btn-primary btn-block",
                  id: "swaprows",
                  onclick: () => {
                    const temp = state.data[1]
                    state.data[1] = state.data[998]
                    state.data[998] = temp
                    doRender()
                  },
                },
                  "Swap Rows"
                )
              )
            )
          )
        )
      ),
      table({ class: "table table-hover table-striped test-data" },
      tbody(
        state.data.map((data) => tr({
          class: (data.selected = data === state.selected) && "danger",
          'data-skruv-key': data
        },
          td({ class: "col-md-1" }, data.id),
          td({ class: "col-md-4" },
            a({ onclick: () => selectRow(data) }, data.label),
          ),
          td({ class: "col-md-1" },
            a({ onclick: () => deleteRow(data) },
              span({
                class: "glyphicon glyphicon-remove",
                "aria-hidden": "true",
              })
            ),
          ),
          td({ class: "col-md-6" }),
        ))
      )
      ),
      span({
        class: "preloadicon glyphicon glyphicon-remove",
        "aria-hidden": "true"
      })
    )
  ),
  document.querySelector('body')
)

doRender()
