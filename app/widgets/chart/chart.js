'use strict';



/** @constructor */
widgets.Chart = function() {};
widgets.Chart.prototype = new Widget();


widgets.Chart.prototype.addEvents = function() {
  var self = this;
  $(window).on('resize.' + this.id, function() {
    self.update(self.model);
  });
};


widgets.Chart.prototype.removeEvents = function() {
  $(window).off('resize.' + this.id);
};


widgets.Chart.prototype.process = function(model) {
  console.log('process ' + model.type);

  var view = {};

  this.geom = {'width': model._width, 'height': 150};
  this.margin = {'top': 5, 'right': 50, 'bottom': 20, 'left': 50};

  this.chart_height = this.geom.height - this.margin.bottom - this.margin.top;
  this.chart_width = this.geom.width - this.margin.left - this.margin.right;

  view.name = model.name;
  view.viewBox = [0, 0, this.geom.width, this.geom.height].join(' ');
  view.axes = this._axes(model);

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


widgets.Chart.prototype._axes = function(model) {
  var axes = {};
  for (var type in model.axes) {
    if (type in model.data) {
      this._updateMinMax(model.data[type], model.axes[type]);
    }
    var method = '_axis' + type.charAt(0).toUpperCase() + type.slice(1);
    axes[type] = this[method](model.axes[type]);
  }
  return axes;
};


widgets.Chart.prototype._axisVertical = function(_axis, axis) {
  axis.min = _axis.min;
  axis.max = _axis.max;

  var max = Math.max(_axis.max, _axis._max),
      min = Math.min(_axis.min, _axis._min);

  axis.scale = (max - min) / this.chart_height;

  axis.ticks = [];
  var step = _axis.tick;
  for (var v = min; v <= max; v += step) {
    axis.ticks.push({
      'xy': [0, Math.round((max - v) / axis.scale)].join(','),
      'str': $.humanize(v)
    });
  }
};


widgets.Chart.prototype._axisLeft = function(_axis) {
  var axis = {
    'type': 'left',
    'translate': [this.margin.left, this.margin.top].join(','),
    'line': {'x2': 0, 'y2': this.chart_height},
    'tick_line': {'x2': this.chart_width, 'y2': 0},
    'tick_dx': '-.7em',
    'tick_dy': '.3em',
  };
  this._axisVertical(_axis, axis);
  return axis;
};


widgets.Chart.prototype._axisRight = function(_axis) {
  var axis = {
    'type': 'right',
    'translate': [
      this.margin.left + this.chart_width, this.margin.top].join(','),
    'line': {'x2': 0, 'y2': this.chart_height},
    'tick_line': {'x2': 5, 'y2': 0},
    'tick_dx': '.7em',
    'tick_dy': '.3em',
  };
  this._axisVertical(_axis, axis);
  return axis;
};


widgets.Chart.prototype._axisBottomCommon = function(_axis) {
  var axis = {'type': 'bottom'};
  axis.translate = [
    this.margin.left, this.geom.height - this.margin.bottom].join(',');
  axis.line = {'x2': this.chart_width, 'y2': 0};
  axis.tick_line = {'x2': 0, 'y2': -this.chart_height};
  axis.tick_dx = '0';
  axis.tick_dy = '1.4em';
  axis.ticks = [];
  return axis;
};


widgets.Chart.prototype._updateMinMax = function(data, axis) {
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
