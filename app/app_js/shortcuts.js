'use strict';


(function() {
  /** Namespace and base function */
  window.$ = function() {
    var arg0 = arguments[0];
    if (typeof arg0 === 'function') {
      loaded ? arg0() : onload.push(arg0);
    }
    else {
      if (typeof(arg0) === 'string') {
        return new Dom(document.querySelectorAll(arg0));
      }
      if (typeof(arg0) === 'object') {
        if (arg0 instanceof String) {
          return new Dom(document.querySelectorAll(arg0));
        }
        if (arg0 === window ||
            arg0 instanceof HTMLDocument ||
            arg0 instanceof HTMLElement) {
          return new Dom([arg0]);
        }
      }
    }
  };


  /** Onload */
  var loaded = false,
      onload = [];

  document.addEventListener('DOMContentLoaded', function load() {
    document.removeEventListener('DOMContentLoaded', load);
    loaded = true;
    for (var i = 0; i < onload.length; i++) {
      onload[i]();
    }
  });

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };

  /** DOM Selectors */
  function Dom(elts) {
    this.length = elts.length;
    for (var i = 0; i < elts.length; i++) {
      this[i] = elts[i];
    }
  }

  Dom.prototype = new Array();

  Dom.prototype.find = function(selector) {
    var elts = [];
    for (var i = 0; i < this.length; i++) {
      var nodes = this[i].querySelectorAll(selector);
      for (var j = 0; j < nodes.length; j++) {
        elts.push(nodes[j]);
      }
    }
    return new Dom(elts);
  };

  Dom.prototype.html = function() {
    if (arguments.length > 0) {
      for (var i = 0; i < this.length; i++) {
        this[i].innerHTML = arguments[0];
      }
      return this;
    }
    else {
      return this.length > 0 ? this[0].innerHTML : '';
    }
  };

  var widow_events = {};
  function get_events_dict(elt) {
    return elt === window ? widow_events : elt._events = elt._events || {};
  }

  Dom.prototype.on = function(evt, handler) {
    for (var i = 0; i < this.length; i++) {
      this[i].addEventListener(evt.split('.', 1), handler);
      var _events = get_events_dict(this[i]);
      _events[evt] = _events[evt] || [];
      _events[evt].push(handler);
    }
    return this;
  };

  Dom.prototype.off = function(evt) {
    for (var i = 0; i < this.length; i++) {
      var _events = get_events_dict(this[i]);
      if (evt in _events) {
        for (var j = 0; j < _events[evt].length; j++) {
          this[i].removeEventListener(evt.split('.', 1), _events[evt][j]);
        }
        delete _events[evt];
      }
    }
    return this;
  };

  Dom.prototype.addClass = function(name) {
    for (var i = 0; i < this.length; i++) {
      this[i].className = $.unify(this[i].className + ' ' + name);
    }
    return this;
  };

  Dom.prototype.removeClass = function(name) {
    var dels = name.split(/\s+/);
    for (var i = 0; i < this.length; i++) {
      this[i].className = this[i].className.split(/\s+/).diff(dels).join(' ');
    }
    return this;
  };
})();
