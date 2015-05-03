'use strict';



/** @constructor */
widgets.BarChart = function() {};
widgets.BarChart.prototype = new widgets.Chart();


widgets.BarChart.prototype.process = function(model) {
  console.log('process BarChart');

  var view = {};

  this.margin = {'top': 5, 'right': 50, 'bottom': 20, 'left': 50};
  this.geom = {'width': this.width, 'height': 150};
  this.chart_height = this.geom.height - this.margin.bottom - this.margin.top;

  view.name = model.name;
  view.viewBox = [0, 0, this.geom.width, this.geom.height].join(' ');
  view.axes = this._buildAxes(model);
  return view;
};


widgets.BarChart.prototype._buildAxisBottom = function(_axis) {
  var axis = {'type': 'bottom'};
  var margin = this.margin,
      axis_width = this.geom.width - margin.left - margin.right;

  axis.translate = [margin.left, this.geom.height - margin.bottom].join(',');
  axis.line = {'x2': axis_width, 'y2': 0};
  axis.tick_line = {'x2': 0, 'y2': -this.chart_height};
  axis.ticks = [];

  var tick_width = axis_width / _axis.cols.length;
  for (var i = 0; i < _axis.cols.length; i++) {
    var col = _axis.cols[i];
    axis.ticks.push({
      'dx': '0',
      'dy': '1.4em',
      'xy': [Math.round((i + .5) * tick_width), 0].join(','),
      'val': col,
      'str': col
    });
  }

  return axis;
};
