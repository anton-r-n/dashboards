'use strict';



/** @constructor */
widgets.BarChart = function() {};
widgets.BarChart.prototype = new widgets.Chart();


widgets.BarChart.prototype._axisBottom = function(_axis) {
  var axis = this._axisBottomCommon(_axis),
      cols = this.model.cols.bottom;

  this.step = this.chart_width / cols.length;
  var shift_top = 'top:' + (this.margin.top + this.chart_height + 1) + 'px;';

  for (var i = 0; i < cols.length; i++) {
    var col = cols[i];
    var left = Math.round((i + .5) * this.step) + this.margin.left;
    axis.ticks.push({
      'shift': shift_top + 'left:' + left + 'px',
      'str': col
    });
  }

  return axis;
};


widgets.BarChart.prototype._scaleData = function(data, axis, x_axis) {
  var d = [];
  var space = 6;
  var height = this.chart_height;
  var bar_width = this.step / data.length;

  for (var i = 0; i < data.length; i++) {
    var curve = [], x, x1, y;
    for (var j = 0; j < data[i].length; j++) {
      var current = data[i][j];
      if (typeof current === 'number') {
        x = Math.round(this.step * j + space / 2) + bar_width * i;
        x1 = Math.round(x + bar_width - space / 2);
        y = height - Math.round((current - axis.min) / axis.scale);
        curve.push('M', x, height, x, y, x1, y, x1, height, 'z');
      }
    }
    d.push(curve.join(' '));
  }
  return d;
};
