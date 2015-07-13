'use strict';



/** @constructor */
widgets.GeoChart = function() {};
widgets.GeoChart.prototype = new Widget();
widgets.GeoChart.prototype.constructor.GeoChart;


widgets.GeoChart.prototype.update_on_resize = function() {
  this.update(this.model);
};


widgets.GeoChart.prototype.process = function(model) {
  this.tile_size = 256;
  var model = this.model;
  var view = {_id: this.id, _type: model.type};

  view['name'] = model.name;
  this.height = view['height'] = 350;
  this.width = view['width'] = model._width;
  var zoom = view['zoom'] = this.zoom || model['zoom'] || 3;
  this.zoom = Math.max(2, Math.min(4, zoom));
  this.map_size = Math.pow(2, this.zoom) * this.tile_size;

  this.lon = 'lon' in model ? model['lon'] % 180 : 0;
  this.lat = 'lat' in model ? model['lat'] % 90 : 42;
  view['map'] = this.updateMap(this.lon, this.lat);
  view['map']['data'] = this.updateMapData(this.model, 0);
  view['map']['data']['idx'] = 4;
  return view;
};


widgets.GeoChart.prototype.addEvents = function() {
  var self = this;
  this._root.on('mousedown', function(e) {
    if (e.button !== 0) return;
    switch (e.target.className) {
      case 'icon plus':
        e.preventDefault();
        self.zoomIn();
        break;
      case 'icon minus':
        e.preventDefault();
        self.zoomOut();
        break;
      case 'external_link':
      case 'openstreetmap_copyright':
        break;
      default:
        e.preventDefault();
        self.mousedown(e);
    }
  });
};


widgets.GeoChart.prototype.mousedown = function(e) {
  var self = this;
  var layers = this._root.find('.layers')[0];
  var left = e.screenX - this.view['map']['left'];
  var top = e.screenY - this.view['map']['top'];
  $(document)
      .on('mousemove.map', function(e1) {
        layers['style']['left'] = (e1.screenX - left) + 'px';
        layers['style']['top'] = (e1.screenY - top) + 'px';
      })
      .on('mouseup.map', function(e2) {
        $(document).off('mousemove.map').off('mouseup.map');
        var center = self._projection(self.lon, self.lat),
            x = (center.x - e2.screenX + e.screenX) / self.map_size,
            y = (center.y - e2.screenY + e.screenY) / self.map_size;
        var coord = self._xy2lonlat(
            self._remainder(x, 1),
            self._remainder(y, 1));
        self.model['lon'] = coord.lon;
        self.model['lat'] = coord.lat;
        self.update(self.model);
      });
};


widgets.GeoChart.prototype.zoomIn = function() {
  this.zoom++;
  this.update(this.model);
};


widgets.GeoChart.prototype.zoomOut = function() {
  this.zoom--;
  this.update(this.model);
};


widgets.GeoChart.prototype.updateMapData = function(model, idx) {
  var data = [],
      axis = model.cols.bottom;
  var tile_size = this.tile_size;
  var center = this._projection(this.lon, this.lat);
  var shift = this._shift(center, tile_size);
  var half_width = this.width / 2;
  for (var i = 0; i < axis.length; i++) {
    var point = this._projection(model.coords[i][1], model.coords[i][0]);
    var x0 = point.x - center.x;
    for (var x = x0; x < half_width; x += this.map_size) {
      data.push(label());
    }
    for (var x = x0 - this.map_size; x > -half_width; x -= this.map_size) {
      data.push(label());
    }
  }

  function label() {
    return {
      'name': axis[i],
      'value': $.humanize(model.data.left[idx][i]),
      'left': x + shift.x,
      'top': point.y - center.y + shift.y
    };
  }

  data.sort(this.__compare_by_top);

  return data;
};


widgets.GeoChart.prototype.__compare_by_top = function(a, b) {
  return a['top'] - b['top'];
};


widgets.GeoChart.prototype.updateMap = function(lon, lat) {
  var tile_size = this.tile_size;
  var w = this.width,
      h = this.height,
      zoom = this.zoom;

  var center = this._projection(this.lon, this.lat);
  var shift = this._shift(center, tile_size);
  var tile0 = this._point2tile(center, tile_size);

  var tx = Math.ceil(w / 2 / tile_size),
      ty = Math.ceil(h / 2 / tile_size);

  var map = {
    'tiles': [],
    'left': -shift.x,
    'top': -shift.y
  };

  for (var x = -tx; x <= tx; x++) {
    for (var y = -ty; y <= ty; y++) {
      map['tiles'].push({
        'top': y * tile_size,
        'left': x * tile_size,
        'src': this._src(tile0, x, y, zoom)
      });
    }
  }

  function compare(a, b) {
    var d1 = Math.pow(a.top - center.y, 2) + Math.pow(a.left - center.x, 2),
        d2 = Math.pow(b.top - center.y, 2) + Math.pow(b.left - center.x, 2);
    return d1 - d2;
  }

  map['tiles'].sort(compare);

  return map;
};


widgets.GeoChart.prototype._point2tile = function(point, tile_size) {
  return {
    x: Math.floor(point.x / tile_size),
    y: Math.floor(point.y / tile_size)
  };
};


widgets.GeoChart.prototype._shift = function(point, tile_size) {
  return {
    x: point.x % tile_size,
    y: point.y % tile_size
  };
};


/* Source string template for tiles */
widgets.GeoChart.prototype._src = function(tile0, x, y, zoom) {
  var scale = Math.pow(2, zoom);
  return [
    '..', 'tiles', zoom,
    this._remainder(tile0.x + x, scale),
    this._remainder(tile0.y + y, scale)
  ].join('/') + '.png';
};


/* Positive remainder */
widgets.GeoChart.prototype._remainder = function(a, b) {
  return a < 0 ? a % b + b : a % b;
};


/* Projection of lon, lat to pixels
 * @param {Number} lon longitude in degrees.
 * @param {Number} lat latitude in degrees.
 * @return {Object} {x, y} in pixels.
 */
widgets.GeoChart.prototype._projection = function(lon, lat) {
  var center = this._lonlat2xy(lon, lat);
  return {
    x: Math.round(center.x * this.map_size),
    y: Math.round(center.y * this.map_size)
  };
};


/**
 * Translate longitude, latitude to x, y
 * http://wiki.openstreetmap.org/wiki/Mercator
 * @param {Number} lon longitude in degrees.
 * @param {Number} lat latitude in degrees.
 * @return {Object} {x, y} as fraction of map size.
 */
widgets.GeoChart.prototype._lonlat2xy = function(lon, lat) {
  var pi = Math.PI;
  return {
    x: .5 + lon / 360,
    y: .5 - Math.log(Math.tan(pi / 4 + lat * pi / 180 / 2)) / pi / 2
  };
};


/**
 * Translate x, y to longitude, latitude
 * http://wiki.openstreetmap.org/wiki/Mercator
 * @param {Number} x horizontal fraction of map size.
 * @param {Number} y vertical fraction of map size.
 * @return {Object} {lon, lat} in degrees.
 */
widgets.GeoChart.prototype._xy2lonlat = function(x, y) {
  var pi = Math.PI;
  return {
    lon: x * 360 - 180,
    lat: 360 / pi * (Math.atan(Math.exp((.5 - y) * pi * 2)) - pi / 4)
  };
};
