import { repeat } from 'lit-html/lib/repeat';
import { html, render } from 'lit-html/lib/lit-extended';

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

class MainElement extends HTMLElement {
    constructor() {
      super();

      this.data = []
      this.did = 1;
      this.selected = 0;

      this.add = this.add.bind(this);
      this.run = this.run.bind(this);
      this.runLots = this.runLots.bind(this);
      this.clear = this.clear.bind(this);
      // this.del = this.del.bind(this);
      // this.select = this.select.bind(this);
      this.swapRows = this.swapRows.bind(this);
      this.update = this.update.bind(this);
      this.select = this.select.bind(this);
      this.click = this.click.bind(this);
    }

    connectedCallback() {
      this.render();
    }

    add() {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
        this.render();
        stopMeasure();
    }
    run() {
        startMeasure("run");
        this.data = this.buildData(1000);
        this.render();
        stopMeasure();
    }
    runLots() {
        startMeasure("runLots");
        this.data = this.buildData(10000);
        this.render();
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        this.data = [];
        this.render();
        stopMeasure();
    }
    del(id) {
        startMeasure("delete");
        const idx = this.data.findIndex(d => d.id === id);
        this.data.splice(idx, 1);
        this.render();
        stopMeasure();
    }
    select(id) {
        startMeasure("select");
        this.selected = parseInt(id);
        this.render();
        stopMeasure();
    }
    swapRows() {
        startMeasure("swapRows");
        if(this.data.length > 998) {
            var tmp = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = tmp;
        }
        this.render();
        stopMeasure();
    }
    update() {
        startMeasure("update");
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
        this.render();
        stopMeasure();
    }
    rowClass(id, selected) {
        return id === selected ? "danger" : '';
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

    render() {
      render(this.template, this)
    }

    get template() {
      const template = html`
<div class="container" >
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Lit-HTML</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" on-click=${this.run}>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" on-click=${this.runLots}>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="add" on-click=${this.add}>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="update" on-click=${this.update}>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="clear" on-click=${this.clear}>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="swaprows" on-click=${this.swapRows}>Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody>${repeat(this.data, (item) => item.id, (item, index) => html`
            <tr class$="${this.rowClass(item.id, this.selected)}">
              <td class="col-md-1">${item.id}</td>
              <td class="col-md-4">
                  <a on-click="${(e) => { this.select(item.id) }}">${item.label}</a>
              </td>
              <td class="col-md-1"><a on-click="${(e) => { this.del(item.id) }}"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
              <td class="col-md-6"></td>
            </tr>`)}
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`
      return template;
    }
}

window.customElements.define('html-element', MainElement);
