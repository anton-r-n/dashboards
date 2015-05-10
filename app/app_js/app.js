'use strict';



/** @constructor */
widgets.App = function() {};
widgets.App.prototype = new Widget();


widgets.App.prototype.process = function() {
  this.updateWidth();
  return {};
};


widgets.App.prototype.addEvents = function() {
  window.addEventListener('resize', this.updateWidth.bind(this));
};


widgets.App.prototype.updateWidth = function() {
  var width = Math.round(window.innerWidth * 0.96);
  widgets.App.update_width(this.model, width);
};


/** staticmethod */
widgets.App.update_width = function(model, width) {
  model._width = model.type === 'Column' ?
      Math.round(width * model.cols / 24) : width;
  if (model.nodes && model.nodes.length) {
    for (var i = 0; i < model.nodes.length; i++) {
      widgets.App.update_width(model.nodes[i], model._width);
    }
  }
};



/** @constructor */
widgets.Header = function() {};
widgets.Header.prototype = new Widget();


widgets.Header.prototype.process = function(model) {
  return {text: model.text};
};



/** @constructor */
widgets.Page = function() {};
widgets.Page.prototype = new Widget();


widgets.Page.prototype.process = function(model) {
  return {name: model.name};
};



/** @constructor */
widgets.Column = function() {};
widgets.Column.prototype = new Widget();


widgets.Column.prototype.process = function(model) {
  return {cols: model.cols};
};
