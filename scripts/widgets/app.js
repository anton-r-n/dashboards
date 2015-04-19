'use strict';


var widgets = {};



/** @constructor */
widgets.Column = function() {};
widgets.Column.prototype = new Widget();


widgets.Column.prototype.process = function(model) {
  this.width = this.width * model.width / 24;
  return model;
};



/** @constructor */
widgets.ChartLinear = function() {};
widgets.ChartLinear.prototype = new Widget();


widgets.ChartLinear.prototype.process = function(model) {
  console.log('process Linear Chart');

  var margin = {'top': 10, 'right': 50, 'bottom': 20, 'left': 50},
      geom = {'width': this.width, 'height': 200, 'margin': margin};

  this.model.viewBox = [0, 0, geom.width, geom.height].join(' ');

  return model;
};
