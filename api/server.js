var express = require('express'),
  app = express();

// Simulate slow network with a delay
var DELAY = process.env.DELAY || 0;

// One second delay
DELAY = 1000;

app.get('/', function(req, res) {
  res.send('welcome to fake api provider');
});

app.get('/videos', function(req, res) {
  setTimeout((function() {
    res.send(
      [
        {
          title: 'Introduction to JavaScript',
          description: 'Basics of the awesome JavaScript programming language',
          thumbnail: 'http://placehold.it/320x180',
          url: 'http://'
        },
        {
          title: 'Egghead.io - Bower - Intro to Bower',
          description: 'More great videos at http://egghead.io',
          thumbnail: 'http://i1.ytimg.com/vi/vO_Ie3kMXbY/mqdefault.jpg',
          url: 'http://www.youtube.com/watch?v=vO_Ie3kMXbY'
        }
      ]
    );
  }), DELAY);
});

app.listen(9090);

console.log('Listening on port 9090');
