'use strict';



/** @constructor */
widgets.Menu = function() {};
widgets.Menu.prototype = new Widget();
widgets.Menu.prototype.constructor = widgets.Menu;


widgets.Menu.prototype.process = function(model) {
  return {items: model.items};
};
