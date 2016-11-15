import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
var startTime;
var lastMeasure;
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
};
export var App = (function () {
    function App() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
        this.backup = undefined;
    }
    App.prototype.buildData = function (count) {
        if (count === void 0) { count = 1000; }
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    };
    App.prototype._random = function (max) {
        return Math.round(Math.random() * 1000) % max;
    };
    App.prototype.itemById = function (index, item) {
        return item.id;
    };
    App.prototype.select = function (item, event) {
        startMeasure("select");
        event.preventDefault();
        this.selected = item.id;
    };
    App.prototype.delete = function (item, event) {
        event.preventDefault();
        startMeasure("delete");
        for (var i = 0, l = this.data.length; i < l; i++) {
            if (this.data[i].id === item.id) {
                this.data.splice(i, 1);
                break;
            }
        }
    };
    App.prototype.run = function () {
        startMeasure("run");
        this.data = this.buildData();
    };
    App.prototype.add = function () {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
    };
    App.prototype.update = function () {
        startMeasure("update");
        for (var i = 0; i < this.data.length; i += 10) {
            this.data[i].label += ' !!!';
        }
    };
    App.prototype.runLots = function () {
        startMeasure("runLots");
        this.data = this.buildData(10000);
        this.selected = undefined;
    };
    App.prototype.clear = function () {
        startMeasure("clear");
        this.data = [];
        this.selected = undefined;
    };
    App.prototype.swapRows = function () {
        startMeasure("swapRows");
        if (this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
    };
    App.prototype.ngAfterViewChecked = function () {
        stopMeasure();
    };
    App.decorators = [
        { type: Component, args: [{
                    selector: 'my-app',
                    templateUrl: './app.html'
                },] },
    ];
    /** @nocollapse */
    App.ctorParameters = [];
    return App;
}());
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    imports: [BrowserModule],
                    declarations: [App],
                    bootstrap: [App]
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = [];
    return AppModule;
}());
//# sourceMappingURL=app.js.map