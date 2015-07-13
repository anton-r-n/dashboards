'use strict';



/** @constructor */
widgets.App = function() {};
widgets.App.prototype = new Widget();


widgets.App.prototype.process = function() {
  var model = this.model;
  var view = {_id: this.id, _type: model.type};
  this.width = this._get_width();
  widgets.App._model_width(this.model, this.width);
  return view;
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
  var start_ts = new Date();
  var width = this._get_width();
  if (this.width !== width) {
    this.width = width;
    widgets.App._model_width(this.model, width);
    this.update(this.model);
  }
  var build = new Date() - start_ts;
  setTimeout(function() {
    var render = new Date() - start_ts;
    console.log('build', build, 'render', render);
  }, 0);
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
