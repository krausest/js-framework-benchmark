import { r, e } from "@skruv/liten"

// State variables
let data = []
let selected
let id = 1

// init/element creation variables
const root = tbl
const { tr, td, a, span } = e

// Data generation
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]
const adjectivesLength = adjectives.length
const colorsLength = colors.length
const nounsLength = nouns.length
const buildData = (count, max = count + data.length) => {
  for (var i = data.length; i < max; i++) {
    data[i] = {
      i: "" + id++,
      l: adjectives[Math.random() * adjectivesLength | 0] + " " + colors[Math.random() * colorsLength | 0] + " " + nouns[Math.random() * nounsLength | 0]
    }
  }
  render()
}

// Reusable components
const emptyCol = td({ class: "col-md-6" })
const icon = a(false, span({ class: "glyphicon glyphicon-remove", "aria-hidden": "true" }))
const col1 = { class: "col-md-1" }

// Main render function
const render = () => r({
  t: "tbody",
  c: data.map(d => tr(
    { class: d.i === selected && "danger" },
    td(col1, d.i),
    td({
      class: "col-md-4",
      onclick: () => {
        selected = d.i
        render()
      }
    }, a(false, d.l)),
    td({
      class: "col-md-1",
      onclick: () => {
        data.splice(data.indexOf(d), 1)
        render()
      }
    }, icon),
    emptyCol
  ))
}, root)

// Input handlers
run.onclick = () => {
  data.length = 0
  buildData(1000)
}
runlots.onclick = () => {
  data.length = 0
  buildData(10000)
}
add.onclick = () => {
  buildData(1000)
}
update.onclick = () => {
  for (let i = 0; i < data.length; i += 10) {
    data[i].l += " !!!"
  }
  render()
}
clear.onclick = () => {
  data.length = 0
  render()
}
swaprows.onclick = () => {
  [data[1], data[998]] = [data[998], data[1]]
  render()
}
