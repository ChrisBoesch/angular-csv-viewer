var express = require('express'),
  app = express(),
  _ = require('lodash');

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

/**
 * Send  50 most file descriptions of the current logged in user, sorted by
 * last modification date.
 *
 * Sends a json object. The `files` attribute should be an array. Each element
 * should have `name`, `lastMofified`, `key` attributes.
 *  
 * should return an empty list and an http error code.
 *
 * Error:
 *   - 401, if the user is not logged in (not implemented in mockup).
 * 
 */
app.get('/file', function(req, res) {
  setTimeout(function() {
    var files = _.values(FILE_DB);
    
    files = _.sortBy(files, function(f) {
      return -f.lastModification;
    });

    if (files.length > 50) {
      files = files.slice(0, 50);
    }

    res.send(files);

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

  FILE_DB[name] = {
    '_path': req.files.newFile.path,
    'name': name,
    'key': name,
    'lastUpdate': new Date().getTime(),
  };
  res.redirect('/#/file/' + encodeURIComponent(name));
});

app.get('/file/:fileName.csv', function(req, res) {
  if (!req.params.fileName) {
    return res.send(404, 'Sorry, we cannot find that!');
  }

  var fileName = decodeURIComponent(req.params.fileName);
  if (!FILE_DB[fileName] || !FILE_DB[fileName]._path) {
    return res.send(404, 'Sorry, we cannot find that!');
  }
  setTimeout(function() {
    res.download(
      FILE_DB[fileName]._path,
      encodeURIComponent(fileName) + '.csv'
    );
  }, DELAY);
});

app.listen(9090);

console.log('Listening on port 9090');
