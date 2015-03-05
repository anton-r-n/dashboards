'use strict';



/** @constructor */
function Widget() {};


/**
 * Set initial state
 */
Widget.prototype.init = function(id) {
  this.id = id;
  return this;
};


/**
 * Update
 */
Widget.prototype.update = function(data, width) {
  return '';
};


/**
 * Destroy
 */
Widget.prototype.destroy = function() {};


Widget.prototype._findRootNode = function() {
  var self = this;
  setTimeout(function() {self._root = $('[data-obj="' + self.id +'"]')}, 0);
};


Widget.prototype._init = function(id, data, width) {
  this.id = id;
  this.data = data;
  this.children = this._initChildren(data.children || []);

  this.context = this.context || {};
  this.context.id = id;
  this.context.content = this._collectContent(this.children);

  this._findRootNode();
  this._html = $.tpl(this.tpl, this.context);
};


Widget.prototype._initChildren = function(children) {
  var self = this;
  return children.map(function(item, idx) {
    var wid = self.id + '.' + item.type + idx;
    return new widgets[item.type]().init(wid, item);
  });
};


Widget.prototype._collectContent = function(children) {
  return children.map(function(item) {return item._html}).join('');
};
