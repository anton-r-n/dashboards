'use strict';



/** @constructor */
widgets.PieChart = function() {};
widgets.PieChart.prototype = new Widget();
widgets.PieChart.prototype.constructor = widgets.PieChart;


widgets.PieChart.prototype.process = function(model) {
  // console.log('process ' + model.type);

  var view = {};

  var radius = 74,
      inner_radius = 30,
      outer_radius = radius + 1;

  view.name = model.name;
  view.radius = radius;
  view.size = 2 * outer_radius;
  view.translate = [radius + 1, radius + 1].join(', ');
  view.rotate = -90;

  this.max = this._total(model.data, model.max);

  view.rows = [];
  if (this.max) {
    var step = (radius - inner_radius) / model.data.length;
    for (var i = 0; i < model.data.length; i++) {
      var r1 = Math.round(radius - step * i) - 1;
      var r2 = Math.round(radius - step * (i + 1)) + 1;
      view.rows.push(this._row(model.data[i], r1, r2));
    }
  }

  return view;
};


widgets.PieChart.prototype._total = function(data, max) {
  var max_per_row = data.map(function(row) {
    return row.reduce(function(prev, cur) {return prev + cur}, 0);
  });
  max_per_row.push(max);
  return Math.max.apply(null, max_per_row);
};


widgets.PieChart.prototype._row = function(data_row, r1, r2) {
  var segments = [];
  var scale = this.max / 360;
  var current = 0;
  for (var i = 0; i < data_row.length; i++) {
    var start = current / scale;
    var end = (current + data_row[i]) / scale;
    segments.push(this._segment(start, end, r1, r2));
    current += data_row[i];
  }
  return segments;
};


widgets.PieChart.prototype._segment = function(start, end, r1, r2) {
  var diff = start !== end && (end - start) % 360 === 0 ? .1 : 0;

  end = (end % 360);
  start = (start % 360);
  end -= diff;
  if (start > end) { start -= 360 }

  var rad = Math.PI / 180,
      large = end - start > 180 ? 1 : 0,
      inner_sweep = start > end ? 1 : 0,
      outer_sweep = start > end ? 0 : 1;

  var x1 = (r1 * Math.cos(start * rad)).toFixed(2),
      y1 = (r1 * Math.sin(start * rad)).toFixed(2),
      x2 = (r2 * Math.cos(start * rad)).toFixed(2),
      y2 = (r2 * Math.sin(start * rad)).toFixed(2),
      x3 = (r2 * Math.cos(end * rad)).toFixed(2),
      y3 = (r2 * Math.sin(end * rad)).toFixed(2),
      x4 = (r1 * Math.cos(end * rad)).toFixed(2),
      y4 = (r1 * Math.sin(end * rad)).toFixed(2);

  return [
    'M', x1, y1,
    'L', x2, y2,
    'A', r2, r2, 0, large, outer_sweep, x3, y3,
    'L', x4, y4,
    'A', r1, r1, 0, large, inner_sweep, x1, y1,
    'Z'
  ].join(' ');
};
