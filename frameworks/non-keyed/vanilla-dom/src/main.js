'use strict';
import template from './template.html'

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}


class VanillaDomComponent {
  constructor() {
    this.did = 1
    this.state = {
      data: []
    }
    this.render = template.bind(this)(window.document.body) 
  }
  add() {
      startMeasure("add");
      this.state.data = this.state.data.concat(this.buildData(1000));
      this.render(this.state)
      stopMeasure();
  }
  run() {
      startMeasure("run");
      this.state.data = this.buildData(1000);
      this.render(this.state)
      stopMeasure();
  }
  runLots() {
      startMeasure("runLots");
      this.state.data = this.buildData(10000);
      this.render(this.state)
      stopMeasure();
  }
  clear() {
      startMeasure("clear");
      this.state.data = [];
      this.render(this.state)
      stopMeasure();
  }
  del(e) {
      startMeasure("delete");
      this.state.data.splice(e.target.dataset['index'], 1);
      this.render(this.state)
      stopMeasure();
  }
  select(e) {
    startMeasure("select");
    this.selected = e.target.dataset['index']
    this.render(this.state)
    stopMeasure();
  }
  swapRows() {
    startMeasure("swapRows");
    if(this.state.data.length > 998) {
        var tmp = this.state.data[1];
        this.state.data[1] = this.state.data[998];
        this.state.data[998] = tmp;
    }
    this.render(this.state)
    stopMeasure();
  }
  update() {
      startMeasure("update");
      for (let i=0;i<this.state.data.length;i+=10) {
          this.state.data[i].label =  this.state.data[i].label + ' !!!'
      }
      this.render(this.state)
      stopMeasure();
  }
  handleClick(e) {
    if(e.target.matches('.select')) {
      this.select(e)      
    }
    if(e.target.matches('.remove')) {
      this.del(e)
    }
  }
  itemClass(index) {
    return this.selected == index ? 'danger' : ''
  }
  buildData(count) {
      var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
      var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
      var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
      var data = [];
      for (var i = 0; i < count; i++) {
          data.push({ id: this.did++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
      }
      return data;
  }
  _random(max) {
      return Math.round(Math.random() * 1000) % max;
  }
}
new VanillaDomComponent()
