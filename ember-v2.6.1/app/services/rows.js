import Ember from 'ember';

function _random(max) {
  return Math.round(Math.random()*1000)%max;
}

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
};

export default Ember.Service.extend({
  data: [],
  selected: undefined,
  id: 1,
  init() {
  },
  buildData(count = 1000) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++) {
      var row = {
        identifier: this.id++,
        label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
      };
      data.push(row);
    }
    return data;
  },
  updateData(mod = 10) {
    var data = this.data.map(function(data, i) {
      if (i%mod === 0) {
        return Object.assign({}, data, {label: data.label + ' !!!'});
      } else {
        return data;
      }
    });
    return data;
  },
  remove(id) {
    startMeasure("delete");
    this.set('data', this.data.filter((d) => d.identifier!==id));
    this.set('selected', undefined);
    stopMeasure();
  },
  run() {
    startMeasure("run");
    this.set('data', this.buildData());
    this.set('selected', undefined);
    stopMeasure();
  },
  add() {
    startMeasure("add");
    this.set('data', this.data.concat(this.buildData(1000)));
    stopMeasure();
  },
  update() {
    startMeasure("update");
    this.set('data', this.updateData());
    stopMeasure();
  },
  select(id) {
    startMeasure("select");
    this.set('selected', id);
    stopMeasure();
  },
  runLots() {
	startMeasure("runLots");
    this.set('data', this.buildData(10000));
    this.set('selected', undefined);
	stopMeasure();
  },
  clear() {
	startMeasure("clear");
    this.set('data', []);
    this.set('selected', undefined);
	stopMeasure();
  },
  swapRows() {
  	startMeasure("swapRows");
    if(this.data.length > 10) {
	  let d4 = this.data[4];
	  let d9 = this.data[9];

	  var data = this.data.map(function(data, i) {
	    if(i === 4) {
	    	return d9;
	    }
	    else if(i === 9) {
	    	return d4;
	    }
	    return data;
	  });
	  this.set('data', data);
	}
	stopMeasure();
  }
});
