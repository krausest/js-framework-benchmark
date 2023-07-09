import DLight, { View, render } from "@dlightjs/dlight"

let idCounter = 1

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

function _random(max) { return Math.round(Math.random() * 1000) % max };

function buildData(count) {
  const data = new Array(count)
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
  }
  return data
}

class Main extends View {
  rows = []
  selectIdx = -1
  addRows() {
    this.rows = buildData(1000)
  }

  swapRows() {
    if (this.rows.length > 999) {
      this.rows = [this.rows[0], this.rows[998], ...this.rows.slice(2, 998), this.rows[1], this.rows[999]]
    }
  }

  clearRows() {
    this.rows = []
  }

  selectRow(idx) {
    return () => { this.selectIdx = idx }
  }

  deleteRow(id) {
    return () => {
      const idx = this.rows.findIndex(row => row.id === id)
      this.rows = [...this.rows.slice(0, idx), ...this.rows.slice(idx + 1)]
    }
  }

  addBig() {
    this.rows = buildData(10000)
  }

  append() {
    this.rows = [...this.rows, ...buildData(1000)]
  }

  update() {
    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += " !!!"
    }
    this.rows = [...this.rows]
  }

  @SubView
  Button({ _$content, text, id, onclick }) {
    div()
      .className("col-sm-6 smallpad")
    {
      button(_$content ?? text)
        .onclick(onclick)
        .id(id)
        .className("btn btn-primary btn-block")
    }
  }

  @SubView
  Jumbotron() {
    div()
      .className("jumbotron")
    {
      div()
        .className("row")
      {
        div()
          .className("col-sm-6")
        {
          h1("DLight.js (non-keyed)")
        }
        div()
          .className("col-md-6")
        {
          div()
            .className("row")
          {
            this.Button("Create 1,000 rows")
              .onclick(this.addRows.bind(this))
              .id("run")
            this.Button("Create 10,000 rows")
              .onclick(this.addBig.bind(this))
              .id("runlots")
            this.Button("Append 1,000 rows")
              .onclick(this.append.bind(this))
              .id("add")
            this.Button("Update every 10th rows")
              .onclick(this.update.bind(this))
              .id("update")
            this.Button("Clear")
              .onclick(this.clearRows.bind(this))
              .id("clear")
            this.Button("Swap Rows")
              .onclick(this.swapRows.bind(this))
              .id("swaprows")
          }
        }
      }
    }
  }

  Body() {
    div()
      .className("container")
    {
      this.Jumbotron()
      div()
      {
        table()
          .className("table table-hover table-striped test-data")
        {
          tbody()
          {
            for (const { id, label } of this.rows) {
              [null]
              tr()
                .className(this.selectIdx === id ? "danger" : "")
              {
                td(id)
                  .className("col-md-1")
                td()
                  .className("col-md-4")
                {
                  a(label)
                    .onclick(this.selectRow(id))
                }
                td()
                  .className("col-md-1")
                {
                  a()
                    .onclick(this.deleteRow(id))
                  {
                    span()
                      .className("glyphicon glyphicon-remove")
                      .ariaHidden("true")
                  }
                }
                td()
                  .className("col-md-6")
              }
            }
          }
        }
        span()
          .className("preloadicon glyphicon glyphicon-remove")
          .ariaHidden("true")
      }
    }
  }
}

render("main", Main)
