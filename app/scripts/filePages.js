angular.module('app.filePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('UploadCtrl', function($scope, API_BASE) {
    // TODO: validate form and send it with ajax.
    $scope.action = API_BASE + '/file';
  }).

  controller('EditCtrl', function($scope, $routeParams, $window, $q, files) {
    // TODO: refactor the decryption into a servive.
    var updateMetadata, columnsCopy, makeCopy, decrypt;

    $scope.loading = true;
    
    $scope.data = [];
    $scope.rawData = "";
    $scope.metadata = {
      'name': '',
      'key': decodeURIComponent($routeParams.key),
      'delimiter': ',',
      'hasHeaderRow': false,
      'columns':[]
    };
    $scope.pem = '';

    $scope.range = function() {
      return $window._.range($scope.metadata.columns.length);
    };

    $scope.getValue = function(row, index) {
      return (row.length > index) ? row[index] : '';
    };

    $scope.getHeader = function(colIndex) {
      if ($scope.metadata.columns[colIndex].name) {
        return $scope.metadata.columns[colIndex].name;
      } else {
        return 'columns ' + colIndex;
      }
    };

    updateMetadata = $window._.debounce(function(){
      if ($window._.isEqual($scope.metadata.columns, columnsCopy)) {
        return;
      }
      console.log('updating metadata...');
      files.updateInfo($scope.metadata).then(function(){
        // TODO: alert user (or revert if failed)
      });

      makeCopy();
    }, 2000);

    makeCopy = function() {
      columnsCopy = $window._.map(
        $scope.metadata.columns,
        $window._.clone,
        $window._
      );
    };

    decrypt = function() {
      var indexes = [], crypt;

      if (!$scope.pem) {
        return;
      }

      // decrypt columns
      for (var i = 0; i < $scope.metadata.columns.length; i++) {
        if ($scope.metadata.columns[i].encrypt) {
          indexes.push(i);
        }
      }

      crypt = new $window.JSEncrypt();
      crypt.setPrivateKey($scope.pem);

      $scope.data.forEach(function(row) {
        row.forEach(function(cipher, index){
          var plain;
          if (indexes.indexOf(index) !== -1) {
            plain = crypt.decrypt(cipher);
            if (plain === null) { // wrong key
              return;
            }
            if (plain !== false) { // decrypted
              row[index] = plain;
            }
          }
        });
      });
    };

    $q.all([
      files.download($scope.metadata.key),
      files.info($scope.metadata.key)
    ]).then(function(respList) {
      var result;

      // update raw cvs content and metadata
      $scope.rawData = respList[0].data;
      $window._.extend(
        $scope.metadata,
        $window._.pick(
          respList[1], 'name', 'key', 'delimiter', 'hasHeaderRow', 'columns'
        )
      );

      // parse csv
      result = $window.jQuery.parse($scope.rawData, {
        'delimiter': $scope.metadata.delimiter,
        'header': false,
      });

      // update parsed data
      $scope.data = $scope.metadata.hasHeaderRow ? result.results.slice(1): result.results;

      decrypt();

      // watch for update of metadata or the private key pem.
      $scope.$watch('pem', $window._.debounce(function(){
        decrypt();
        $scope.$digest();
      }));
      for (var j = 0; j < $scope.metadata.columns.length; j++) {
        $scope.$watch('metadata.columns['+j+'].encrypt', updateMetadata);
      }

      makeCopy();

      $scope.loading = false;
    });
  });
