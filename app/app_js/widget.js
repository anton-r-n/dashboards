'use strict';

var widgets = {};



/** @constructor */
function Widget() {}


/**
 * Set initial state
 */
Widget.prototype.init = function(id, model) {
  this.id = id;
  this.nodes = [];
  this.model = model;
  this._render(model);
  setTimeout((function() {
    this._findRootNode();
    this.addEvents();
  }).bind(this), 0);
  return this;
};


/**
 * Update
 */
Widget.prototype.update = function(model) {
  this.model = model;
  this._destroyChildNodes();
  this._render(model);
  this._updateRootNode();
};


/**
 * Destroy
 */
Widget.prototype.destroy = function() {
  console.log('-- destroy %s', this.id);
  this._destroyChildNodes();
  this.removeEvents();
};


Widget.prototype.process = function(model) {
  return {};
};


Widget.prototype.addEvents = function() {};


Widget.prototype.removeEvents = function() {};


Widget.prototype._findRootNode = function() {
  this._root = $('[data-obj="' + this.id + '"]');
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


Widget.prototype._render = function(model) {
  this.view = this.process(model);
  this.view.id = this.id;
  this._renderRecursively(model);
};


Widget.prototype._renderRecursively = function(model) {

  console.log('render %s', this.id, 'width', model._width);

  if (model.nodes && model.nodes.length) {
    this.nodes = this._initNodes(model.nodes);
    this.view.content = this._collectContent(this.nodes);
  }
  this._html = $.tpl(model.type, this.view);
};


Widget.prototype._initNodes = function(nodes) {
  var self = this;
  return nodes.map(function(item, idx) {
    var wid = self.id + '.' + item.type + idx;
    var widget = item.type in widgets ? new widgets[item.type] : new Widget;
    return widget.init(wid, item);
  });
};


Widget.prototype._collectContent = function(nodes) {
  return nodes.map(function(item) {return item._html}).join('');
};

Widget.prototype._destroyChildNodes = function() {
  for (var i = 0; i < this.nodes.length; i++) {
    this.nodes[i].destroy();
  }
};
