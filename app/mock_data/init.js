'use strict';

function mock_linear_chart_data() {
  return {
    'type': 'ChartLinear',
    'name': 'Average CPU Load',
    'axes': {
      'bottom': {
        'start': 1429658166000, 'step': 60000, 'length': 50},
      'left': {'min': 0, 'max': 100, 'tick': 28}
    },
    'data': {
      'left': [
        [
          66, 67, 12, 33, 11, 22, 45, 33, 2, 30, 52, 46, 39, 17,
          21, 79, 95, 38, 17, 59, 79, 79, 21, 77, 47, 88, 12, 58,
          54, 9, 92, 67, 12, 52, 20, 38, 86, 99, 45, 42, 91, 64,
          31, 73, 80, 86, 90, 47, 84, 77, 80
        ],
        [
          20, 14, 53, 98, 15, 23, 36, 85, 14, 3, 79, 74, 36, 30,
          54, 28, 31, 16, 43, 94, 1, 57, 73, 32, 51, 21, 24, 94,
          59, 19, 41, 49, 95, 100, 92, 66, 26, 30, 27, 81, 10,
          90, 3, 11, 63, 11, 10, 51, 49, 68, 79
        ]
      ]
    }
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
                mock_linear_chart_data()
              ]
            },

            {
              'type': 'Column',
              'cols': 12,
              'nodes': [
                mock_linear_chart_data()
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
                mock_linear_chart_data()
              ]
            },

            {
              'type': 'Column',
              'cols': 12,
              'nodes': [
                mock_linear_chart_data()
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

  var app = new Widget().init('App', data, width);
  $('body').html(app._html);

  /*
  setTimeout(function() {
    update.nodes[1].name = 'PPP3';
    update.nodes[2].items = [
      {'name': 'NewLink1', 'link': '/aaaaa1'},
      {'name': 'NewLink2', 'link': '/bbbbb2'},
      {'name': 'NewLink3', 'link': '/ccccc3'}
    ];

    console.log('----- update');
    app.update(update, width);
  }, 2000);
  */

});

console.log('Ok');
