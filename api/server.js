var express = require('express'),
  app = express(),
  _ = require('lodash'),
  csv = require('csv'),
  temp = require('temp');


// Simulate slow network with a delay
var DELAY = process.env.DELAY || 0;

// One second delay
DELAY = 1000;


//
var FILE_DB = [],
  encrypt,
  randomEncryptedData = [
    'A5IwaerPVzcIWOtCt3VBlkdIquXO8tnPuX1XtwuHGXyuAvA60K7VGgcvjunq2CbOz7bA78SDXokl\nYhLHWhCzua0aTWNCGGcmji6JRwTxbJVNtcDTqTv5C9iG2k7dkR0aa44URqZlYK/top/tHFvxI3on\nvCSin6hj8kAASfmgNyQ=\n',
    'Svkm2UYbYgHJbXgcU+HH90/zspliLtvZ8d5Zc+k0rg8nL4nUanMME13qGx504WAPu5R2vFfuQf6t\nyesGeNfdLGziGg5vd+spwqi2qAS4cTTzqo6MBWKRh7h9qFEIKgbh+mJXLhntIyZqCLAcyrw3FN8U\nKJ4Ka635tvf0kDmCeWI=\n',
    'uvdOxTJZNexaOcrOqQC/MZ15pAWA91HSrT5HIOcHiwENGM+6h1ZwtN8pNe6Xgrx4ILi8/c6Cb5fx\n1TJfNk5534VEl4e0Njv4HS+DhmFzJGxe/mlX//HxMDDVqlMJlXZpDUCWa1aTqfVyCywBhVVmWEDA\nicPs8X8w79cGorbvTgw=\n'
  ];

encrypt = function(path, indexes, includesHeaders) {
  var out = temp.path({suffix: '.csv'});

  csv().
    from.path(path).
    to.path(out).
    transform(function(row, index){
      if (includesHeaders && index === 0) {
        return row;
      }

      for (var i = 0; i < row.length; i++) {
        if (indexes.indexOf(i) !== -1) {
          row[i] = _.sample(randomEncryptedData);
        }
      }
      return row;
    });

  return out;
};

app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.send('welcome to fake api provider');
});

/**
 * Send  50 most file descriptions of the current logged in user, sorted by
 * last modification date.
 *
 * Sends a json array of file metadata (see /file POST for 
 * the description of the metadata)
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

/**
 * Expect a multipart/form-data body with `newFile` containing
 * the new csv file, and form holding the optional 
 * `name`, `delimiter` and `hasHeaderRow` attributes.
 *
 * The file name will default to the newFile `filename` attribute if 
 * `name` is missing.
 *
 * `hasHeaderRow` will default to true.
 *
 * `delimiter` will default to ','.
 *
 * The server should save the file content and metada:
 *  - `name` (string).
 *  - `key` (string).
 *  - `lastMofified` (int). Time stamps recording the time of the last 
 *    modification (creating, edit? or encryption of a column).
 *  - `hasHeaderRow` (bool).
 *  - `delimiter` (string).
 *  - `columns` (array). Each element must have an `encrypt` attribute
 *    and may have a name attribute.
 *
 * The server should check every row to count the number of columns, not just
 * the first one.
 * 
 * Send a json response with a `name`, a `key` and a `lastUpdate` update
 * attribute.
 *
 * Errors:
 *   - 401, if the user is not logged in.
 *   - 400, if the `newFile` is missing.
 *   
 */
app.post('/file', function(req, res) {
  var max = 0,
    headers = [],
    parser,
    metadata;

  if (!req.files || !req.files.newFile) {
    // TODO
    return res.redirect('back');
  }

  if (req.files.newFile.type !== "text/csv") {
    // TODO
    return res.redirect('back');
  }

  metadata = req.body ? req.body : {};
  _.defaults(metadata, {
    'name': req.files.newFile.name,
    'delimiter': ',',
    'columns': [],
    'hasHeaderRow': true
  });

  parser = csv().from(req.files.newFile.path, {'delimiter': metadata.delimiter});
  parser.on('record', function(row) {
    if (row.length > max) {
      max = row.length;
    }
  });

  if (metadata.hasHeaderRow) {
    parser.on('record', function(row, index){
      if (index === 0) {
        headers = row;
      }
    });
  }

  parser.on('end', function(){

    for (var i = 0; i < max; i++) {
      metadata.columns.push({'encrypt': false, 'name': headers[i]});
    }

    metadata.key = FILE_DB.length;
    metadata.lastUpdate = new Date().getTime();
    metadata._path = req.files.newFile.path;
    FILE_DB.push(metadata);
    
    res.redirect('/#/file/' + metadata.key);
  });
});

/**
 * Serve the file content
 * 
 * Errors:
 *   - 401, if the user is not logged in.
 *   - 403, if the user doesn't own the file.
 *   - 404, if the file doesn't exist.
 *   
 */
app.get('/file/:key(\\d+).csv', function(req, res) {
  var key = decodeURIComponent(req.params.key);
  if (!FILE_DB[key] || !FILE_DB[key]._path) {
    return res.send(404, 'Sorry, we cannot find that!');
  }
  setTimeout(function() {
    res.download(
      FILE_DB[key]._path,
      encodeURIComponent(key) + '.csv'
    );
  }, DELAY + 500);
});

/**
 * Send the file metadata (name, key, lastMofified, 
 * hasHeaderRow, delimiter, columns).
 *
 * Errors:
 *   - 401, if the user is not logged in.
 *   - 403, if the user doesn't own the file.
 *   - 404, if the file doesn't exist.
 */
app.get('/file/:key(\\d+)', function(req, res) {
  var key = decodeURIComponent(req.params.key);
  if (!FILE_DB[key]) {
    return res.send(404, 'Sorry, we cannot find that!');
  }

  setTimeout(function() {
    res.send(FILE_DB[key]);
  }, DELAY);
});

/**
 * Update the file metadata and encrypt columns if necessary.
 * 
 */
app.post('/file/:key(\\d+)', function(req, res) {
  var key = decodeURIComponent(req.params.key),
    newColumns = [];

  if (!FILE_DB[key]) {
    return res.send(404, 'Sorry, we cannot find that!');
  }

  // Check is any column needs to be encrypted
  for (var i = 0; i < FILE_DB[key].columns.length; i++) {
    if (FILE_DB[key].columns[i].encrypt !== req.body.columns[i].encrypt) {
      newColumns.push(i);
    }
  }

  // update metadata
  _.extend(FILE_DB[key], req.body);

  // replace path
  // NOTE: It's just a mock, it won't delete the plain data.
  FILE_DB[key]._path = encrypt(
    FILE_DB[key]._path,
    newColumns,
    FILE_DB[key].hasHeaderRow
  );

  setTimeout(function() {
    res.send(FILE_DB[key]);
  }, DELAY);
});

app.listen(9090);

console.log('Listening on port 9090');
