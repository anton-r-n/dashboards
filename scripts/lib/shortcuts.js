'use strict';


(function() {
  /** Namespace and base function */
  window.$ = function() {
    var arg0 = arguments[0];
    if (typeof arg0 === 'function') {
      loaded ? arg0() : onload.push(arg0);
    }
    else {
      return new dom(document.querySelectorAll(arg0));
    }
  }


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
  function dom(elts) {
    this.length = elts.length;
    for (var i = 0; i < elts.length; i++) {
      this[i] = elts[i];
    }
  }

  dom.prototype = [];
})();
