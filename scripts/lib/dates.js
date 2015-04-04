'use strict';


(function(ns) {
  var days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
  var abbrs = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  var months = ('January February March April May June July August September ' +
      'October November December').split(' ');

  /**
   * Format UTC date with time zone offset
   * @param {Object} date Date or timestamp in ms.
   * @param {Number} tzoffset Time zone fixed offset in hours default 0.
   * @param {String} format Date format, default ISO.
   * @return {String} formatted date.
   */
  ns.tzformat = function(date, tzoffset, format) {
    switch (format) {
      case 'ISO': format = '%Y-%m-%dT%H:%M:%S%z'; break;
      case 'US': format = '%m/%d/%Y %H:%M'; break;
      case 'D': format = '%m/%d/%Y'; break;
      case 'X': format = '%h %m %s'; break;
    }

    tzoffset = typeof tzoffset === 'undefined' ? 0 : tzoffset;
    format = typeof format === 'undefined' ? '%Y-%m-%dT%H:%M:%S%z' : format;

    var D = new Date(+date + tzoffset * 3.6e+6);

    return format.replace(/%(\w)/g, function($0, $1) {
      switch ($1) {
        case 'B': return months[D.getUTCMonth()];
        case 'H': return justify(D.getUTCHours());
        case 'M': return justify(D.getUTCMinutes());
        case 'S': return justify(D.getUTCSeconds());
        case 'Y': return D.getUTCFullYear();
        case 'a': return days[D.getUTCDay()];
        case 'b': return abbrs[D.getUTCMonth()];
        case 'd': return justify(D.getUTCDate());
        case 'm': return justify(D.getUTCMonth() + 1);
        case 'y': return String(D.getUTCFullYear()).slice(-2);
        case 'z':
          if (tzoffset === 0) {
            return 'Z';
          } else {
            return (tzoffset > 0 ? '+' : '-') +
                justify(Math.abs(tzoffset)) + ':00';
          }
        default: return '';
      }
    });
  };


  /**
   * Helper function
   * @param {Number} n Input number.
   * @return {String} Two digit string with leading zero.
   */
  function justify(n) {
    return n < 10 ? '0' + n : '' + n;
  };
})($);
