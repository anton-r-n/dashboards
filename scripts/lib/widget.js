'use strict';



/** @constructor */
function Widget() {};


/**
 * Set initial state
 */
Widget.prototype.init = function(id, data, width) {
  this.id = id
  this._build(data, width);

  var self = this;
  setTimeout(function() {self._root = $('[data-obj="' + self.id +'"]')}, 0);

  return this;
};


/**
 * Update
 */
Widget.prototype.update = function(data, width) {
  this._build(data, width);
  this._root.html(this._html);
};


/**
 * Destroy
 */
Widget.prototype.destroy = function() {};


Widget.prototype._build = function(data, width) {
  this.data = data;
  this.type = data.type;
  this.data.id = this.id;

  if (data.children && data.children.length) {
    this.children = this._initChildren(data.children);
    this.data.content = this._collectContent(this.children);
  }

  this._html = $.tpl(data.type, this.data);
};


Widget.prototype._initChildren = function(children) {
  var self = this;
  return children.map(function(item, idx) {
    var wid = self.id + '.' + item.type + idx;
    var widget = item.type in widgets ? new widgets[item.type] : new Widget;
    return widget.init(wid, item);
  });
};


Widget.prototype._collectContent = function(children) {
  return children.map(function(item) {return item._html}).join('');
};
