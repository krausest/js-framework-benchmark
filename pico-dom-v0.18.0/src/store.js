/*eslint indent:0 quotes:0*/
module.exports = Store

function _random(max) {
  return Math.round(Math.random()*1000)%max
}

function Store() {
  this.data = []
  this.backup = null
  this.selected = null
  this.id = 1
}
Store.prototype = {
  constructor: Store,
  buildData: function(count) {
    if (!(count >=0)) count = 1000
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]
    var data = []
    for (var i=0; i < count; ++i)
      data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] })
    return data
  },
  updateData: function(mod) {
    if (!(mod >=0)) mod = 1000
    for (var i=0; i<this.data.length; i+=10) {
      this.data[i].label += ' !!!'
    }
  },
  delete: function(id) {
    var idx = this.data.findIndex(function(d) { return d.id == id }) //eslint-disable-line eqeqeq
    this.data = this.data.filter(function(e,i) { return i != idx }) //eslint-disable-line eqeqeq
    return this
  },
  run: function() {
    this.data = this.buildData()
    this.selected = null
  },
  add: function() {
    this.data = this.data.concat(this.buildData(1000))
    this.selected = null
  },
  update: function() {
    this.updateData()
    this.selected = null
  },
  select: function(id) {
    this.selected = id
  },
  hideAll: function() {
    this.backup = this.data
    this.data = []
    this.selected = null
  },
  showAll: function() {
    this.data = this.backup
    this.backup = null
    this.selected = null
  },
  runLots: function() {
    this.data = this.buildData(10000)
    this.selected = null
  },
  clear: function() {
    this.data = []
    this.selected = null
  },
  swapRows: function() {
    if(this.data.length > 10) {
      var a = this.data[4]
      this.data[4] = this.data[9]
      this.data[9] = a
    }
  }
}
