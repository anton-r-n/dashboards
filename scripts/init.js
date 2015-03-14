'use strict';

var data = {
  'type': 'App',
  'children': [
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
      'children': [
        {
          'type': 'Panel',
          'children': [
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
          'children': [
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

  update.children[0].items = [
    {'name': 'NewLink1', 'link': '/aaaaa1'},
    {'name': 'NewLink2', 'link': '/bbbbb2'},
    {'name': 'NewLink3', 'link': '/ccccc3'},
  ];

  update.children[1].name = 'PPP2';

  setTimeout(function() {
    app.update(update, 100);
    console.log('update');
  }, 2000);
});

console.log('Ok');
