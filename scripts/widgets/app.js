'use strict';


var widgets = {};



/** @constructor */
widgets.Column = function() {};
widgets.Column.prototype = new Widget();


widgets.Column.prototype.process = function() {
  this.width = this.width * this.data.width / 24;
};



/** @constructor */
widgets.ChartLinear = function() {};
widgets.ChartLinear.prototype = new Widget();


widgets.ChartLinear.prototype.process = function() {
  console.log('process Linear Chart');
};
