'use strict';



/** @constructor */
widgets.Chart = function() {};
widgets.Chart.prototype = new Widget();
widgets.Chart.prototype.constructor = widgets.Chart;


widgets.Chart.prototype.update_on_resize = function() {
  this.update(this.model);
};


widgets.Chart.prototype.process = function(model) {
  // console.log('process ' + model.type);

  var view = {};

  this.geom = {'width': model._width, 'height': 120};
  this.margin = {'top': 5, 'right': 50, 'bottom': 20, 'left': 50};

  this.chart_height = this.geom.height - this.margin.bottom - this.margin.top;
  this.chart_width = this.geom.width - this.margin.left - this.margin.right;

  view.name = model.name;
  view.width = this.geom.width;
  view.height = this.geom.height;
  view.axes = this._axes(model);
  view.data_length = 0;

  view.data = {};
  view.data_translate = [this.margin.left, this.margin.top].join(', ');
  for (var type in view.axes) {
    if (type in model.data) {
      var data = model.data[type];
      view.data_length = Math.max(data[0].length, view.data_length);
      view.data[type] = this._scaleData(
          data, view.axes[type], view.axes['bottom']);
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


widgets.Chart.prototype.addEvents = function() {
  this._root.on('mouseleave', this.mouseleave.bind(this));
  this._root.on('mouseenter', this.mouseenter.bind(this));
};


widgets.Chart.prototype.mouseenter = function(e) {
  this._body = this._root.find('.chart_body').off('mousemove');
  this._body.on('mousemove', this.mousemove.bind(this));
  this._highlight = this._root.find('.highlight');
  this._rect = this._body[0].getBoundingClientRect(),
  this._window_width = window.innerWidth;
};


widgets.Chart.prototype.mouseleave = function(e) {
  this._body.off('mousemove');
  this._highlight.html('');
};


widgets.Chart.prototype.mousemove = function(e) {
  var ex = e.clientX - this._rect.left - this.margin.left,
      ey = e.clientY - this._rect.top - this.margin.top,
      max_idx = this.view.data_length - 1,
      scale = this.view.axes.bottom.scale,
      step = this.view.axes.bottom.step,
      values = {};

  if (ex > 0 && ex < this.chart_width && ey > 0 && ey < this.chart_height) {
    var idx = Math.min(Math.round(ex * scale / step), max_idx);
    for (var axis in this.model.axes) {
      if (axis in this.model.data) {
        values[axis] = this._values(idx, axis);
      }
    }
    this._updateHighlight(ey, ex + this.margin.left, values);
  }
  else {
    this._highlight.html('');
  }
};


widgets.Chart.prototype._values = function(idx, axis) {
  var values = [],
      data = this.model.data[axis],
      cols = this.model.cols[axis],
      ax = this.view.axes[axis];
  for (var i = 0; i < data.length; i++) {
    var current = data[i][idx];
    values.push({
      value: $.humanize(current),
      name: cols[i],
      y: this.chart_height - Math.round((current - ax.min) / ax.scale) - 4
    });
  }
  return values;
};


widgets.Chart.prototype._updateHighlight = function(ey, ex, values) {
  var side = ex > this.geom.width / 2 ? 'right' : 'left';
  side = this._rect.left + ex + 220 > this._window_width ? 'right' : side;
  side = this._rect.left + ex - 220 < 0 ? 'left' : side;

  this._highlight.html($.tpl('chart_highlight', {
    y: ey - 20,
    x: ex,
    side: side,
    top: this.margin.top,
    height: this.chart_height,
    values: values
  }));
};
