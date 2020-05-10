import { h, Lazy, app } from "hyperapp"
import { buildData } from "./store"

const updateRow = (id, label) => ({
  id,
  label: label + " !!!",
})

const append1K = (state) => ({
  data: state.data.concat(buildData(1000)),
})

const create1K = () => ({
  data: buildData(1000),
})

const create10K = () => ({
  data: buildData(10000),
})

const clearAllRows = () => ({
  data: [],
})

const deleteRow = (state, id) => ({
  data: state.data.filter((d) => d.id !== id),
})

const updateEveryTenth = (state) => ({
  data: state.data.map((d, i) => (i % 10 === 0 ? updateRow(d.id, d.label) : d)),
  selected: undefined,
})

const selectRow = (state, id) => ({
  data: state.data,
  selected: id,
})

const swapRows = (state) => {
  if (state.data.length <= 998) return state

  const temp = state.data[1]
  state.data[1] = state.data[998]
  state.data[998] = temp

  return {
    data: state.data,
    selected: state.selected,
  }
}

const Row = ({ data, label, styleClass }) =>
  h(
    "tr",
    { key: data.id, class: styleClass },
    h("td", { class: "col-md-1" }, data.id),
    h(
      "td",
      { class: "col-md-4" },
      h("a", { onclick: [selectRow, data.id] }, label)
    ),
    h(
      "td",
      { class: "col-md-1" },
      h(
        "a",
        { onclick: [deleteRow, data.id] },
        h("span", {
          class: "glyphicon glyphicon-remove",
          "aria-hidden": "true",
        })
      )
    ),
    h("td", { class: "col-md-6" })
  )

const LazyRow = ({ data, label, styleClass }) =>
  Lazy({ view: Row, data, label, styleClass })

app({
  init: {
    data: [],
    selected: false,
  },
  view: (state) =>
    h(
      "div",
      { class: "container" },
      h(
        "div",
        { class: "jumbotron" },
        h(
          "div",
          { class: "row" },
          h("div", { class: "col-md-6" }, h("h1", null, "Hyperapp")),
          h(
            "div",
            { class: "col-md-6" },
            h(
              "div",
              { class: "row" },
              h(
                "div",
                { class: "col-sm-6 smallpad" },
                h(
                  "button",
                  {
                    type: "button",
                    class: "btn btn-primary btn-block",
                    id: "run",
                    onclick: create1K,
                  },
                  "Create 1,000 rows"
                )
              ),
              h(
                "div",
                { class: "col-sm-6 smallpad" },
                h(
                  "button",
                  {
                    type: "button",
                    class: "btn btn-primary btn-block",
                    id: "runlots",
                    onclick: create10K,
                  },
                  "Create 10,000 rows"
                )
              ),
              h(
                "div",
                { class: "col-sm-6 smallpad" },
                h(
                  "button",
                  {
                    type: "button",
                    class: "btn btn-primary btn-block",
                    id: "add",
                    onclick: append1K,
                  },
                  "Append 1,000 rows"
                )
              ),
              h(
                "div",
                { class: "col-sm-6 smallpad" },
                h(
                  "button",
                  {
                    type: "button",
                    class: "btn btn-primary btn-block",
                    id: "update",
                    onclick: updateEveryTenth,
                  },
                  "Update every 10th row"
                )
              ),
              h(
                "div",
                { class: "col-sm-6 smallpad" },
                h(
                  "button",
                  {
                    type: "button",
                    class: "btn btn-primary btn-block",
                    id: "clear",
                    onclick: clearAllRows,
                  },
                  "Clear"
                )
              ),
              h(
                "div",
                { class: "col-sm-6 smallpad" },
                h(
                  "button",
                  {
                    type: "button",
                    class: "btn btn-primary btn-block",
                    id: "swaprows",
                    onclick: swapRows,
                  },
                  "Swap Rows"
                )
              )
            )
          )
        )
      ),
      h(
        "table",
        { class: "table table-hover table-striped test-data" },
        h(
          "tbody",
          null,
          state.data.map((data) =>
            LazyRow({
              data,
              label: data.label,
              styleClass: data.id === state.selected ? "danger" : "",
            })
          )
        )
      ),
      h("span", {
        class: "preloadicon glyphicon glyphicon-remove",
        "aria-hidden": "true",
      })
    ),
  node: document.getElementById("app"),
})
