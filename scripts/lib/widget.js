'use strict';



/** @constructor */
function Widget() {}


/**
 * Set initial state
 */
Widget.prototype.init = function(id, model, width) {
  this.id = id;
  this.model = model;
  this.type = model.type;
  this.model.id = this.id;
  this.width = width;

  this.view = this.process(model);
  this._renderRecursively(this.view, this.width);

  var self = this;
  setTimeout(function() {self._root = $('[data-obj="' + self.id + '"]')}, 0);

  return this;
};


Widget.prototype.process = function(model) {
  return model;
};


/**
 * Update
 */
Widget.prototype.update = function(model, width) {
  this.model = model;
  this.type = model.type;
  this.model.id = this.id;
  this.width = width;

  this.view = this.process(model);
  this._renderRecursively(model, this.width);
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


/**
 * Destroy
 */
Widget.prototype.destroy = function() {};


Widget.prototype._renderRecursively = function(data, width) {

  console.log('render %s', this.id, 'width', width);

  if (data.nodes && data.nodes.length) {
    this.nodes = this._initNodes(data.nodes, width);
    this.view.content = this._collectContent(this.nodes);
  }

  this._html = $.tpl(data.type, this.view);
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
