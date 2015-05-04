'use strict';



/** @constructor */
widgets.BarChart = function() {};
widgets.BarChart.prototype = new widgets.Chart();


widgets.BarChart.prototype._axisBottom = function(_axis) {
  var axis = this._axisBottomCommon(_axis);

  this.step = this.chart_width / _axis.cols.length;

  for (var i = 0; i < _axis.cols.length; i++) {
    var col = _axis.cols[i];
    axis.ticks.push({
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
