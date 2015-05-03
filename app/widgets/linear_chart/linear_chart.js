'use strict';



/** @constructor */
widgets.LinearChart = function() {};
widgets.LinearChart.prototype = new widgets.Chart();

widgets.LinearChart.prototype._axisBottom = function(_axis) {
  var axis =  this._axisBottomCommon(_axis);
  axis.min = _axis.start;
  axis.max = _axis.start + _axis.step * _axis.length;
  axis.scale = (axis.max - axis.min) / this.chart_width;
  axis.step = _axis.step;

  var tick_width = 100;
  var step_width = _axis.step / axis.scale,
      step = Math.round(tick_width / step_width) * step_width;

  for (var i = 0; i <= this.chart_width; i += step) {
    var current = axis.min + i * axis.scale;
    axis.ticks.push({
      'xy': [Math.round(i), 0].join(','),
      'val': current,
      'str': $.tzformat(current, -8, '%d.%m %H:%M')
    });
  }
  return axis;
};


widgets.LinearChart.prototype._scaleData = function(data, axis, x_axis) {
  var d = [];
  for (var i = 0; i < data.length; i++) {
    var curve = ['M'], x, y;
    for (var j = 0; j < data[i].length; j++) {
      var current = data[i][j];
      if (typeof current === 'number') {
        x = Math.round(x_axis.step * j / x_axis.scale);
        y = this.chart_height - Math.round((current - axis.min) / axis.scale);
        curve.push(x + ',' + y);
      }
    }
    d.push(curve.join(' '));
  }
  return d;
};
