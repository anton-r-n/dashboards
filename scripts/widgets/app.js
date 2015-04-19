'use strict';


var widgets = {};



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
  this.width = this.width * model.cols / 24;
  return {cols: model.cols};
};



/** @constructor */
widgets.ChartLinear = function() {};
widgets.ChartLinear.prototype = new Widget();


widgets.ChartLinear.prototype.process = function(model) {
  console.log('process Linear Chart');

  var view = {};

  var margin = {'top': 10, 'right': 50, 'bottom': 20, 'left': 50},
      geom = {'width': this.width, 'height': 200, 'margin': margin};

  view.name = model.name;
  view.viewBox = [0, 0, geom.width, geom.height].join(' ');

  return view;
};
