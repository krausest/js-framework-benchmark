import { View, render } from "@dlightjs/dlight"

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

@View
class Main {
  rows = []
  selectIdx = -1

  addRows() {
    this.rows = buildData(1000)
  }

  swapRows() {
    if (this.rows.length > 998) {
      [this.rows[1], this.rows[998]] = [this.rows[998], this.rows[1]]
      this.rows = [...this.rows]
    }
  }

  clearRows() {
    this.rows = []
  }

  selectRow(idx) {
    this.selectIdx = idx
  }

  deleteRow(id) {
    this.rows = this.rows.filter(row => row.id !== id)
  }

  addBig() {
    this.rows = buildData(10000)
  }

  append() {
    this.rows = this.rows.concat(buildData(1000))
  }

  update() {
    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += " !!!"
    }
    this.rows = [...this.rows]
  }

  View() {
    div().class("container"); {
      div().class("jumbotron"); {
        div().class("row"); {
          div().class("col-sm-6"); {
            h1("DLight.js (keyed)")
          }
          div().class("col-md-6"); {
            div().class("row"); {
              div().class("col-sm-6 smallpad"); {
                button("Create 1,000 rows").onClick(this.addRows).id("run").class("btn btn-primary btn-block")
              }
              div().class("col-sm-6 smallpad"); {
                button("Create 10,000 rows").onClick(this.addBig).id("runlots").class("btn btn-primary btn-block")
              }
              div().class("col-sm-6 smallpad"); {
                button("Append 1,000 rows").onClick(this.append).id("add").class("btn btn-primary btn-block")
              }
              div().class("col-sm-6 smallpad"); {
                button("Update every 10th row").onClick(this.update).id("update").class("btn btn-primary btn-block")
              }
              div().class("col-sm-6 smallpad"); {
                button("Clear").onClick(this.clearRows).id("clear").class("btn btn-primary btn-block")
              }
              div().class("col-sm-6 smallpad"); {
                button("Swap Rows").onClick(this.swapRows).id("swaprows").class("btn btn-primary btn-block")
              }
            }
          }
        }
      }
      div(); {
        table().class("table table-hover table-striped test-data"); {
          tbody(); {
            for (const { id, label } of this.rows) {
              key: id
              tr().class(this.selectIdx === id ? "danger" : ""); {
                td(id).class("col-md-1")
                td().class("col-md-4"); {
                  a(label).onClick(this.selectRow.bind(this, id))
                }
                td().class("col-md-1"); {
                  a().onClick(this.deleteRow.bind(this, id)); {
                    span()
                      .class("glyphicon glyphicon-remove")
                      .ariaHidden("true")
                  }
                }
                td().class("col-md-6")
              }
            }
          }
        }
        span()
          .class("preloadicon glyphicon glyphicon-remove")
          .ariaHidden("true")
      }
    }
  }
}

render("main", Main)