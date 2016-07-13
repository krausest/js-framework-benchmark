
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
/*global riot */
riot.tag2('app', '	<div class="container">\n		<div class="jumbotron">\n			<div class="row">\n				<div class="col-md-6">\n					<h1>riot v2.5.0</h1>\n				</div>\n				<div class="col-md-6">\n					<div class="row">\n						<div class="col-sm-6 smallpad">\n							<button type="button" class="btn btn-primary btn-block" id="run" onclick="{run}">Create 1,000 rows</button>\n						</div>\n						<div class="col-sm-6 smallpad">\n							<button type="button" class="btn btn-primary btn-block" id="runlots" onclick="{runLots}">Create 10,000 rows</button>\n						</div>\n						<div class="col-sm-6 smallpad">\n							<button type="button" class="btn btn-primary btn-block" id="add" onclick="{add}">Append 1,000 rows</button>\n						</div>\n						<div class="col-sm-6 smallpad" id="addUpdateHere">\n\n						</div>\n						<div class="col-sm-6 smallpad">\n							<button type="button" class="btn btn-primary btn-block" id="clear" onclick="{clear}">Clear</button>\n						</div>\n						<div class="col-sm-6 smallpad">\n							<button type="button" class="btn btn-primary btn-block" id="swaprows" onclick="{swapRows}">Swap Rows</button>\n						</div>\n					</div>\n				</div>\n			</div>\n		</div>\n		<table class="table table-hover table-striped test-data">\n			<tbody>\n					<tr riot-tag="row" each="{this.opts.data}" data="{this}" no-reorder></tr>\n			</tbody>\n		</table>\n		<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>\n	</div>\n', '', '', function(opts) {
	'use strict';
	this.on('mount', function(){
		let elem = document.getElementById("addUpdateHere");
		let button = document.createElement("button");
		button.setAttribute("id","update");
		button.setAttribute("class", "btn btn-primary btn-block");
		button.innerText = "Update every 10th row";
		let that = this;
		button.addEventListener("click", function() {
			that._update();
		});
		elem.appendChild(button);
	})
	this.run = function() {
		this.opts.run();
	}.bind(this);
	this.runLots = function() {
		this.opts.runLots();
	}.bind(this);
	this.add = function() {
		this.opts.add();
	}.bind(this);
	this._update = function() {
		this.opts.update();
		this.update();
	}.bind(this);
	this.clear = function() {
		this.opts.clear();
	}.bind(this);
	this.swapRows = function() {
		this.opts.swapRows();
	}.bind(this);
	this.select = function(evt) {
		this.opts.select(evt.item.item.id);
	}.bind(this);
	this.remove = function(evt) {
		this.opts.delete(evt.item.item.id);
	}.bind(this);
});});