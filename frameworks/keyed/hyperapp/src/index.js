import { h, Lazy, app } from "hyperapp"

let id = 1

const random = (max) => Math.round(Math.random() * 1000) % max

const adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
]

const colors = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
]

const nouns = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
]

const buildData = (count) => {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push({
      id: id++,
      label:
        adjectives[random(adjectives.length)] +
        " " +
        colors[random(colors.length)] +
        " " +
        nouns[random(nouns.length)],
    })
  }
  return result
}

const run = () => ({ data: buildData(1000) })

const add = (state) => ({ data: state.data.concat(buildData(1000)) })

const runLots = () => ({ data: buildData(10000) })

const clear = () => ({ data: [] })

const update = (state) => ({
  data: state.data.map((d, i) => ({
    id: d.id,
    label: i % 10 === 0 ? `${d.label} !!!` : d.label,
  })),
  selected: undefined,
})

const swapRows = (state) => {
  if (state.data.length <= 998) {
    return state
  }

  const temp = state.data[1]
  state.data[1] = state.data[998]
  state.data[998] = temp

  return {
    data: state.data,
    selected: state.selected,
  }
}

const selectRow = (state, id) => ({
  data: state.data,
  selected: id,
})

const deleteRow = (state, id) => ({
  data: state.data.filter((d) => d.id !== id),
  selected: state.selected,
})

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
                    onclick: run,
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
                    onclick: runLots,
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
                    onclick: add,
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
                    onclick: update,
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
                    onclick: clear,
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
  node: document.getElementById("main"),
})
