'use strict';



/** @constructor */
widgets.App = function() {};
widgets.App.prototype = new Widget();


widgets.App.prototype.process = function() {
  this.width = this._get_width();
  widgets.App._model_width(this.model, this.width);
  return {};
};


widgets.App.prototype._get_width = function() {
  return Math.round(window.innerWidth * 0.96);
};


widgets.App.prototype.addEvents = function() {
  $(window).on('resize.' + this.id, this.updateWidth.bind(this));
};


widgets.App.prototype.removeEvents = function() {
  $(window).off('resize.' + this.id);
};


widgets.App.prototype.updateWidth = function() {
  var width = this._get_width();
  if (this.width !== width) {
    this.width = width;
    widgets.App._model_width(this.model, this._get_width());
    widgets.App._nodes_width(this);
  }
};


/** staticmethod */
widgets.App._model_width = function(model, width) {
  model._width = model.type === 'Column' ?
      Math.round(width * model.cols / 24) - 30 : width;
  if (model.nodes && model.nodes.length) {
    for (var i = 0; i < model.nodes.length; i++) {
      widgets.App._model_width(model.nodes[i], model._width);
    }
  }
};


/** staticmethod */
widgets.App._nodes_width = function(node) {
  if (node.update_on_resize) {
    node.update_on_resize();
  }
  if (node.nodes && node.nodes.length) {
    for (var i = 0; i < node.nodes.length; i++) {
      widgets.App._nodes_width(node.nodes[i]);
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
