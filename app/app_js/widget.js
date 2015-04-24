'use strict';

var widgets = {};



/** @constructor */
function Widget() {}


/**
 * Set initial state
 */
Widget.prototype.init = function(id, model, width) {
  this.id = id;
  this._render(model, width);
  this._findRootNode();
  return this;
};


/**
 * Update
 */
Widget.prototype.update = function(model, width) {
  this._render(model, width);
  this._updateRootNode();
};


/**
 * Destroy
 */
Widget.prototype.destroy = function() {};


Widget.prototype.process = function(model) {
  return {};
};


Widget.prototype._findRootNode = function() {
  var self = this;
  setTimeout(function() {self._root = $('[data-obj="' + self.id + '"]')}, 0);
};


Widget.prototype._updateRootNode = function() {
  var render = $.render(this._html);
  this._root.html('');

  var attrs = render.attributes;
  for (var i = 0; i < attrs.length; i++) {
    this._root[0].setAttribute(attrs[i].name, attrs[i].value);
  }

  while (render.firstChild) {
    this._root[0].appendChild(render.firstChild);
  }
};


Widget.prototype._render = function(model, width) {
  this.width = width;
  this.view = this.process(model);
  this.view.id = this.id;
  this._renderRecursively(model, this.width);
};


Widget.prototype._renderRecursively = function(model, width) {

  console.log('render %s', this.id, 'width', width);

  if (model.nodes && model.nodes.length) {
    this.nodes = this._initNodes(model.nodes, width);
    this.view.content = this._collectContent(this.nodes);
  }
  this._html = $.tpl(model.type, this.view);
};


Widget.prototype._initNodes = function(nodes, width) {
  var self = this;
  return nodes.map(function(item, idx) {
    var wid = self.id + '.' + item.type + idx;
    var widget = item.type in widgets ? new widgets[item.type] : new Widget;
    return widget.init(wid, item, width);
  });
};


Widget.prototype._collectContent = function(nodes) {
  return nodes.map(function(item) {return item._html}).join('');
};
