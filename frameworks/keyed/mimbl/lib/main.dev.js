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
                        mim.jsx("h1", null, "Mimbl (keyed)")),
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
        return mim.jsx("tbody", { updateStrategy: { allowKeyedNodeRecycling: false } }, this.rows);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvTWFpbi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1Jvdy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1N0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9UQm9keS50c3giLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcInJvb3RcIjpcIm1pbWJsXCIsXCJjb21tb25qczJcIjpcIm1pbWJsXCIsXCJjb21tb25qc1wiOlwibWltYmxcIixcImFtZFwiOlwibWltYmxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztB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V0FBVyxLQUFLLEdBQUc7WUFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDM0IsQ0FBQztJQUVELGtCQUFrQixDQUFDLEdBQVE7UUFFdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssR0FBRztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUVqQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU07UUFFRixPQUFPLG1CQUFPLGNBQWMsRUFBRSxFQUFDLHVCQUF1QixFQUFDLEtBQUssRUFBQyxJQUN4RCxJQUFJLENBQUMsSUFBSSxDQUNOLENBQUM7SUFDYixDQUFDO0NBQ0o7QUFwRkQsc0JBb0ZDOzs7Ozs7Ozs7Ozs7QUN4RkQsbUQiLCJmaWxlIjoibWFpbi5kZXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJtaW1ibFwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJtaW1ibFwiXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZmFjdG9yeShyZXF1aXJlKFwibWltYmxcIikpIDogZmFjdG9yeShyb290W1wibWltYmxcIl0pO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9taW1ibF9fKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvTWFpbi50c3hcIik7XG4iLCJpbXBvcnQgKiBhcyBtaW0gZnJvbSBcIm1pbWJsXCJcclxuaW1wb3J0IHtJTWFpbkNvbnRhaW5lcn0gZnJvbSBcIi4vUm93XCJcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSBcIi4vU3RvcmVcIlxyXG5pbXBvcnQge1RCb2R5fSBmcm9tXCIuL1RCb2R5XCJcclxuXHJcblxyXG4vLyB2YXIgc3RhcnRUaW1lO1xyXG4vLyB2YXIgbGFzdE1lYXN1cmU7XHJcbi8vIHZhciBzdGFydE1lYXN1cmUgPSBmdW5jdGlvbihuYW1lKSB7XHJcbi8vICAgICAvL2NvbnNvbGUudGltZVN0YW1wKG5hbWUpO1xyXG4vLyAgICAgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbi8vICAgICBsYXN0TWVhc3VyZSA9IG5hbWU7XHJcbi8vIH1cclxuLy8gdmFyIHN0b3BNZWFzdXJlID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgICB2YXIgbGFzdCA9IGxhc3RNZWFzdXJlO1xyXG4vLyAgICAgaWYgKGxhc3RNZWFzdXJlKSB7XHJcbi8vICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICBsYXN0TWVhc3VyZSA9IG51bGw7XHJcbi8vICAgICAgICAgICAgIHZhciBzdG9wID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbi8vICAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IDA7XHJcbi8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxhc3QrXCIgdG9vayBcIisoc3RvcC1zdGFydFRpbWUpKTtcclxuLy8gICAgICAgICB9LCAwKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuZXhwb3J0IGNsYXNzIE1haW4gZXh0ZW5kcyBtaW0uQ29tcG9uZW50IGltcGxlbWVudHMgSU1haW5Db250YWluZXJcclxue1xyXG4gICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgdGJvZHk6IFRCb2R5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKClcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLnRib2R5ID0gbmV3IFRCb2R5KCB0aGlzKTtcclxuXHJcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLmFwcCA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2NoZWR1bGVQcmludER1cmF0aW9uKCkge1xyXG4gICAgLy8gICAgIHRoaXMuY2FsbE1lKCAoKSA9PiBzdG9wTWVhc3VyZSgpLCBmYWxzZSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcnVuKClcclxuICAgIHtcclxuICAgICAgICAvLyBzdGFydE1lYXN1cmUoXCJydW5cIik7XHJcbiAgICAgICAgdGhpcy50Ym9keS5ydW4oKTtcclxuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlUHJpbnREdXJhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGQoKVxyXG4gICAge1xyXG4gICAgICAgIC8vIHN0YXJ0TWVhc3VyZShcImFkZFwiKTtcclxuICAgICAgICB0aGlzLnRib2R5LmFkZCgpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwZGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwidXBkYXRlXCIpO1xyXG4gICAgICAgIHRoaXMudGJvZHkudXBkYXRlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZVByaW50RHVyYXRpb24oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcnVuTG90cygpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwicnVuTG90c1wiKTtcclxuICAgICAgICB0aGlzLnRib2R5LnJ1bkxvdHMoKTtcclxuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlUHJpbnREdXJhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhcigpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwiY2xlYXJcIik7XHJcbiAgICAgICAgdGhpcy50Ym9keS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMudGJvZHkgPSBuZXcgVEJvZHkoIHRoaXMpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlUHJpbnREdXJhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzd2FwUm93cygpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gc3RhcnRNZWFzdXJlKFwic3dhcFJvd3NcIik7XHJcbiAgICAgICAgdGhpcy50Ym9keS5zd2FwUm93cygpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uU2VsZWN0Um93Q2xpY2tlZCggcm93KVxyXG4gICAge1xyXG4gICAgICAgIC8vIHN0YXJ0TWVhc3VyZShcInNlbGVjdFwiKTtcclxuICAgICAgICB0aGlzLnRib2R5Lm9uU2VsZWN0Um93Q2xpY2tlZChyb3cpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRGVsZXRlUm93Q2xpY2tlZCggcm93KVxyXG4gICAge1xyXG4gICAgICAgIC8vIHN0YXJ0TWVhc3VyZShcImRlbGV0ZVwiKTtcclxuICAgICAgICB0aGlzLnRib2R5Lm9uRGVsZXRlUm93Q2xpY2tlZChyb3cpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVQcmludER1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqdW1ib3Ryb25cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPk1pbWJsIChrZXllZCk8L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgc21hbGxwYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tYmxvY2tcIiBpZD1cInJ1blwiIGNsaWNrPXt0aGlzLnJ1bn0+Q3JlYXRlIDEsMDAwIHJvd3M8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHNtYWxscGFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCIgaWQ9XCJydW5sb3RzXCIgY2xpY2s9e3RoaXMucnVuTG90c30+Q3JlYXRlIDEwLDAwMCByb3dzPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBzbWFsbHBhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiIGlkPVwiYWRkXCIgY2xpY2s9e3RoaXMuYWRkfT5BcHBlbmQgMSwwMDAgcm93czwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgc21hbGxwYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tYmxvY2tcIiBpZD1cInVwZGF0ZVwiIGNsaWNrPXt0aGlzLnVwZGF0ZX0+VXBkYXRlIGV2ZXJ5IDEwdGggcm93PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBzbWFsbHBhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1ibG9ja1wiIGlkPVwiY2xlYXJcIiBjbGljaz17dGhpcy5jbGVhcn0+Q2xlYXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHNtYWxscGFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCIgaWQ9XCJzd2Fwcm93c1wiIGNsaWNrPXt0aGlzLnN3YXBSb3dzfT5Td2FwIFJvd3M8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXIgdGFibGUtc3RyaXBlZCB0ZXN0LWRhdGFcIiB1cGRhdGVTdHJhdGVneT17e2FsbG93S2V5ZWROb2RlUmVjeWNsaW5nOmZhbHNlfX0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy50Ym9keX1cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmVsb2FkaWNvbiBnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5taW0ubW91bnQoIDxNYWluLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpOyIsImltcG9ydCAqIGFzIG1pbSBmcm9tIFwibWltYmxcIlxyXG5cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYWluQ29udGFpbmVyXHJcbntcclxuICAgIG9uU2VsZWN0Um93Q2xpY2tlZCggcm93OiBSb3cpOiB2b2lkO1xyXG4gICAgb25EZWxldGVSb3dDbGlja2VkKCByb3c6IFJvdyk6IHZvaWQ7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJvdyBleHRlbmRzIG1pbS5Db21wb25lbnRcclxue1xyXG5cdG1haW46IElNYWluQ29udGFpbmVyO1xyXG5cclxuXHRpZDogbnVtYmVyO1xyXG5cdEBtaW0udXBkYXRhYmxlIGxhYmVsOiBzdHJpbmc7XHJcblx0QG1pbS51cGRhdGFibGUgc2VsZWN0ZWQ6IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBtYWluOiBJTWFpbkNvbnRhaW5lciwgaWQ6IG51bWJlciwgbGFiZWw6IHN0cmluZylcclxuXHR7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMubWFpbiA9IG1haW47XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmxhYmVsID0gbGFiZWw7XHJcblx0XHR0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRzZXRJdGVtKCBuZXdMYWJlbDogc3RyaW5nLCBuZXdTZWxlY3RlZElEOiBudW1iZXIpXHJcblx0e1xyXG5cdFx0Ly8gbGV0IG5ld1NlbGVjdGVkID0gdGhpcy5pZCA9PT0gbmV3U2VsZWN0ZWRJRDtcclxuXHJcblx0XHQvLyBpZiAobmV3TGFiZWwgIT09IHRoaXMubGFiZWwgfHwgdGhpcy5zZWxlY3RlZCAhPT0gbmV3U2VsZWN0ZWQpXHJcblx0XHQvLyBcdHRoaXMudXBkYXRlTWUoKTtcclxuXHJcblx0XHR0aGlzLmxhYmVsID0gbmV3TGFiZWw7XHJcblx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pZCA9PT0gbmV3U2VsZWN0ZWRJRDtcclxuXHR9XHJcblxyXG5cdHNlbGVjdCggc2VsZWN0ZWQ6IGJvb2xlYW4pXHJcblx0e1xyXG5cdFx0Ly8gaWYgKHRoaXMuc2VsZWN0ZWQgIT09IHNlbGVjdGVkKVxyXG5cdFx0Ly8gXHR0aGlzLnVwZGF0ZU1lKCk7XHJcblxyXG5cdFx0dGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG5cdH1cclxuXHJcblx0b25EZWxldGVDbGlja2VkKClcclxuXHR7XHJcblx0XHR0aGlzLm1haW4ub25EZWxldGVSb3dDbGlja2VkKCB0aGlzKTtcclxuXHR9XHJcblxyXG5cdG9uU2VsZWN0Q2xpY2tlZCgpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuc2VsZWN0ZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMubWFpbi5vblNlbGVjdFJvd0NsaWNrZWQoIHRoaXMpO1xyXG5cdFx0Ly8gdGhpcy51cGRhdGVNZSgpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKClcclxuXHR7XHJcblx0XHRyZXR1cm4gPHRyIGNsYXNzPXt0aGlzLnNlbGVjdGVkID8gXCJkYW5nZXJcIiA6IHVuZGVmaW5lZH0+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNvbC1tZC0xXCI+e3RoaXMuaWR9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY29sLW1kLTRcIj48YSBjbGljaz17dGhpcy5vblNlbGVjdENsaWNrZWR9Pnt0aGlzLmxhYmVsfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjb2wtbWQtMVwiPjxhIGNsaWNrPXt0aGlzLm9uRGVsZXRlQ2xpY2tlZH0+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj48L2E+PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiY29sLW1kLTZcIj48L3RkPlxyXG5cdFx0PC90cj47XHJcblx0fVxyXG59XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBfcmFuZG9tKG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwKSVtYXg7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaWQgPSAxO1xyXG5cdH1cclxuICAgIGJ1aWxkRGF0YShjb3VudCA9IDEwMDApIHtcclxuICAgICAgICB2YXIgYWRqZWN0aXZlcyA9IFtcInByZXR0eVwiLCBcImxhcmdlXCIsIFwiYmlnXCIsIFwic21hbGxcIiwgXCJ0YWxsXCIsIFwic2hvcnRcIiwgXCJsb25nXCIsIFwiaGFuZHNvbWVcIiwgXCJwbGFpblwiLCBcInF1YWludFwiLCBcImNsZWFuXCIsIFwiZWxlZ2FudFwiLCBcImVhc3lcIiwgXCJhbmdyeVwiLCBcImNyYXp5XCIsIFwiaGVscGZ1bFwiLCBcIm11c2h5XCIsIFwib2RkXCIsIFwidW5zaWdodGx5XCIsIFwiYWRvcmFibGVcIiwgXCJpbXBvcnRhbnRcIiwgXCJpbmV4cGVuc2l2ZVwiLCBcImNoZWFwXCIsIFwiZXhwZW5zaXZlXCIsIFwiZmFuY3lcIl07XHJcbiAgICAgICAgdmFyIGNvbG91cnMgPSBbXCJyZWRcIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwiZ3JlZW5cIiwgXCJwaW5rXCIsIFwiYnJvd25cIiwgXCJwdXJwbGVcIiwgXCJicm93blwiLCBcIndoaXRlXCIsIFwiYmxhY2tcIiwgXCJvcmFuZ2VcIl07XHJcbiAgICAgICAgdmFyIG5vdW5zID0gW1widGFibGVcIiwgXCJjaGFpclwiLCBcImhvdXNlXCIsIFwiYmJxXCIsIFwiZGVza1wiLCBcImNhclwiLCBcInBvbnlcIiwgXCJjb29raWVcIiwgXCJzYW5kd2ljaFwiLCBcImJ1cmdlclwiLCBcInBpenphXCIsIFwibW91c2VcIiwgXCJrZXlib2FyZFwiXTtcclxuICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHtpZDogdGhpcy5pZCsrLCBsYWJlbDogYWRqZWN0aXZlc1tfcmFuZG9tKGFkamVjdGl2ZXMubGVuZ3RoKV0gKyBcIiBcIiArIGNvbG91cnNbX3JhbmRvbShjb2xvdXJzLmxlbmd0aCldICsgXCIgXCIgKyBub3Vuc1tfcmFuZG9tKG5vdW5zLmxlbmd0aCldIH0pO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRGF0YShtb2QgPSAxMCkge1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5sZW5ndGg7aSs9bW9kKSB7XHJcbiAgICAgICAgXHR0aGlzLmRhdGFbaV0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGFbaV0sIHtsYWJlbDogdGhpcy5kYXRhW2ldLmxhYmVsICsgJyAhISEnfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKGlkKSB7XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuZGF0YS5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBpZCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkID09PSBpZClcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGRlbGV0ZUJ5SW5kZXgoaW5kZXgpIHtcclxuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBhZGQoKSB7XHJcbiAgICAgICAgdmFyIG5ld0RhdGEgPSB0aGlzLmJ1aWxkRGF0YSgxMDAwKTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmRhdGEuY29uY2F0KG5ld0RhdGEpO1xyXG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlRGF0YSgpO1xyXG4gICAgfVxyXG4gICAgc2VsZWN0KGlkKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgcnVuTG90cygpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgxMDAwMCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzd2FwUm93cyggbiwgbSkge1xyXG4gICAgXHRpZih0aGlzLmRhdGEubGVuZ3RoID4gbiAmJiB0aGlzLmRhdGEubGVuZ3RoID4gbSkge1xyXG4gICAgXHRcdHZhciBhID0gdGhpcy5kYXRhW25dO1xyXG4gICAgXHRcdHRoaXMuZGF0YVtuXSA9IHRoaXMuZGF0YVttXTtcclxuICAgIFx0XHR0aGlzLmRhdGFbbV0gPSBhO1xyXG4gICAgXHR9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBtaW0gZnJvbSBcIm1pbWJsXCJcclxuaW1wb3J0IHtSb3csIElNYWluQ29udGFpbmVyfSBmcm9tIFwiLi9Sb3dcIlxyXG5pbXBvcnQge1N0b3JlfSBmcm9tIFwiLi9TdG9yZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgVEJvZHkgZXh0ZW5kcyBtaW0uQ29tcG9uZW50XHJcbntcclxuICAgIG1haW46IElNYWluQ29udGFpbmVyO1xyXG4gICAgc3RvcmU6IFN0b3JlO1xyXG5cdHJvd3M6IFJvd1tdO1xyXG4gICAgc2VsZWN0ZWRSb3c6IFJvdztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggbWFpbilcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm1haW4gPSBtYWluO1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBtYWluLnN0b3JlO1xyXG4gICAgICAgIHRoaXMucm93cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLnN0b3JlLnJ1bigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLnJvd3MgPSB0aGlzLnN0b3JlLmRhdGEubWFwKCBpdGVtID0+IG5ldyBSb3coIHRoaXMubWFpbiwgaXRlbS5pZCwgaXRlbS5sYWJlbCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYWRkKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUuYWRkKCkuZm9yRWFjaCggaXRlbSA9PiB0aGlzLnJvd3MucHVzaCggbmV3IFJvdyggdGhpcy5tYWluLCBpdGVtLmlkLCBpdGVtLmxhYmVsKSkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kYXRhLmZvckVhY2goIChpdGVtLCBpKSA9PiB0aGlzLnJvd3NbaV0uc2V0SXRlbSggaXRlbS5sYWJlbCwgdGhpcy5zdG9yZS5zZWxlY3RlZCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBydW5Mb3RzKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUucnVuTG90cygpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLnJvd3MgPSB0aGlzLnN0b3JlLmRhdGEubWFwKCBpdGVtID0+IG5ldyBSb3coIHRoaXMubWFpbiwgaXRlbS5pZCwgaXRlbS5sYWJlbCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN3YXBSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMucm93cy5sZW5ndGggPiA5OTgpXHJcblx0XHR7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuc3dhcFJvd3MoIDEsIDk5OCk7XHJcblx0XHRcdGxldCB0ZW1wUm93ID0gdGhpcy5yb3dzWzFdO1xyXG5cdFx0XHR0aGlzLnJvd3NbMV0gPSB0aGlzLnJvd3NbOTk4XTtcclxuXHRcdFx0dGhpcy5yb3dzWzk5OF0gPSB0ZW1wUm93O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1lKCk7XHJcblx0XHR9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uU2VsZWN0Um93Q2xpY2tlZCggcm93OiBSb3cpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5zZWxlY3QoIHJvdy5pZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRSb3cgJiYgdGhpcy5zZWxlY3RlZFJvdyAhPT0gcm93KVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93LnNlbGVjdCggZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkUm93ID0gcm93O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkRlbGV0ZVJvd0NsaWNrZWQocm93OiBSb3cpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kZWxldGUoIHJvdy5pZCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5yb3dzLmluZGV4T2YoIHJvdyk7XHJcbiAgICAgICAgdGhpcy5yb3dzLnNwbGljZSggaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJvdyA9PT0gcm93KVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU1lKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIDx0Ym9keSB1cGRhdGVTdHJhdGVneT17e2FsbG93S2V5ZWROb2RlUmVjeWNsaW5nOmZhbHNlfX0+XHJcbiAgICAgICAgICAgIHt0aGlzLnJvd3N9XHJcbiAgICAgICAgPC90Ym9keT47XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9taW1ibF9fOyJdLCJzb3VyY2VSb290IjoiIn0=