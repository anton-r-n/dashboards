'use strict';


var widgets = {};



/** @constructor */
widgets.Header = function() {};
widgets.Header.prototype = new Widget();


widgets.Header.prototype.process = function(model) {
  return {text: model.text};
};



/** @constructor */
widgets.Page = function() {};
widgets.Page.prototype = new Widget();


widgets.Page.prototype.process = function(model) {
  return {name: model.name};
};



/** @constructor */
widgets.Menu = function() {};
widgets.Menu.prototype = new Widget();


widgets.Menu.prototype.process = function(model) {
  return {items: model.items};
};



/** @constructor */
widgets.Column = function() {};
widgets.Column.prototype = new Widget();


widgets.Column.prototype.process = function(model) {
  this.width = Math.round(this.width * model.cols / 24);
  return {cols: model.cols};
};
