'use strict';


var widgets = {};



/** @constructor */
widgets.App = function() {};


widgets.App.prototype = new Widget();


widgets.App.prototype.init = function(id, data, width) {
  this.tpl = 'App';
  this.context = {};
  this.context.menu = data.menu;
  this._init(id, data, width);
  return this;
};


widgets.App.prototype.update = function(data, width) {
  return $.tpl('app', this);
};



/** @constructor */
widgets.Page = function() {};


widgets.Page.prototype = new Widget();


widgets.Page.prototype.init = function(id, data, width) {
  this.tpl = 'Page';
  this.context = {};
  this.context.name = data.name;
  this._init(id, data, width);
  return this;
};



/** @constructor */
widgets.Panel = function() {};


widgets.Panel.prototype = new Widget();


widgets.Panel.prototype.init = function(id, data, width) {
  this.tpl = 'Panel';
  this._init(id, data, width);
  return this;
};
