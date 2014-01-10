angular.module('app.filePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('UploadCtrl', function($scope, API_BASE) {
    // TODO: validate form and send it with ajax.
    $scope.action = API_BASE + '/file';
  }).

  controller('EditCtrl', function($scope, $routeParams, $window, files) {
    $scope.loading = true;
    // Key of file
    // TODO: key doesn't need to be name.
    $scope.name = decodeURIComponent($routeParams.fileName) || 'unknown';

    $scope.data = [];    // parsed data
    $scope.rawData = ""; // raw data (in case parsing fails)
    
    // CSV settings
    // TODO: let user define them.
    $scope.delimiter = ',';
    $scope.headerIncluded = false;

    // columns
    // TODO: add support for headers
    $scope.colCount = 0;
    $scope.headers = [];

    $scope.range = function() {
      return $window._.range($scope.colCount);
    };

    $scope.getValue = function(row, index) {
      return (row.length > index) ? row[index] : '';
    };

    files.download($routeParams.fileName).then(function(resp) {
      var result = $.parse(resp.data, {
        'delimiter': $scope.delimiter,
        'header': $scope.headerIncluded,
      });

      $scope.loading = false;
      
      $scope.data = result.results;
      $scope.colCount = $window._.max(
        result.results,
        function(e) {
          return e.length;
        }
      ).length;

    });
  });
