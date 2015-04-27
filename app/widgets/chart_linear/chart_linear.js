'use strict';



/** @constructor */
widgets.ChartLinear = function() {};
widgets.ChartLinear.prototype = new Widget();


widgets.ChartLinear.prototype.process = function(model) {
  console.log('process Linear Chart');

  var view = {};

  this.margin = {'top': 5, 'right': 50, 'bottom': 20, 'left': 50};
  this.geom = {'width': this.width, 'height': 150};
  this.chart_height = this.geom.height - this.margin.bottom - this.margin.top;

  view.name = model.name;
  view.viewBox = [0, 0, this.geom.width, this.geom.height].join(' ');
  view.axes = this._buildAxes(model);

  view.data = {};
  view.data_translate = [this.margin.left, this.margin.top].join(', ');
  for (var type in view.axes) {
    if (type in model.data) {
      view.data[type] = this._scaleData(
          model.data[type], view.axes[type], view.axes['bottom']);
    }
  }
  return view;
};


widgets.ChartLinear.prototype._buildAxes = function(model) {
  var axes = {};
  for (var type in model.axes) {
    if (type in model.data) {
      this._updateMinMax(model.data[type], model.axes[type]);
    }
    var method = '_buildAxis' + type.charAt(0).toUpperCase() + type.slice(1);
    axes[type] = this[method](model.axes[type]);
  }
  return axes;
};


widgets.ChartLinear.prototype._buildAxisLeft = function(_axis) {
  var axis = {'min': _axis.min, 'max': _axis.max, 'type': 'left'};
  var margin = this.margin,
      width = this.geom.width - margin.left - margin.right;

  var max = Math.max(_axis.max, _axis._max * 1.05),
      min = Math.min(_axis.min, _axis._min * 1.05);

  axis.scale = (max - min) / this.chart_height;
  axis.translate = [margin.left, margin.top].join(',');
  axis.line = {'x2': 0, 'y2': this.chart_height};
  axis.tick_line = {'x2': width, 'y2': 0};

  axis.ticks = [];
  var step = _axis.tick;
  for (var v = min; v <= max; v += step) {
    axis.ticks.push({
      'dx': '-.7em',
      'dy': '.3em',
      'xy': [0, Math.round((max - v) / axis.scale)].join(','),
      'str': $.humanize(v)
    });
  }
  return axis;
};


widgets.ChartLinear.prototype._buildAxisBottom = function(_axis) {
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


widgets.ChartLinear.prototype._scaleData = function(data, axis, x_axis) {
  var d = [], current;
  for (var i = 0; i < data.length; i++) {
    var curve = ['M'], x, y;
    for (var j = 0; j < data[i].length; j++) {
      current = data[i][j];
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


widgets.ChartLinear.prototype._updateMinMax = function(data, axis) {
  var current,
      max = Number.NEGATIVE_INFINITY,
      min = Number.POSITIVE_INFINITY;

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      current = data[i][j];
      if (typeof current === 'number') {
        if (max < current) { max = current; }
        if (min > current) { min = current; }
      }
    }
  }

  axis._min = min;
  axis._max = max;
};
