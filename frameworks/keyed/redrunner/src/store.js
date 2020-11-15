/*
This only contains the data and data operations.
The only framework code is the call to `mainView.update()`
*/

import {buildData} from './data'

function Store() {
  this.root = undefined
  this.items = []
  this.selected = 0
  this.run = function() {
    this.items = buildData(1000)
    this.selected = 0
    this.root.update()
  }
  this.runLots = function() {
    this.items = buildData(10000)
    this.selected = 0
    this.root.update()
  }
  this.add = function() {
    this.items = this.items.concat(buildData(1000))
    this.root.update()
  }
  this.update10th = function() {
    const data = this.items;
    for (let i = 0; i < data.length; i += 10) {
      const item = data[i];
      data[i] = {id: item.id, label: item.label + ' !!!'}
    }
    this.root.update()
  }
  this.select = function(item) {
    this.selected = item.id
    this.root.update()
  }
  this.remove = function(item) {
    this.items.splice(this.items.indexOf(item), 1)
    this.root.update()
  }
  this.clear = function() {
    this.items = []
    this.selected = 0
    this.root.update()
  }
  this.swapRows = function() {
    const items = this.items
    if (items.length > 998) {
      const temp = items[1]
      items[1] = items[998]
      items[998] = temp
    }
    this.root.update()
  }
}

export const store = new Store()