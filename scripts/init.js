'use strict';

var data = {
  'type': 'App',
  'menu': [{'name': 'Link1', 'link': '/123'}],
  'children': [
    {
      'type': 'Page',
      'name': 'PPP1',
      'children': [
        {
          'type': 'Panel',
          'children': []
        },
        {
          'type': 'Panel',
          'children': []
        }
      ]
    }
  ]
};

$(function() {
  var app = new widgets.App().init('App', data, 100);
  $('body')[0].innerHTML = app._html;
});

console.log('Ok');
