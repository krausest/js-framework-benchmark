import { render, elementFactory } from 'skruv'
import { buildData } from "./store.js"
const { tbody, tr, td, span, a } = elementFactory

let data = []
let selected = {}

const spacer = td({ class: "col-md-6" })
const icon = span({ class: "glyphicon glyphicon-remove", "aria-hidden": "true" })
const singleAttr = { class: "col-md-1" }
const quadrupleAttr = { class: "col-md-4" }
const tbodyAttr = { id: 'container' }

const doRender = () => render(
  tbody(tbodyAttr,
    data.map((row) => tr({
      class: (row === selected) && "danger",
      skruvKey: row
    },
      td(singleAttr, row.id),
      td(quadrupleAttr,
        a({
          onclick: () => {
            selected.selected = false
            row.selected = true
            selected = row
            doRender()
          }
        }, row.label),
      ),
      td(singleAttr,
        a({
          onclick: () => {
            data.splice(data.indexOf(row), 1)
            doRender()
          }
        },
          icon
        )
      ),
      spacer
    ))
  ),
  container
)

run.onclick = () => {
  data = buildData()
  doRender()
}

runlots.onclick = () => {
  data = buildData(10000)
  doRender()
}

add.onclick = () => {
  data.push(...buildData())
  doRender()
}

update.onclick = () => {
  for (let i = 0; i < data.length; i += 10) {
    data[i].label += " !!!"
  }
  doRender()
}

clear.onclick = () => {
  data = []
  doRender()
}

swaprows.onclick = () => {
  [data[1], data[998]] = [data[998], data[1]]
  doRender()
}
