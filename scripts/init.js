'use strict';

var data = {
  'type': 'App',
  'nodes': [
    {
      'type': 'Menu',
      'items': [
        {'name': 'Link1', 'link': '/123'},
        {'name': 'Link2', 'link': '/124'},
        {'name': 'Link3', 'link': '/125'},
      ]
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
              'width': '12'
            },
            {
              'type': 'Column',
              'width': '12'
            }
          ]
        },
        {
          'type': 'Panel',
          'nodes': [
            {
              'type': 'Column',
              'width': '12'
            },
            {
              'type': 'Column',
              'width': '12'
            }
          ]
        }
      ]
    }
  ]
};

$(function() {
  var update = JSON.parse(JSON.stringify(data));

  var app = new Widget().init('App', data, 100);
  $('body').html(app._html);

  setTimeout(function() {
    update.nodes[1].name = 'PPP2';
    update.nodes[0].items = [
      {'name': 'NewLink1', 'link': '/aaaaa1'},
      {'name': 'NewLink2', 'link': '/bbbbb2'},
      {'name': 'NewLink3', 'link': '/ccccc3'},
    ];

    app.update(update, 100);
    console.log('update');
  }, 2000);
});

console.log('Ok');
