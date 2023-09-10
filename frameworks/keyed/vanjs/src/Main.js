import van from "vanjs-core"

let {add, state, derive, tags: {"a": a, "span": span, "td": td, "tr": tr}} = van

let curId = 0, rows = [], numDeleted = 0, selected = state(null)
let bodyDom = document.getElementById("tbody")

let gcDeleted = () =>
  (++numDeleted * 2 > rows.length) && (rows = rows.filter(r => !r._deleted.val), numDeleted = 0)

derive(() => {
  let {val, oldVal} = selected
  if (oldVal) {
    let oldDom = document.getElementById(oldVal)
    if (oldDom) oldDom.className = ""
  }
  if (val) document.getElementById(val).className = "danger"
})

let Row = ({_id, _label, _deleted}) => () => _deleted.val ? null : tr({id: _id},
  td({"class": "col-md-1"}, _id),
  td({"class": "col-md-4"}, a({onclick: () => selected.val = _id}, _label)),
  td({"class": "col-md-1"},
    a({onclick: () => (_deleted.val = true, gcDeleted())},
      span({"class": "glyphicon glyphicon-remove", "aria-hidden": true}),
    ),
  ),
  td({"class": "col-md-6"}),
)

let adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
let colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
let nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

let random = max => Math.round(Math.random() * 1000) % max;

let clear = () => (bodyDom.textContent = "", rows = [], numDeleted = 0, selected.val = null)

let addRows = (reset, count) => {
  reset && clear()
  for (let i = 0; i < count; ++i) {
    let row = {
      _id: ++curId,
      _label: state(`${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`),
      _deleted: state(false),
    }
    add(bodyDom, Row(row))
    rows.push(row)
  }
}

document.getElementById("run").addEventListener("click", addRows.bind(null, true, 1000))
document.getElementById("runlots").addEventListener("click", addRows.bind(null, true, 10000))
document.getElementById("add").addEventListener("click", addRows.bind(null, false, 1000))

document.getElementById("update").addEventListener("click", () => {
  if (numDeleted) rows = rows.filter(r => !r._deleted.val), numDeleted = 0
  for (let i = 0; i < rows.length; i += 10) rows[i]._label.val += " !!!"
})

document.getElementById("clear").addEventListener("click", clear)

document.getElementById("swaprows").addEventListener("click", () => {
  if (numDeleted) rows = rows.filter(r => !r._deleted.val), numDeleted = 0
  if (rows.length > 998) {
    let tmp = rows[1]
    rows[1] = rows[998]
    rows[998] = tmp

    tmp = span()
    let dom1 = bodyDom.childNodes[1], dom2 = bodyDom.childNodes[998]
    dom1.replaceWith(tmp)
    dom2.replaceWith(dom1)
    tmp.replaceWith(dom2)
  }
})
