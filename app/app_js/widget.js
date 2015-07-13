'use strict';

var widgets = {};



/** @constructor */
function Widget() {}


Widget.prototype.init = function(id) {
  var self = this;
  setTimeout(function() {
    self._root = $('[data-obj="' + self.id + '"]');
    self.addEvents();
  }, 0);

  this.id = id;
  this.nodes = [];
  return this;
};


Widget.prototype.update = function(model) {
  model = this.model = model ? model : this.model;
  model.nodes = model.nodes || [];
  this.type = model.type;
  var view = this.process();
  var diff = this._diffView(view) || this._diffNodes(this.nodes, model.nodes || []);

  if (diff) {
    this.destroy();
    this.view = view;
    this.propagate(model);
    if (this._root) {
      updateNode(this._root[0], this);
    }
  }
  else {
    this.propagate(model);
  }


  return this;
};


Widget.prototype.process = function() {
  var model = this.model;
  var view = {_id: this.id, _type: model.type};
  for (var prop in model) {
    if (prop !== 'nodes' && prop[0] !== '_' && !(prop in view)) {
      view[prop] = model[prop];
    }
  }
  return view;
}


Widget.prototype.propagate = function() {
  var model = this.model;
  if (model.nodes instanceof Array) {
    for (var i = 0; i < model.nodes.length; i++) {
      if (!this.nodes[i]) {
        var type = model.nodes[i].type;
        var id = this.id + '.' + type + i;
        this.nodes[i] = type in widgets ? new widgets[type] : new Widget;
        this.nodes[i].init(id);
      }
      this.nodes[i].update(model.nodes[i]);
    }
  }
};


Widget.prototype.destroy = function() {
  this.nodes.forEach(function(node) {
    node.removeEvents();
    node.destroy();
  });
  this.nodes = [];
};


Widget.prototype.toString = function() {
  this.view._nodes = this.nodes.join('');
  return $.tpl(this.view._type, this.view);
};


Widget.prototype.addEvents = function() {};


Widget.prototype.removeEvents = function() {};


Widget.prototype._replacer = function(key, value) {
  if (key[0] !== '_') {
    return value;
  }
}


Widget.prototype._diffView = function(view) {
  var view_json = JSON.stringify(view, this._replacer);
  var diff = this.view_json !== view_json;
  this.view_json = view_json;
  return diff;
}


Widget.prototype._diffNodes = function(a, b) {
  if (a === b) return false
  if (a == null || b == null) return true;
  if (a.length !== b.length) return true;
  for (var i = 0; i < a.length; i++) {
    if (a[i].type !== b[i].type) return true;
  }
  return false;
}


function updateNode(node, html) {
  var render = $.render(html);
  node.innerHTML = '';

  var attrs = render.attributes;
  for (var i = 0; i < attrs.length; i++) {
    node.setAttribute(attrs[i].name, attrs[i].value);
  }

  while (render.firstChild) {
    node.appendChild(render.firstChild);
  }
}
