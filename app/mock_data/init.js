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


function mock_linear_chart() {
  var length = 50,
      min0 = 0,
      max0 = 100,
      min1 = 0,
      max1 = 150;
  return {
    'type': 'LinearChart',
    'name': 'Average CPU Load',
    'axes': {
      'bottom': {
        'start': 1429658166000, 'step': 60000, 'length': length},
      'left': {'min': min0, 'max': max0, 'tick': 25},
      'right': {'min': min1, 'max': max1, 'tick': 25}
    },
    'data': {
      'left': [
        random_series(min0, max0, length),
        random_series(min0, max0, length),
      ],
      'right': [
        random_series(min1, max1, length),
      ],
    }
  };
}


function mock_bar_chart() {
  var length = 5,
      min0 = 0,
      max0 = 100;
  return {
    'type': 'BarChart',
    'name': 'Distribution Bar Chart',
    'axes': {
      'bottom': {
        'cols': ['Jan', 'Feb', 'Mar', 'Apr', 'May']
      },
      'left': {'min': min0, 'max': max0, 'tick': 25}
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
    'max': 100,
    'cols': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    'data': [
      [10, 25, 12, 33, 11],
      [22, 25, 13, 2, 20],
      [12, 15, 23, 17, 20],
    ]
  };
}


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
              'cols': 12,
              'nodes': [
                mock_linear_chart()
              ]
            },

            {
              'type': 'Column',
              'cols': 12,
              'nodes': [
                mock_linear_chart()
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
                mock_pie_chart()
              ]
            },

            {
              'type': 'Column',
              'cols': 12,
              'nodes': [
                mock_bar_chart()
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

  var width = Math.round(window.innerWidth * 0.96);

  console.time('init');
  var app = new Widget().init('App', data, width);
  $('body').html(app._html);
  setTimeout(function() {console.timeEnd('init')}, 0);

  setTimeout(function() {
    update.nodes[1].name = 'PPP3';
    update.nodes[2].items = [
      {'name': 'NewLink1', 'link': '/aaaaa1'},
      {'name': 'NewLink2', 'link': '/bbbbb2'},
      {'name': 'NewLink3', 'link': '/ccccc3'}
    ];
    var width = Math.round(window.innerWidth * 0.96);

    console.time('update');
    app.update(update, width);
    setTimeout(function() {console.timeEnd('update')}, 0);
  }, 2000);

});

console.log('Ok');
