'use strict';



/** @constructor */
widgets.BarChart = function() {};
widgets.BarChart.prototype = new widgets.Chart();


widgets.BarChart.prototype._buildAxisBottom = function(_axis) {
  var axis = {'type': 'bottom'};
  var margin = this.margin,
      axis_width = this.geom.width - margin.left - margin.right;

  axis.translate = [margin.left, this.geom.height - margin.bottom].join(',');
  axis.line = {'x2': axis_width, 'y2': 0};
  axis.tick_line = {'x2': 0, 'y2': -this.chart_height};
  axis.ticks = [];

  this.step = axis_width / _axis.cols.length;

  for (var i = 0; i < _axis.cols.length; i++) {
    var col = _axis.cols[i];
    axis.ticks.push({
      'dx': '0',
      'dy': '1.4em',
      'xy': [Math.round((i + .5) * this.step), 0].join(','),
      'val': col,
      'str': col
    });
  }

  return axis;
};


widgets.BarChart.prototype._scaleData = function(data, axis, x_axis) {
  var d = [];
  var height = this.chart_height;
  var bar_width = this.step / data.length;

  for (var i = 0; i < data.length; i++) {
    var curve = [], x, x1, y;
    for (var j = 0; j < data[i].length; j++) {
      var current = data[i][j];
      if (typeof current === 'number') {
        x = Math.round(this.step * j) + bar_width * i;
        x1 = x + bar_width;
        y = height - Math.round((current - axis.min) / axis.scale);
        curve.push('M', x, height, x, y, x1, y, x1, height, 'z');
      }
    }
    d.push(curve.join(' '));
  }
  return d;
};
