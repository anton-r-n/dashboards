'use strict';



/** @constructor */
widgets.BarChart = function() {};
widgets.BarChart.prototype = new Widget();


widgets.BarChart.prototype.process = function(model) {
  console.log('process BarChart');

  var view = {};

  this.margin = {'top': 5, 'right': 50, 'bottom': 20, 'left': 50};
  this.geom = {'width': this.width, 'height': 150};
  this.chart_height = this.geom.height - this.margin.bottom - this.margin.top;

  view.name = model.name;
  view.viewBox = [0, 0, this.geom.width, this.geom.height].join(' ');
  return view;
};
