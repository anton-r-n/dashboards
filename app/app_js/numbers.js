'use strict';


(function(ns) {
  /**
   * Remove the whitespace from the beginning and end of a string
   * and replace multiple whitespaces with one space.
   * @param {String} str Input string.
   * @return {String} result.
   */
  ns.unify = function(str) {
    return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
  };

  /** Thin space UTF-8 symbol */
  ns.thinsp = String.fromCharCode(8201);

  /**
   * The function returns a String containing the value represented in decimal
   * fixed-point notation with maximum tree digits after the decimal point with
   * optional multiplicative prefix.
   * Example:
   * 1 1
   * 10 10
   * 100 100
   * 1000 1 k
   * 10000 10 k
   * 100000 100 k
   * 1000000 1 M
   * 10000000 10 M
   * 100000000 100 M
   * @param {Number} value Original value.
   * @param {String} units Base units like 'bps'.
   * @return {String} humanized representation.
   */
  ns.humanize = function(value, units) {
    units = units || '';
    if (typeof value !== 'number') return value;
    var num = value.toExponential(2).split('e'),
        mant = Math.round(Number(num[0]) * 100),
        exp = Number(num[1]),
        res = (mant * Math.pow(10, exp % 3)) / 100,
        prefix = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

    if (exp >= -3 && exp < 0) {
      res = Math.round(Number(value) * 1000) / 1000 + '';
    } else if (exp >= 0 && exp < 3) {
      res += '';
    } else if (exp > 0 && exp < 24) {
      res += ns.thinsp + prefix[Math.floor(exp / 3)];
    } else {
      res = Number(value).toExponential(1);
    }

    return res;
  };
})($);
