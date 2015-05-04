'use strict';


/** @constructor */
widgets.PieChart = function() {};
widgets.PieChart.prototype = new Widget();


widgets.PieChart.prototype.process = function(model) {
  console.log('process ' + model.type);

  var view = {};

  view.name = model.name;
  return view;
};
