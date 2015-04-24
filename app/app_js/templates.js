'use strict';


(function(ns) {
  var cache = {};

  /**
   * Micro template engine adapted from:
   * Simple JavaScript Templating
   * by John Resig - http://ejohn.org/ - MIT Licensed
   * http://ejohn.org/blog/javascript-micro-templating/
   *
   * Use:
   * <% expression %> for expression to interpret;
   * <%= value %> for values to escape;
   * <%: value %> for raw value (no further escaping).
   */
  ns.tpl = function(str, data) {
    var fn = !/\W/.test(str) ?
        cache[str] = cache[str] || ns.tpl(get_tpl(str).innerHTML) :
        new Function('_', compose(str));
    return arguments.length > 1 ? fn(data) : fn;
  };

  /**
   * Raise error if template does not exists
   * @param {String} Selector selector name.
   * @return {Object} DOMNode.
   */
  function get_tpl(selector) {
    return document.querySelector('[data-tpl="' + selector + '"]') ||
        (function() {
          throw new Error('Template for "' + selector + '" does not exist.');
        })();
  }

  function compose(str) {
    var s = ("var p=[];p.push('" + str
        .replace(/>\s*[\r\n\t]+\s*/mg, '>')
        .replace(/\s*[\r\n\t]+\s*</mg, '<')
        .replace(/\s*[\r\n\t]\s*/mg, ' ')
        .replace(/<%/g, '\n')
        .replace(/(.*%>)?(.*'.*)/g, apos)
        .replace(/^:(.+)%>/mg, "',$1,'")
        .replace(/^=(.+)%>/mg, "',$.esc($1),'")
        .replace(/^(.+)%>/mg, "');$1p.push('")
        .replace(/\n/g, '') + "');return p.join('');"
        ).replace(/p.push\(''\);/g, '');
    return s;
  }

  /* Escape backslashes and apostrophes */
  function apos($1, $2, $3) {
    return /%>/.test($3) ?
        $3 : $2 + $3.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  var entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  };

  function replacement(s) {
    return entities[s];
  }

  /* Escape predefined entities */
  ns.esc = function(string) {
    return String(string).replace(/[&<>"']/g, replacement);
  };

  var div = document.createElement('div');

  ns.render = function(html_str) {
    div.insertAdjacentHTML('afterbegin', html_str);
    return div.removeChild(div.firstChild);
  };
})($);
