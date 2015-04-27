'use strict';



/** @constructor */
widgets.LinearChart = function() {};
widgets.LinearChart.prototype = new widgets.Chart();

widgets.LinearChart.prototype._buildAxisBottom = function(_axis) {
  var axis = {'min': _axis.start, 'type': 'bottom'};
  var margin = this.margin,
      width = this.geom.width - margin.left - margin.right;

  axis.max = _axis.start + _axis.step * _axis.length;
  axis.scale = (axis.max - axis.min) / width;
  axis.translate = [margin.left, this.geom.height - margin.bottom].join(',');
  axis.line = {'x2': width, 'y2': 0};
  axis.tick_line = {'x2': 0, 'y2': -this.chart_height};
  axis.step = _axis.step;

  axis.ticks = [];
  var tick_width = 100;
  var step_width = _axis.step / axis.scale,
      step = Math.round(tick_width / step_width) * step_width;

  for (var i = 0; i <= width; i += step) {
    var current = axis.min + i * axis.scale;
    axis.ticks.push({
      'dx': '0',
      'dy': '1.4em',
      'xy': [Math.round(i), 0].join(','),
      'val': current,
      'str': $.tzformat(current, -8, '%d.%m %H:%M')
    });
  }
  return axis;
};
