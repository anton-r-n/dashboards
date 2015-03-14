'use strict';


var widgets = {};



/** @constructor
widgets.App = function() {};
widgets.App.prototype = new Widget();


widgets.App.prototype.init = function(id, data, width) {
  this.tpl = 'App';
  this.context = {};
  this.context.menu = data.menu;
  console.trace();
  this._init(id, data, width);
  return this;
};


widgets.App.prototype.update = function(data, width) {
  this.context = {};
  this.context.menu = data.menu;
  this._update(data, width);
};
*/
