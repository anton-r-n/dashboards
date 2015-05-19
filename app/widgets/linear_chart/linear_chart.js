'use strict';



/** @constructor */
widgets.LinearChart = function() {};
widgets.LinearChart.prototype = new widgets.Chart();

widgets.LinearChart.prototype._axisBottom = function(_axis) {
  var axis = this._axisBottomCommon(_axis);
  axis.min = _axis.start;
  axis.max = _axis.start + _axis.step * _axis.length;
  axis.scale = (axis.max - axis.min) / this.chart_width;
  axis.step = _axis.step;

  var tick_width = 100;
  var step_width = _axis.step / axis.scale,
      step = Math.round(tick_width / step_width) * step_width;
  var shift_top = 'top:' + (this.margin.top + this.chart_height + 1) + 'px;';

  for (var i = 0; i <= this.chart_width; i += step) {
    var current = axis.min + i * axis.scale;
    var left = Math.round(i) + this.margin.left;
    axis.ticks.push({
      'shift': shift_top + 'left:' + left + 'px',
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


widgets.LinearChart.prototype.addEvents = function() {
  this._root.on('mouseleave', this.mouseleave.bind(this));
  this._root.on('mouseenter', this.mouseenter.bind(this));
};


widgets.LinearChart.prototype.mouseenter = function(e) {
  this._body = this._root.find('.chart_body').off('mousemove');
  this._body.on('mousemove', this.mousemove.bind(this));
  this._highlight = this._root.find('.highlight');
  this._idx = -1;
};


widgets.LinearChart.prototype._getRectangle = function(elt) {
  var rect = this._body[0].getBoundingClientRect();
  return {
    'left': rect.left + this.margin.left,
    'top': rect.top + this.margin.top,
    'right': rect.left + this.margin.left + this.chart_width,
    'bottom': rect.top + this.margin.top + this.chart_height
  };
};


widgets.LinearChart.prototype.mouseleave = function(e) {
  this._body.off('mousemove');
};


widgets.LinearChart.prototype.mousemove = function(e) {
  var rect = this._body[0].getBoundingClientRect(),
      ex = e.clientX - rect.left - this.margin.left,
      ey = e.clientY - rect.top - this.margin.top,
      scale = this.view.axes.bottom.scale,
      step = this.model.axes.bottom.step,
      values = {},
      idx = -1;

  if (ex > 0 && ex < this.chart_width && ey > 0 && ey < this.chart_height) {
    var idx = Math.round(ex * scale / step);
    for (var axis in this.model.axes) {
      if (axis in this.model.data) {
        values[axis] = this._values(idx, axis);
      }
    }
  }

  if (this._idx !== idx) {
    this._idx = idx;
    this._updateHighlight(ey, idx, values);
  }
};


widgets.LinearChart.prototype._values = function(idx, axis) {
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


widgets.LinearChart.prototype._updateHighlight = function(ey, idx, values) {
  if (idx === -1) {
    this._highlight.html('');
    return;
  }

  var scale = this.view.axes.bottom.scale,
      step = this.model.axes.bottom.step,
      x = Math.round(idx * step / scale) + this.margin.left,
      side = x > this.geom.width / 2 ? 'right' : 'left';

  this._highlight.html(
      $.tpl('chart_highlight',
      {
        y: ey - 20,
        x: x,
        side: side,
        top: this.margin.top,
        height: this.chart_height,
        values: values
      }));
};
