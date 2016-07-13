
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
riot.tag2('row', '					<td class="col-md-1">{opts.data.id}</td>\n					<td class="col-md-4">\n						<a onclick="{select}">{opts.data.label}</a>\n					</td>\n					<td class="col-md-1">\n						<a onclick="{remove}"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>\n					</td>\n		 			<td class="col-md-6"></td>\n', '', 'class="{opts.data.id == parent.opts.selected ? class=\'danger\' : \'\'}"', function(opts) {
	'use strict';
	this.select = function(evt) {
		this.parent.opts.select(this.opts.data.id);
	}.bind(this);
	this.remove = function(evt) {
		this.parent.opts.delete(this.opts.data.id);
	}.bind(this);
});
});