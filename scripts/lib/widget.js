'use strict';



/** @constructor */
function Widget() {};


/**
 * Set initial state
 */
Widget.prototype.init = function(id, data, width) {
  this.id = id
  this._renderRecursively(data, width);

  var self = this;
  setTimeout(function() {self._root = $('[data-obj="' + self.id +'"]')}, 0);

  return this;
};


/**
 * Update
 */
Widget.prototype.update = function(data, width) {
  this._renderRecursively(data, width);
  this._root.html(this._html);
};


/**
 * Destroy
 */
Widget.prototype.destroy = function() {};


Widget.prototype._renderRecursively = function(data, width) {
  this.data = data;
  this.type = data.type;
  this.data.id = this.id;

  console.log('render %s', this.id);

  if (data.nodes && data.nodes.length) {
    this.nodes = this._initNodes(data.nodes);
    this.data.content = this._collectContent(this.nodes);
  }

  this._html = $.tpl(data.type, this.data);
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
