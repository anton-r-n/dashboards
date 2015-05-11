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


  /** DOM Selectors */
  function Dom(elts) {
    this.length = elts.length;
    for (var i = 0; i < elts.length; i++) {
      this[i] = elts[i];
    }
  }

  Dom.prototype = new Array();

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
      this[i].addEventListener(evt.split('.', 1), handler, false);
      var _events = get_events_dict(this[i]);
      _events[evt] = _events[evt] || [];
      _events[evt].push(handler);
    }
  };

  Dom.prototype.off = function(evt) {
    for (var i = 0; i < this.length; i++) {
      var _events = get_events_dict(this[i]);
      if (evt in _events) {
        for (var i = 0; i <  _events[evt].length; i++) {
          this[i].removeEventListener(evt.split('.', 1), _events[evt][i], false);
        }
        delete _events[evt];
      }
    }
  };
})();
