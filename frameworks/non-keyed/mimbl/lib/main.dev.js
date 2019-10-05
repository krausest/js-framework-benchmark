(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mimbl"));
	else if(typeof define === 'function' && define.amd)
		define(["mimbl"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("mimbl")) : factory(root["mimbl"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_mimbl__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Main.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Main.tsx":
/*!**********************!*\
  !*** ./src/Main.tsx ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mim = __webpack_require__(/*! mimbl */ "mimbl");
const Store_1 = __webpack_require__(/*! ./Store */ "./src/Store.js");
const TBody_1 = __webpack_require__(/*! ./TBody */ "./src/TBody.tsx");
// var startTime;
// var lastMeasure;
// var startMeasure = function(name) {
//     //console.timeStamp(name);
//     startTime = performance.now();
//     lastMeasure = name;
// }
// var stopMeasure = function() {
//     var last = lastMeasure;
//     if (lastMeasure) {
//         window.setTimeout(function () {
//             lastMeasure = null;
//             var stop = performance.now();
//             var duration = 0;
//             console.log(last+" took "+(stop-startTime));
//         }, 0);
//     }
// }
class Main extends mim.Component {
    constructor() {
        super();
        this.store = new Store_1.Store();
        this.tbody = new TBody_1.TBody(this);
        window.app = this;
    }
    // schedulePrintDuration() {
    //     this.callMe( () => stopMeasure(), false);
    // }
    run() {
        // startMeasure("run");
        this.tbody.run();
        // this.schedulePrintDuration();
    }
    add() {
        // startMeasure("add");
        this.tbody.add();
        // this.schedulePrintDuration();
    }
    update() {
        // startMeasure("update");
        this.tbody.update();
        // this.schedulePrintDuration();
    }
    runLots() {
        // startMeasure("runLots");
        this.tbody.runLots();
        // this.schedulePrintDuration();
    }
    clear() {
        // startMeasure("clear");
        this.tbody.clear();
        this.tbody = new TBody_1.TBody(this);
        this.updateMe();
        // this.schedulePrintDuration();
    }
    swapRows() {
        // startMeasure("swapRows");
        this.tbody.swapRows();
        // this.schedulePrintDuration();
    }
    onSelectRowClicked(row) {
        // startMeasure("select");
        this.tbody.onSelectRowClicked(row);
        // this.schedulePrintDuration();
    }
    onDeleteRowClicked(row) {
        // startMeasure("delete");
        this.tbody.onDeleteRowClicked(row);
        // this.schedulePrintDuration();
    }
    render() {
        return (mim.jsx("div", { class: "container" },
            mim.jsx("div", { class: "jumbotron" },
                mim.jsx("div", { class: "row" },
                    mim.jsx("div", { class: "col-md-6" },
                        mim.jsx("h1", null, "Mimbl (non-keyed)")),
                    mim.jsx("div", { class: "col-md-6" },
                        mim.jsx("div", { class: "row" },
                            mim.jsx("div", { class: "col-sm-6 smallpad" },
                                mim.jsx("button", { type: "button", class: "btn btn-primary btn-block", id: "run", click: this.run }, "Create 1,000 rows")),
                            mim.jsx("div", { class: "col-sm-6 smallpad" },
                                mim.jsx("button", { type: "button", class: "btn btn-primary btn-block", id: "runlots", click: this.runLots }, "Create 10,000 rows")),
                            mim.jsx("div", { class: "col-sm-6 smallpad" },
                                mim.jsx("button", { type: "button", class: "btn btn-primary btn-block", id: "add", click: this.add }, "Append 1,000 rows")),
                            mim.jsx("div", { class: "col-sm-6 smallpad" },
                                mim.jsx("button", { type: "button", class: "btn btn-primary btn-block", id: "update", click: this.update }, "Update every 10th row")),
                            mim.jsx("div", { class: "col-sm-6 smallpad" },
                                mim.jsx("button", { type: "button", class: "btn btn-primary btn-block", id: "clear", click: this.clear }, "Clear")),
                            mim.jsx("div", { class: "col-sm-6 smallpad" },
                                mim.jsx("button", { type: "button", class: "btn btn-primary btn-block", id: "swaprows", click: this.swapRows }, "Swap Rows")))))),
            mim.jsx("table", { class: "table table-hover table-striped test-data", updateStrategy: { allowKeyedNodeRecycling: false } }, this.tbody),
            mim.jsx("span", { class: "preloadicon glyphicon glyphicon-remove", "aria-hidden": "true" })));
    }
}
exports.Main = Main;
mim.mount(mim.jsx(Main, null), document.getElementById('main'));


/***/ }),

/***/ "./src/Row.tsx":
/*!*********************!*\
  !*** ./src/Row.tsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mim = __webpack_require__(/*! mimbl */ "mimbl");
class Row extends mim.Component {
    constructor(main, id, label) {
        super();
        this.main = main;
        this.id = id;
        this.label = label;
        this.selected = false;
    }
    setItem(newLabel, newSelectedID) {
        // let newSelected = this.id === newSelectedID;
        // if (newLabel !== this.label || this.selected !== newSelected)
        // 	this.updateMe();
        this.label = newLabel;
        this.selected = this.id === newSelectedID;
    }
    select(selected) {
        // if (this.selected !== selected)
        // 	this.updateMe();
        this.selected = selected;
    }
    onDeleteClicked() {
        this.main.onDeleteRowClicked(this);
    }
    onSelectClicked() {
        if (this.selected)
            return;
        this.selected = true;
        this.main.onSelectRowClicked(this);
        // this.updateMe();
    }
    render() {
        return mim.jsx("tr", { class: this.selected ? "danger" : undefined },
            mim.jsx("td", { class: "col-md-1" }, this.id),
            mim.jsx("td", { class: "col-md-4" },
                mim.jsx("a", { click: this.onSelectClicked }, this.label)),
            mim.jsx("td", { class: "col-md-1" },
                mim.jsx("a", { click: this.onDeleteClicked },
                    mim.jsx("span", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }))),
            mim.jsx("td", { class: "col-md-6" }));
    }
}
__decorate([
    mim.updatable
], Row.prototype, "label", void 0);
__decorate([
    mim.updatable
], Row.prototype, "selected", void 0);
exports.Row = Row;


/***/ }),

/***/ "./src/Store.js":
/*!**********************!*\
  !*** ./src/Store.js ***!
  \**********************/
/*! exports provided: Store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });


function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
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
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=mod) {
        	this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label + ' !!!'});
        }
    }
    delete(id) {
        var idx = this.data.findIndex(d => d.id === id);
        this.data.splice(idx, 1);
        if (this.selected === id)
            this.selected = undefined;
    }
    deleteByIndex(index) {
        this.data.splice(index, 1);
    }
    run() {
        this.data = this.buildData();
        this.selected = undefined;
    }
    add() {
        var newData = this.buildData(1000);
        this.data = this.data.concat(newData);
        return newData;
    }
    update() {
        this.updateData();
    }
    select(id) {
        this.selected = id;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    clear() {
        this.data = [];
        this.selected = undefined;
    }
    swapRows( n, m) {
    	if(this.data.length > n && this.data.length > m) {
    		var a = this.data[n];
    		this.data[n] = this.data[m];
    		this.data[m] = a;
    	}
    }
}

/***/ }),

/***/ "./src/TBody.tsx":
/*!***********************!*\
  !*** ./src/TBody.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mim = __webpack_require__(/*! mimbl */ "mimbl");
const Row_1 = __webpack_require__(/*! ./Row */ "./src/Row.tsx");
class TBody extends mim.Component {
    constructor(main) {
        super();
        this.main = main;
        this.store = main.store;
        this.rows = [];
    }
    run() {
        this.store.run();
        this.selectedRow = undefined;
        this.rows = this.store.data.map(item => new Row_1.Row(this.main, item.id, item.label));
        this.updateMe();
    }
    add() {
        this.store.add().forEach(item => this.rows.push(new Row_1.Row(this.main, item.id, item.label)));
        this.updateMe();
    }
    update() {
        this.store.update();
        this.store.data.forEach((item, i) => this.rows[i].setItem(item.label, this.store.selected));
    }
    runLots() {
        this.store.runLots();
        this.selectedRow = undefined;
        this.rows = this.store.data.map(item => new Row_1.Row(this.main, item.id, item.label));
        this.updateMe();
    }
    clear() {
        this.store.clear();
        this.selectedRow = undefined;
        this.rows = [];
    }
    swapRows() {
        if (this.rows.length > 998) {
            this.store.swapRows(1, 998);
            let tempRow = this.rows[1];
            this.rows[1] = this.rows[998];
            this.rows[998] = tempRow;
            this.updateMe();
        }
    }
    onSelectRowClicked(row) {
        this.store.select(row.id);
        if (this.selectedRow && this.selectedRow !== row)
            this.selectedRow.select(false);
        this.selectedRow = row;
    }
    onDeleteRowClicked(row) {
        this.store.delete(row.id);
        let index = this.rows.indexOf(row);
        this.rows.splice(index, 1);
        if (this.selectedRow === row)
            this.selectedRow = undefined;
        this.updateMe();
    }
    render() {
        return mim.jsx("tbody", null, this.rows);
    }
}
exports.TBody = TBody;


/***/ }),

/***/ "mimbl":
/*!**************************************************************************************!*\
  !*** external {"root":"mimbl","commonjs2":"mimbl","commonjs":"mimbl","amd":"mimbl"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_mimbl__;

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvTWFpbi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1Jvdy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1N0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9UQm9keS50c3giLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcInJvb3RcIjpcIm1pbWJsXCIsXCJjb21tb25qczJcIjpcIm1pbWJsXCIsXCJjb21tb25qc1wiOlwibWltYmxcIixcImFtZFwiOlwibWltYmxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztB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V0FBVyxLQUFLLEdBQUc7WUFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDM0IsQ0FBQztJQUVELGtCQUFrQixDQUFDLEdBQVE7UUFFdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssR0FBRztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUVqQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU07UUFFRixPQUFPLHVCQUNGLElBQUksQ0FBQyxJQUFJLENBQ04sQ0FBQztJQUNiLENBQUM7Q0FDSjtBQXBGRCxzQkFvRkM7Ozs7Ozs7Ozs7OztBQ3hGRCxtRCIsImZpbGUiOiJtYWluLmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIm1pbWJsXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIm1pbWJsXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBmYWN0b3J5KHJlcXVpcmUoXCJtaW1ibFwiKSkgOiBmYWN0b3J5KHJvb3RbXCJtaW1ibFwiXSk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX21pbWJsX18pIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9NYWluLnRzeFwiKTtcbiIsImltcG9ydCAqIGFzIG1pbSBmcm9tIFwibWltYmxcIlxyXG5pbXBvcnQge0lNYWluQ29udGFpbmVyfSBmcm9tIFwiLi9Sb3dcIlxyXG5pbXBvcnQge1N0b3JlfSBmcm9tIFwiLi9TdG9yZVwiXHJcbmltcG9ydCB7VEJvZHl9IGZyb21cIi4vVEJvZHlcIlxyXG5cclxuXHJcbi8vIHZhciBzdGFydFRpbWU7XHJcbi8vIHZhciBsYXN0TWVhc3VyZTtcclxuLy8gdmFyIHN0YXJ0TWVhc3VyZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuLy8gICAgIC8vY29uc29sZS50aW1lU3RhbXAobmFtZSk7XHJcbi8vICAgICBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuLy8gICAgIGxhc3RNZWFzdXJlID0gbmFtZTtcclxuLy8gfVxyXG4vLyB2YXIgc3RvcE1lYXN1cmUgPSBmdW5jdGlvbigpIHtcclxuLy8gICAgIHZhciBsYXN0ID0gbGFzdE1lYXN1cmU7XHJcbi8vICAgICBpZiAobGFzdE1lYXN1cmUpIHtcclxuLy8gICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgIGxhc3RNZWFzdXJlID0gbnVsbDtcclxuLy8gICAgICAgICAgICAgdmFyIHN0b3AgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuLy8gICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gMDtcclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2cobGFzdCtcIiB0b29rIFwiKyhzdG9wLXN0YXJ0VGltZSkpO1xyXG4vLyAgICAgICAgIH0sIDApO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpbiBleHRlbmRzIG1pbS5Db21wb25lbnQgaW1wbGVtZW50cyBJTWFpbkNvbnRhaW5lclxyXG57XHJcbiAgICBzdG9yZTogU3RvcmU7XHJcbiAgICB0Ym9keTogVEJvZHk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMudGJvZHkgPSBuZXcgVEJvZHkoIHRoaXMpO1xyXG5cclxuICAgICAgICAod2luZG93IGFzIGFueSkuYXBwID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBzY2hlZHVsZVByaW50RHVyYXRpb24oKSB7XHJcbiAgICAvLyAgICAgdGhpcy5jYWxsTWUoICgpID0+IHN0b3BNZWFzdXJlKCksIGZhbHNlKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBydW4oKVxyXG4gICAge1xyXG4gICAgICAgIC8vIHN0YXJ0TWVhc3VyZShcInJ1blwiKTtcclxuICAgICAgICB0aGlzLnRib2R5LnJ1bigpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFkZCgpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwiYWRkXCIpO1xyXG4gICAgICAgIHRoaXMudGJvZHkuYWRkKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZVByaW50RHVyYXRpb24oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICAvLyBzdGFydE1lYXN1cmUoXCJ1cGRhdGVcIik7XHJcbiAgICAgICAgdGhpcy50Ym9keS51cGRhdGUoKTtcclxuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlUHJpbnREdXJhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBydW5Mb3RzKClcclxuICAgIHtcclxuICAgICAgICAvLyBzdGFydE1lYXN1cmUoXCJydW5Mb3RzXCIpO1xyXG4gICAgICAgIHRoaXMudGJvZHkucnVuTG90cygpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyKClcclxuICAgIHtcclxuICAgICAgICAvLyBzdGFydE1lYXN1cmUoXCJjbGVhclwiKTtcclxuICAgICAgICB0aGlzLnRib2R5LmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy50Ym9keSA9IG5ldyBUQm9keSggdGhpcyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN3YXBSb3dzKClcclxuICAgIHtcclxuICAgICAgICAvLyBzdGFydE1lYXN1cmUoXCJzd2FwUm93c1wiKTtcclxuICAgICAgICB0aGlzLnRib2R5LnN3YXBSb3dzKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZVByaW50RHVyYXRpb24oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25TZWxlY3RSb3dDbGlja2VkKCByb3cpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwic2VsZWN0XCIpO1xyXG4gICAgICAgIHRoaXMudGJvZHkub25TZWxlY3RSb3dDbGlja2VkKHJvdyk7XHJcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZVByaW50RHVyYXRpb24oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25EZWxldGVSb3dDbGlja2VkKCByb3cpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwiZGVsZXRlXCIpO1xyXG4gICAgICAgIHRoaXMudGJvZHkub25EZWxldGVSb3dDbGlja2VkKHJvdyk7XHJcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZVByaW50RHVyYXRpb24oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVuZGVyKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImp1bWJvdHJvblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDE+TWltYmwgKG5vbi1rZXllZCk8L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgc21hbGxwYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tYmxvY2tcIiBpZD1cInJ1blwiIGNsaWNrPXt0aGlzLnJ1bn0+Q3JlYXRlIDEsMDAwIHJvd3M8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHNtYWxscGFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCIgaWQ9XCJydW5sb3RzXCIgY2xpY2s9e3RoaXMucnVuTG90c30+Q3JlYXRlIDEwLDAwMCByb3dzPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBzbWFsbHBhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiIGlkPVwiYWRkXCIgY2xpY2s9e3RoaXMuYWRkfT5BcHBlbmQgMSwwMDAgcm93czwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgc21hbGxwYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tYmxvY2tcIiBpZD1cInVwZGF0ZVwiIGNsaWNrPXt0aGlzLnVwZGF0ZX0+VXBkYXRlIGV2ZXJ5IDEwdGggcm93PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBzbWFsbHBhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiIGlkPVwiY2xlYXJcIiBjbGljaz17dGhpcy5jbGVhcn0+Q2xlYXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHNtYWxscGFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCIgaWQ9XCJzd2Fwcm93c1wiIGNsaWNrPXt0aGlzLnN3YXBSb3dzfT5Td2FwIFJvd3M8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXIgdGFibGUtc3RyaXBlZCB0ZXN0LWRhdGFcIiB1cGRhdGVTdHJhdGVneT17e2FsbG93S2V5ZWROb2RlUmVjeWNsaW5nOmZhbHNlfX0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy50Ym9keX1cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmVsb2FkaWNvbiBnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5taW0ubW91bnQoIDxNYWluLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpOyIsImltcG9ydCAqIGFzIG1pbSBmcm9tIFwibWltYmxcIlxyXG5cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYWluQ29udGFpbmVyXHJcbntcclxuICAgIG9uU2VsZWN0Um93Q2xpY2tlZCggcm93OiBSb3cpOiB2b2lkO1xyXG4gICAgb25EZWxldGVSb3dDbGlja2VkKCByb3c6IFJvdyk6IHZvaWQ7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJvdyBleHRlbmRzIG1pbS5Db21wb25lbnRcclxue1xyXG5cdG1haW46IElNYWluQ29udGFpbmVyO1xyXG5cclxuXHRpZDogbnVtYmVyO1xyXG5cdEBtaW0udXBkYXRhYmxlIGxhYmVsOiBzdHJpbmc7XHJcblx0QG1pbS51cGRhdGFibGUgc2VsZWN0ZWQ6IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBtYWluOiBJTWFpbkNvbnRhaW5lciwgaWQ6IG51bWJlciwgbGFiZWw6IHN0cmluZylcclxuXHR7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMubWFpbiA9IG1haW47XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmxhYmVsID0gbGFiZWw7XHJcblx0XHR0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRzZXRJdGVtKCBuZXdMYWJlbDogc3RyaW5nLCBuZXdTZWxlY3RlZElEOiBudW1iZXIpXHJcblx0e1xyXG5cdFx0Ly8gbGV0IG5ld1NlbGVjdGVkID0gdGhpcy5pZCA9PT0gbmV3U2VsZWN0ZWRJRDtcclxuXHJcblx0XHQvLyBpZiAobmV3TGFiZWwgIT09IHRoaXMubGFiZWwgfHwgdGhpcy5zZWxlY3RlZCAhPT0gbmV3U2VsZWN0ZWQpXHJcblx0XHQvLyBcdHRoaXMudXBkYXRlTWUoKTtcclxuXHJcblx0XHR0aGlzLmxhYmVsID0gbmV3TGFiZWw7XHJcblx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pZCA9PT0gbmV3U2VsZWN0ZWRJRDtcclxuXHR9XHJcblxyXG5cdHNlbGVjdCggc2VsZWN0ZWQ6IGJvb2xlYW4pXHJcblx0e1xyXG5cdFx0Ly8gaWYgKHRoaXMuc2VsZWN0ZWQgIT09IHNlbGVjdGVkKVxyXG5cdFx0Ly8gXHR0aGlzLnVwZGF0ZU1lKCk7XHJcblxyXG5cdFx0dGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG5cdH1cclxuXHJcblx0b25EZWxldGVDbGlja2VkKClcclxuXHR7XHJcblx0XHR0aGlzLm1haW4ub25EZWxldGVSb3dDbGlja2VkKCB0aGlzKTtcclxuXHR9XHJcblxyXG5cdG9uU2VsZWN0Q2xpY2tlZCgpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuc2VsZWN0ZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMubWFpbi5vblNlbGVjdFJvd0NsaWNrZWQoIHRoaXMpO1xyXG5cdFx0Ly8gdGhpcy51cGRhdGVNZSgpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKClcclxuXHR7XHJcblx0XHRyZXR1cm4gPHRyIGNsYXNzPXt0aGlzLnNlbGVjdGVkID8gXCJkYW5nZXJcIiA6IHVuZGVmaW5lZH0+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNvbC1tZC0xXCI+e3RoaXMuaWR9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY29sLW1kLTRcIj48YSBjbGljaz17dGhpcy5vblNlbGVjdENsaWNrZWR9Pnt0aGlzLmxhYmVsfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjb2wtbWQtMVwiPjxhIGNsaWNrPXt0aGlzLm9uRGVsZXRlQ2xpY2tlZH0+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj48L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY29sLW1kLTZcIj48L3RkPlxyXG5cdFx0PC90cj47XHJcblx0fVxyXG59XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBfcmFuZG9tKG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwKSVtYXg7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaWQgPSAxO1xyXG5cdH1cclxuICAgIGJ1aWxkRGF0YShjb3VudCA9IDEwMDApIHtcclxuICAgICAgICB2YXIgYWRqZWN0aXZlcyA9IFtcInByZXR0eVwiLCBcImxhcmdlXCIsIFwiYmlnXCIsIFwic21hbGxcIiwgXCJ0YWxsXCIsIFwic2hvcnRcIiwgXCJsb25nXCIsIFwiaGFuZHNvbWVcIiwgXCJwbGFpblwiLCBcInF1YWludFwiLCBcImNsZWFuXCIsIFwiZWxlZ2FudFwiLCBcImVhc3lcIiwgXCJhbmdyeVwiLCBcImNyYXp5XCIsIFwiaGVscGZ1bFwiLCBcIm11c2h5XCIsIFwib2RkXCIsIFwidW5zaWdodGx5XCIsIFwiYWRvcmFibGVcIiwgXCJpbXBvcnRhbnRcIiwgXCJpbmV4cGVuc2l2ZVwiLCBcImNoZWFwXCIsIFwiZXhwZW5zaXZlXCIsIFwiZmFuY3lcIl07XHJcbiAgICAgICAgdmFyIGNvbG91cnMgPSBbXCJyZWRcIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwiZ3JlZW5cIiwgXCJwaW5rXCIsIFwiYnJvd25cIiwgXCJwdXJwbGVcIiwgXCJicm93blwiLCBcIndoaXRlXCIsIFwiYmxhY2tcIiwgXCJvcmFuZ2VcIl07XHJcbiAgICAgICAgdmFyIG5vdW5zID0gW1widGFibGVcIiwgXCJjaGFpclwiLCBcImhvdXNlXCIsIFwiYmJxXCIsIFwiZGVza1wiLCBcImNhclwiLCBcInBvbnlcIiwgXCJjb29raWVcIiwgXCJzYW5kd2ljaFwiLCBcImJ1cmdlclwiLCBcInBpenphXCIsIFwibW91c2VcIiwgXCJrZXlib2FyZFwiXTtcclxuICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHtpZDogdGhpcy5pZCsrLCBsYWJlbDogYWRqZWN0aXZlc1tfcmFuZG9tKGFkamVjdGl2ZXMubGVuZ3RoKV0gKyBcIiBcIiArIGNvbG91cnNbX3JhbmRvbShjb2xvdXJzLmxlbmd0aCldICsgXCIgXCIgKyBub3Vuc1tfcmFuZG9tKG5vdW5zLmxlbmd0aCldIH0pO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRGF0YShtb2QgPSAxMCkge1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5sZW5ndGg7aSs9bW9kKSB7XHJcbiAgICAgICAgXHR0aGlzLmRhdGFbaV0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGFbaV0sIHtsYWJlbDogdGhpcy5kYXRhW2ldLmxhYmVsICsgJyAhISEnfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKGlkKSB7XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuZGF0YS5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBpZCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkID09PSBpZClcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGRlbGV0ZUJ5SW5kZXgoaW5kZXgpIHtcclxuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgdmFyIG5ld0RhdGEgPSB0aGlzLmJ1aWxkRGF0YSgxMDAwKTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmRhdGEuY29uY2F0KG5ld0RhdGEpO1xyXG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlRGF0YSgpO1xyXG4gICAgfVxyXG4gICAgc2VsZWN0KGlkKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgcnVuTG90cygpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgxMDAwMCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzd2FwUm93cyggbiwgbSkge1xyXG4gICAgXHRpZih0aGlzLmRhdGEubGVuZ3RoID4gbiAmJiB0aGlzLmRhdGEubGVuZ3RoID4gbSkge1xyXG4gICAgXHRcdHZhciBhID0gdGhpcy5kYXRhW25dO1xyXG4gICAgXHRcdHRoaXMuZGF0YVtuXSA9IHRoaXMuZGF0YVttXTtcclxuICAgIFx0XHR0aGlzLmRhdGFbbV0gPSBhO1xyXG4gICAgXHR9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBtaW0gZnJvbSBcIm1pbWJsXCJcclxuaW1wb3J0IHtSb3csIElNYWluQ29udGFpbmVyfSBmcm9tIFwiLi9Sb3dcIlxyXG5pbXBvcnQge1N0b3JlfSBmcm9tIFwiLi9TdG9yZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgVEJvZHkgZXh0ZW5kcyBtaW0uQ29tcG9uZW50XHJcbntcclxuICAgIG1haW46IElNYWluQ29udGFpbmVyO1xyXG4gICAgc3RvcmU6IFN0b3JlO1xyXG5cdHJvd3M6IFJvd1tdO1xyXG4gICAgc2VsZWN0ZWRSb3c6IFJvdztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggbWFpbilcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm1haW4gPSBtYWluO1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBtYWluLnN0b3JlO1xyXG4gICAgICAgIHRoaXMucm93cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLnN0b3JlLnJ1bigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLnJvd3MgPSB0aGlzLnN0b3JlLmRhdGEubWFwKCBpdGVtID0+IG5ldyBSb3coIHRoaXMubWFpbiwgaXRlbS5pZCwgaXRlbS5sYWJlbCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUuYWRkKCkuZm9yRWFjaCggaXRlbSA9PiB0aGlzLnJvd3MucHVzaCggbmV3IFJvdyggdGhpcy5tYWluLCBpdGVtLmlkLCBpdGVtLmxhYmVsKSkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kYXRhLmZvckVhY2goIChpdGVtLCBpKSA9PiB0aGlzLnJvd3NbaV0uc2V0SXRlbSggaXRlbS5sYWJlbCwgdGhpcy5zdG9yZS5zZWxlY3RlZCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBydW5Mb3RzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUucnVuTG90cygpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLnJvd3MgPSB0aGlzLnN0b3JlLmRhdGEubWFwKCBpdGVtID0+IG5ldyBSb3coIHRoaXMubWFpbiwgaXRlbS5pZCwgaXRlbS5sYWJlbCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN3YXBSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMucm93cy5sZW5ndGggPiA5OTgpXHJcblx0XHR7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuc3dhcFJvd3MoIDEsIDk5OCk7XHJcblx0XHRcdGxldCB0ZW1wUm93ID0gdGhpcy5yb3dzWzFdO1xyXG5cdFx0XHR0aGlzLnJvd3NbMV0gPSB0aGlzLnJvd3NbOTk4XTtcclxuXHRcdFx0dGhpcy5yb3dzWzk5OF0gPSB0ZW1wUm93O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1lKCk7XHJcblx0XHR9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uU2VsZWN0Um93Q2xpY2tlZCggcm93OiBSb3cpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5zZWxlY3QoIHJvdy5pZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRSb3cgJiYgdGhpcy5zZWxlY3RlZFJvdyAhPT0gcm93KVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93LnNlbGVjdCggZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkUm93ID0gcm93O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkRlbGV0ZVJvd0NsaWNrZWQocm93OiBSb3cpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kZWxldGUoIHJvdy5pZCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5yb3dzLmluZGV4T2YoIHJvdyk7XHJcbiAgICAgICAgdGhpcy5yb3dzLnNwbGljZSggaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJvdyA9PT0gcm93KVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU1lKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIDx0Ym9keT5cclxuICAgICAgICAgICAge3RoaXMucm93c31cclxuICAgICAgICA8L3Rib2R5PjtcclxuICAgIH1cclxufVxyXG5cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX21pbWJsX187Il0sInNvdXJjZVJvb3QiOiIifQ==