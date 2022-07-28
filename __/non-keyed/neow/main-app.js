import { Component } from './node_modules/@neow/core/dist/index.js';

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        requestAnimationFrame(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

class Store {
    constructor() {
        this.data = [];
        this.backup = null;
        this.selected = null;
        this.id = 1;
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData() {
        for (let i=0;i<this.data.length;i+=10) {
            // this.data[i].label += ' !!!';
            this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
        }
    }
    delete(id) {
        id = parseInt(id);
        const idx = this.data.findIndex(d => d.id==id);
        this.data = this.data.filter((e,i) => i!=idx);
        return this;
    }
    run(amount) {
        this.data = this.buildData(amount);
        this.selected = null;
    }
    add(amount) {
        this.data = this.data.concat(this.buildData(amount));
        this.selected = null;
    }
    update() {
        this.updateData();
        this.selected = null;
    }
    select(id) {
        this.selected = parseInt(id);
    }
    hideAll() {
        this.backup = this.data;
        this.data = [];
        this.selected = null;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = null;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = null;
    }
    clear() {
        this.data = [];
        this.selected = null;
    }
    swapRows() {
        if(this.data.length > 10) {
            var a = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = a;
        }
    }
}

const store = new Store();

const App = class extends Component {
  static get template() {
    return /*html*/`
<link href="/css/currentStyle.css" rel="stylesheet" />
<div id='main'>
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>@neow/core</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                            <button onclick="{{this.create1k()}}" type='button' class='btn btn-primary btn-block' id='run'>Create 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button onclick="{{this.create10k()}}" type='button' class='btn btn-primary btn-block' id='runlots'>Create 10,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button onclick="{{this.append1k()}}" type='button' class='btn btn-primary btn-block' id='add'>Append 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button onclick="{{this.update10()}}" type='button' class='btn btn-primary btn-block' id='update'>Update every 10th row</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button onclick="{{this.testClear()}}" type='button' class='btn btn-primary btn-block' id='clear'>Clear</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button onclick="{{this.swap()}}" type='button' class='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-striped test-data">
            <tbody id="tbody" onclick="{{this.handleClick(event.target)}}">
                <tr #foreach="{{this.items}}">
                    <td class="col-md-1">{{value.id}}</td>
                    <td class="col-md-4">
                        <a role="select" data-id="{{value.id}}">{{value.label}}</a>
                    </td>
                    <td class="col-md-1">
                        <a>
                            <span role="delete" data-id="{{value.id}}" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td class="col-md-6">
                    </td>
                </tr>
            </tbody>
        </div>
    </div>
</div>
`;
  }
    
    getTotal() {
        return (this.items || []).length
    }

  handleClick(target) {
    switch (target.getAttribute('role')) {
      case 'delete':
        this.deleteOne(parseInt(target.dataset.id), target);
        break;
      case 'select':
        this.selectOne(parseInt(target.dataset.id), target);
        break;
    }
  }


  selectOne(id, target) {
    startMeasure('select');
    this.selectedId = id;
    store.select(id);
    this.selectedNode ? this.selectedNode.classList.remove('danger') : void 0;
    this.selectedNode = target.parentElement.parentElement;
    this.selectedNode.classList.add('danger');
    stopMeasure('select');
  }

  deleteOne(id) {
    startMeasure('delete');
    store.delete(id);
    this.selectedNode ? this.selectedNode.classList.remove('danger') : void 0;
    this.selectedNode = null;
    this.items = store.data;
    stopMeasure();
  }

    update10() {
        startMeasure('update');
        store.update();
        this.items = [...store.data];
        stopMeasure();
    }
  
    testClear() {
        startMeasure('clear');
        store.clear();
        this.items = store.data;
        stopMeasure();
    }
  
    append1k() {
        startMeasure('add');
        store.add(1000);
        this.items = store.data;
        stopMeasure();
    }
  
    swap() {
        startMeasure('swap');
        store.swapRows();
        this.items = store.data;
        stopMeasure();
    }
  
    create10k() {
        store.clear();
        store.runLots();
        startMeasure('runLots');
        this.items = store.data;
        stopMeasure();
    }

    create1k() {
        store.clear();
        store.run(1000);
        startMeasure('run');
        this.items = store.data;
        stopMeasure();
    }
}

customElements.define('main-element', App);