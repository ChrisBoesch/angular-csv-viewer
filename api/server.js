var express = require('express'),
  app = express();

// Simulate slow network with a delay
var DELAY = process.env.DELAY || 0;

// One second delay
DELAY = 1000;

//
var FILE_DB = {};

app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.send('welcome to fake api provider');
});

app.get('/videos', function(req, res) {
  setTimeout(function() {
    //This is where the API will need to be mocked. 
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
  }, DELAY);
});

app.post('/file', function(req, res) {
  var name;

  if (!req.files || !req.files.newFile) {
    // TODO
    return res.redirect('back');
  }

  if (req.files.newFile.type !== "text/csv") {
    // TODO
    return res.redirect('back');
  }

  if (req.body && req.body.fileName) {
    name = req.body.fileName;
  } else {
    name = req.files.newFile.name;
  }

  FILE_DB[name] = req.files.newFile.path;
  res.redirect('/#/file/' + encodeURIComponent(name));
  console.dir(FILE_DB);
});

app.listen(9090);

console.log('Listening on port 9090');
