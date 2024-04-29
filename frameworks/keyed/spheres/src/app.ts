import { HTMLView, WithArgs, htmlTemplate, renderToDOM } from "spheres/view"
import { RowData, rows, selectRow } from "./state.js"
import { GetState, Store, StoreMessage, rule, use, write } from "spheres/store"

const app = htmlTemplate(() => root => {
  root.div(el => {
    el.config.class("container")
    el.children
      .div(el => {
        el.config.class("jumbotron")
        el.children.div(el => {
          el.config.class("row")
          el.children
            .div(el => {
              el.config.class("col-md-6")
              el.children.h1(el => {
                el.children.textNode("Spheres")
              })
            })
            .div(el => {
              el.config.class("col-md-6")
              el.children.div(el => {
                el.config.class("row")
                el.children
                  .zone(button({
                    id: "run",
                    title: "Create 1,000 rows",
                    handler: () => write(rows, { type: "set", count: 1000 })
                  }))
                  .zone(button({
                    id: "runlots",
                    title: "Create 10,000 rows",
                    handler: () => write(rows, { type: "set", count: 10000 })
                  }))
                  .zone(button({
                    id: "add",
                    title: "Append 1,000 rows",
                    handler: () => write(rows, { type: "add", count: 1000 })
                  }))
                  .zone(button({
                    id: "update",
                    title: "Update every 10th row",
                    handler: () => write(rows, { type: "update" })
                  }))
                  .zone(button({
                    id: "clear",
                    title: "Clear",
                    handler: () => write(rows, { type: "clear" })
                  }))
                  .zone(button({
                    id: "swaprows",
                    title: "Swap Rows",
                    handler: () => write(rows, { type: "swap" })
                  }))
              })
            })
        })
      })
      .table(el => {
        el.config
          .class("table table-hover table-striped test-data")
        el.children.zone(tableBody)
      })
      .span(el => {
        el.config
          .class("preloadicon glyphicon glyphicon-remove")
          .aria("hidden", "true")
      })
  })
})

function tableBody(get: GetState): HTMLView {
  const rowData = get(rows)

  return root =>
    root.tbody(el => {
      for (let i = 0; i < rowData.length; i++) {
        const data = rowData[i]
        el.children.zone(tableRow(data), { key: data.id })
      }
    })
}

const tableRow = htmlTemplate((withArgs: WithArgs<RowData>) => {
  return root =>
    root.tr(el => {
      el.config
        .class(withArgs((props, get) => get(props.isSelected) ? "danger" : undefined))
      el.children
        .td(el => {
          el.config.class("col-md-1")
          el.children.textNode(withArgs((props) => `${props.id}`))
        })
        .td(el => {
          el.config.class("col-md-4")
          el.children
            .a(el => {
              el.config
                .class("lbl")
                .on("click", () => use(selectRow, withArgs((props) => props)))
              el.children.textNode(withArgs((props, get) => get(props.label)))
            })
        })
        .td(el => {
          el.config.class("col-md-1")
          el.children
            .a(el => {
              el.config
                .class("remove")
                .on("click", () => use(rule(withArgs((props) => write(rows, { type: "remove", rowData: props })))))
              el.children
                .span(el => {
                  el.config
                    .class("remove glyphicon glyphicon-remove")
                    .aria("hidden", "true")
                })
            })
        })
        .td(el => {
          el.config.class("col-md-6")
        })
    })
})

interface ButtonContext {
  id: string
  title: string
  handler: () => StoreMessage<any>
}

const button = htmlTemplate((withArgs: WithArgs<ButtonContext>) => {
  return root => root.div(el => {
    el.config.class("col-sm-6 smallpad")
    el.children
      .button(el => {
        el.config
          .id(withArgs((props) => props.id))
          .class("btn btn-primary btn-block")
          .on("click", () => use(rule(withArgs((props) => props.handler()))))
        el.children.textNode(withArgs((props) => props.title))
      })
  })
})

const mountPoint = document.getElementById("main")

renderToDOM(new Store(), mountPoint!, app())