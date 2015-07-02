'use strict';


function random(min, max, prev) {
  if (typeof prev === 'undefined') {
    prev = (max - min) * Math.random().toFixed(2);
  }
  var next = prev + (max - min) * .1 * (.5 - Math.random()).toFixed(2);
  return Math.max(min, Math.min(max, next));
}


function random_series(min, max, length) {
  var arr = [];
  for (var i = 0; i <= length; i++) {
    arr[i] = random(min, max, arr[i - 1]);
  }
  return arr;
}

function random_values(min, max, arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i] = random(min, max, arr[i - 1]);
  }
  return arr;
}


function mock_linear_chart(name, len, right_axis) {
  var length = +len ? +len : 100,
      min0 = 0,
      max0 = 100,
      min1 = 0,
      max1 = 150;
  var chart_data = {
    'type': 'LinearChart',
    'name': name ? name : 'Linear Chart',
    'cols': {
      'left': ['Long Filter Name', 'Another Filter Name']
    },
    'axes': {
      'bottom': {'start': 1429658166000, 'step': 60000, 'length': length},
      'left': {'min': min0, 'max': max0, 'tick': 20}
    },
    'data': {
      'left': [
        random_series(min0, max0, length),
        random_series(min0, max0, length)
      ]
    }
  };

  if (right_axis) {
    chart_data.cols.right = ['Country != United States'];
    chart_data.axes.right = {'min': min1, 'max': max1, 'tick': 25};
    chart_data.data.right = [random_series(min1, max1, length)];
  }

  return chart_data;
}


function mock_bar_chart(name) {
  var length = 5,
      min0 = 0,
      max0 = 100;
  return {
    'type': 'BarChart',
    'name': name ? name : 'Bar Chart',
    'cols': {
      'left': ['Long Name', 'Another Name', 'Country != United States'],
      'bottom': ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    'axes': {
      'bottom': {},
      'left': {'min': min0, 'max': max0, 'tick': 20}
    },
    'data': {
      'left': [
        random_values(min0, max0, new Array(length)),
        random_values(min0, max0, new Array(length)),
        random_values(min0, max0, new Array(length))
      ]
    }
  };
}


function mock_geo_chart(name, amount) {
  var length = city_names.length,
      min0 = 0,
      max0 = 1e+5;
  return {
    'type': 'GeoChart',
    'name': name ? name : 'Geo Chart',
    'coords': city_coords,
    'cols': {
      'left': ['Long Name', 'Another Name', 'Country != United States'],
      'bottom': city_names
    },
    'axes': {
      'bottom': {},
      'left': {'min': min0, 'max': max0, 'tick': 20}
    },
    'data': {
      'left': [
        random_values(min0, max0, new Array(length)),
        random_values(min0, max0, new Array(length)),
        random_values(min0, max0, new Array(length))
      ]
    }
  };
}


function mock_pie_chart() {
  return {
    'type': 'PieChart',
    'name': 'Distribution Pie Chart',
    'max': 1e5,
    'cols': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    'data': [
      [10, 25, 12, 33, 11],
      [22, 25, 13, 2, 20],
      [12, 15, 23, 17, 20]
    ]
  };
}

var cities = [
  ['Shanghai', 31.2, 121.5],
  ['Karachi', 24.86, 67.01],
  ['Beijing', 39.92, 116.38],
  ['Istanbul', 41.01, 28.95],
  ['Lagos', 6.45, 3.39],
  ['Tokyo', 35.68, 139.68],
  ['Mumbai', 18.97, 72.82],
  ['Moscow', 55.75, 37.62],
  ['Dhaka', 23.7, 90.37],
  ['Cairo', 30.05, 31.23],
  ['São Paulo', -23.55, -46.63],
  ['Lahore', 31.55, 74.34],
  ['Shenzhen', 22.55, 114.1],
  ['Seoul', 37.57, 126.97],
  ['New York City', 40.71, -74.00],
  ['Bangalore', 12.97, 77.57],
  ['London', 51.51, 0.00],
  ['Saint Petersburg', 59.95, 30.3],
  ['Los Angeles', 34.05, -118.25],
  ['Berlin', 52.52, 13.38],
  ['Madrid', 40.38, -3.72],
  ['Paris', 48.86, 2.35],
  ['Boston', 42.36, -71.06],
  ['San Francisco', 37.78, -122.42],
  ['Denver', 39.76, -104.88],
  ['Miami', 25.77, -80.21],
  ['Seattle', 47.61, -122.33],
  ['Mexico', 19.433, -99.13],
  ['Rome', 41.9, 12.5]
];

var city_names = cities.map(function(row) {return row[0]});
var city_coords = cities.map(function(row) {return [row[1], row[2]]});


var data = {
  'type': 'App',
  'nodes': [
    {
      'type': 'Header',
      'text': 'Header Text'
    },

    {
      'type': 'Page',
      'name': 'PPP1',
      'nodes': [
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'cols': 24,
              'nodes': [
                mock_linear_chart('Average Performance', 200, true)
              ]
            }
          ]
        },
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'cols': 24,
              'nodes': [
                mock_geo_chart('Geo Distribution', 200)
              ]
            }
          ]
        },
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'cols': 12,
              'nodes': [
                mock_linear_chart('Average CPU Load', 100)
              ]
            },

            {
              'type': 'Column',
              'cols': 12,
              'nodes': [
                mock_linear_chart('Average Memory Usage', 100)
              ]
            }
          ]
        },
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_bar_chart('Distribution Bar Chart I')
              ]
            },

            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_bar_chart('Distribution Bar Chart II')
              ]
            },

            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_bar_chart('Distribution Bar Chart III')
              ]
            }
          ]
        },
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_linear_chart('Average Memory I', 100)
              ]
            },

            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_linear_chart('Average Memory II', 100)
              ]
            },

            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_linear_chart('Average Memory III', 100)
              ]
            }
          ]
        },
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_pie_chart()
              ]
            },

            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_pie_chart()
              ]
            },

            {
              'type': 'Column',
              'cols': 8,
              'nodes': [
                mock_pie_chart()
              ]
            }
          ]
        }
      ]
    },

    {
      'type': 'Menu',
      'items': [
        {'name': 'Link1', 'link': '/123'},
        {'name': 'Link2', 'link': '/124'},
        {'name': 'Link3', 'link': '/125'}
      ]
    }
  ]
};


$(function() {
  var update = JSON.parse(JSON.stringify(data));

  console.time('init');
  var app = new widgets.App().init('App', data);
  $('body').html(app._html);
  setTimeout(function() {console.timeEnd('init')}, 0);

  /*
  setTimeout(function() {
    update.nodes[1].name = 'PPP3';
    update.nodes[2].items = [
      {'name': 'NewLink1', 'link': '/aaaaa1'},
      {'name': 'NewLink2', 'link': '/bbbbb2'},
      {'name': 'NewLink3', 'link': '/ccccc3'}
    ];

    console.time('update');
    app.update(update);
    setTimeout(function() {console.timeEnd('update')}, 0);
  }, 2000);
  */

});

console.log('Ok');
