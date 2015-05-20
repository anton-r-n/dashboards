'use strict';



/** @constructor */
widgets.Chart = function() {};
widgets.Chart.prototype = new Widget();


widgets.Chart.prototype.update_on_resize = function() {
  this.update(this.model);
};


widgets.Chart.prototype.process = function(model) {
  // console.log('process ' + model.type);

  var view = {};

  this.geom = {'width': model._width, 'height': 150};
  this.margin = {'top': 5, 'right': 50, 'bottom': 20, 'left': 50};

  this.chart_height = this.geom.height - this.margin.bottom - this.margin.top;
  this.chart_width = this.geom.width - this.margin.left - this.margin.right;

  view.name = model.name;
  view.width = this.geom.width;
  view.height = this.geom.height;
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
    var shift = this.margin.top + Math.round((max - v) / axis.scale);
    axis.ticks.push({
      'shift': 'top:' + shift + 'px',
      'str': $.humanize(v)
    });
  }
};


widgets.Chart.prototype._axisLeft = function(_axis) {
  var text_pos = this.geom.width - this.margin.left + 5;
  var axis = {
    'type': 'left',
    'text_pos': 'right:' + text_pos + 'px',
    'width': '100%'
  };
  this._axisVertical(_axis, axis);
  return axis;
};


widgets.Chart.prototype._axisRight = function(_axis) {
  var axis = {
    'type': 'right',
    'text_pos': 'left:5px',
    'width': this.margin.right + 'px'
  };
  this._axisVertical(_axis, axis);
  return axis;
};


widgets.Chart.prototype._axisBottomCommon = function(_axis) {
  var axis = {
    'type': 'bottom',
    'width': '100%',
    'text_pos': 'top:5px',
    'ticks': []
  };
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
