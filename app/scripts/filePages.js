angular.module('app.filePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('UploadCtrl', function($scope, API_BASE) {
    // TODO: validate form and send it with ajax.
    $scope.action = API_BASE + '/file';
  }).

  controller('EditCtrl', function($scope, $routeParams, $window, $q, files) {
    var updateMetadata, columnsCopy,  makeCopy;

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
        'header': false
      });

      // update parsed data
      $scope.data = $scope.metadata.hasHeaderRow ? result.results.slice(1): result.results;

      // TODO: decrypt data

      // watch for update of metadata.
      for (var i = 0; i < $scope.metadata.columns.length; i++) {
        $scope.$watch('metadata.columns['+i+'].encrypt', updateMetadata);
      }

      makeCopy();

      $scope.loading = false;
    });
  });
